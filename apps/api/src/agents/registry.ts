import path from 'path';
import fs from 'fs';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import type { AgentManifest } from '@project-forge/shared';

// From apps/api/src/agents/ up to repo root
const REPO_ROOT = path.resolve(__dirname, '../../../..');
const MANIFESTS_DIR = path.join(REPO_ROOT, 'content', 'manifests');

const AgentManifestSchema = z.object({
  name: z.string(),
  role: z.enum(['reviewer', 'interviewer', 'synthesizer', 'executor']),
  version: z.string(),
  prompt: z.string(),
  skills: z.array(z.string()),
  stance: z.enum(['adversarial', 'advocacy', 'neutral', 'synthesis']),
  parameters: z.object({
    temperature: z.number(),
    max_tokens: z.number(),
    top_p: z.number().optional(),
  }),
  context_budget: z.number(),
  model_tier: z.enum(['free', 'pro', 'enterprise']),
  input_contract: z.string().nullable(),
  output_contract: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export interface LoadedAgent {
  manifest: AgentManifest;
  // Full system prompt: agent prompt + all skill documents concatenated
  systemPrompt: string;
}

const registry = new Map<string, LoadedAgent>();

function resolveContentPath(manifestRelativePath: string): string {
  return path.join(REPO_ROOT, manifestRelativePath.replace(/^\.\//, ''));
}

function readTextFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

function assembleSystemPrompt(manifest: AgentManifest): string {
  const parts: string[] = [readTextFile(resolveContentPath(manifest.prompt))];

  for (const skillPath of manifest.skills) {
    const skillContent = readTextFile(resolveContentPath(skillPath));
    parts.push(`\n\n---\n\n${skillContent}`);
  }

  return parts.join('');
}

export function load(): void {
  if (!fs.existsSync(MANIFESTS_DIR)) {
    console.warn(`[agents] Manifests directory not found: ${MANIFESTS_DIR}`);
    return;
  }

  const yamlFiles = fs.readdirSync(MANIFESTS_DIR).filter(f => f.endsWith('.yaml'));

  for (const file of yamlFiles) {
    try {
      const raw = parseYaml(readTextFile(path.join(MANIFESTS_DIR, file)));
      const manifest = AgentManifestSchema.parse(raw) as AgentManifest;
      const systemPrompt = assembleSystemPrompt(manifest);
      registry.set(manifest.name, { manifest, systemPrompt });
    } catch (err) {
      console.warn(`[agents] Skipping ${file}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log(`[agents] Loaded ${registry.size} agents: ${[...registry.keys()].join(', ')}`);
}

export function get(name: string): LoadedAgent {
  const agent = registry.get(name);
  if (!agent) throw new Error(`Agent not found in registry: "${name}"`);
  return agent;
}

export function getByRole(role: AgentManifest['role']): LoadedAgent[] {
  return [...registry.values()].filter(a => a.manifest.role === role);
}

export function getAll(): LoadedAgent[] {
  return [...registry.values()];
}
