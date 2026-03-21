export interface AgentManifest {
  name: string;
  role: 'reviewer' | 'interviewer' | 'synthesizer' | 'executor';
  version: string;
  prompt: string;
  skills: string[];
  stance: 'adversarial' | 'advocacy' | 'neutral' | 'synthesis';
  parameters: {
    temperature: number;
    max_tokens: number;
    top_p?: number;
  };
  context_budget: number;
  model_tier: 'free' | 'pro' | 'enterprise';
  input_contract: string | null;
  output_contract: string;
  description?: string;
  tags?: string[];
}

export enum PipelineState {
  IDLE = 'IDLE',
  RUNNING_PHASE = 'RUNNING_PHASE',
  AWAITING_INPUT = 'AWAITING_INPUT',
  AWAITING_DECISION = 'AWAITING_DECISION',
  REVISION_LOOP = 'REVISION_LOOP',
  COMPLETE = 'COMPLETE',
  FAILED = 'FAILED',
}

export interface ProgressEvent {
  type: 'phase_start' | 'agent_start' | 'token_chunk' | 'agent_complete' | 'phase_complete' | 'verdict';
  pipelineRunId: string;
  phase: number;
  agentName?: string;
  content?: string;
  progress?: number;
  verdict?: string;
  timestamp: string;
}

export interface HandoffArtifact {
  phase: string;
  completed: string;
  agent: string;
  project: string;
  content: string;
  metadata: Record<string, unknown>;
}

export type Tier = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface TierLimits {
  maxRunsPerMonth: number;
  synthesisModel: string;
  interviewModel: string;
  reviewerModel: string;
  chairModel: string;
}
