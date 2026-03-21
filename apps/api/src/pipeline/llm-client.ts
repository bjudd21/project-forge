import Anthropic from '@anthropic-ai/sdk';
import type { AgentManifest, ProgressEvent, Tier } from '@project-forge/shared';
import { TIER_LIMITS } from '@project-forge/shared';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface LLMResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
}

export interface LLMRequest {
  manifest: AgentManifest;
  systemPrompt: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  userTier: Tier;
}

function selectModel(manifest: AgentManifest, tier: Tier): string {
  const limits = TIER_LIMITS[tier];
  switch (manifest.role) {
    case 'interviewer':
      return limits.interviewModel;
    case 'reviewer':
      return limits.reviewerModel;
    case 'synthesizer':
      // Council Chair uses chairModel; PRD Writer uses synthesisModel
      return manifest.name.toLowerCase().includes('chair')
        ? limits.chairModel
        : limits.synthesisModel;
    default:
      return limits.synthesisModel;
  }
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error = new Error('Unknown error');
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        const delayMs = 1000 * Math.pow(2, attempt);
        console.warn(`[llm] Attempt ${attempt + 1} failed, retrying in ${delayMs}ms: ${lastError.message}`);
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
  }
  throw lastError;
}

// Streaming LLM call — yields ProgressEvents as tokens arrive, returns final LLMResponse
export async function* streamLLM(
  request: LLMRequest,
  pipelineRunId: string,
  phase: number,
): AsyncGenerator<ProgressEvent, LLMResponse, unknown> {
  const model = selectModel(request.manifest, request.userTier);
  let inputTokens = 0;
  let outputTokens = 0;
  let fullContent = '';

  const stream = client.messages.stream({
    model,
    max_tokens: request.manifest.parameters.max_tokens,
    temperature: request.manifest.parameters.temperature,
    ...(request.manifest.parameters.top_p !== undefined && {
      top_p: request.manifest.parameters.top_p,
    }),
    system: request.systemPrompt,
    messages: request.messages,
  });

  for await (const event of stream) {
    if (event.type === 'message_start') {
      inputTokens = event.message.usage.input_tokens;
    } else if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      const chunk = event.delta.text;
      fullContent += chunk;
      yield {
        type: 'token_chunk',
        pipelineRunId,
        phase,
        agentName: request.manifest.name,
        content: chunk,
        timestamp: new Date().toISOString(),
      };
    } else if (event.type === 'message_delta') {
      outputTokens = event.usage.output_tokens;
    }
  }

  return { content: fullContent, inputTokens, outputTokens, model };
}

// Non-streaming LLM call with retry — for cases where streaming isn't needed
export async function completeLLM(request: LLMRequest): Promise<LLMResponse> {
  const model = selectModel(request.manifest, request.userTier);

  const response = await withRetry(() =>
    client.messages.create({
      model,
      max_tokens: request.manifest.parameters.max_tokens,
      temperature: request.manifest.parameters.temperature,
      ...(request.manifest.parameters.top_p !== undefined && {
        top_p: request.manifest.parameters.top_p,
      }),
      system: request.systemPrompt,
      messages: request.messages,
    })
  );

  const content = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map(block => block.text)
    .join('');

  return {
    content,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    model,
  };
}
