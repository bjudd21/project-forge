import { TierLimits } from '../types';

export const TIER_LIMITS: Record<string, TierLimits> = {
  FREE: {
    maxRunsPerMonth: 3,
    synthesisModel: 'claude-haiku-4-5-20251001',
    interviewModel: 'claude-haiku-4-5-20251001',
    reviewerModel: 'claude-haiku-4-5-20251001',
    chairModel: 'claude-haiku-4-5-20251001',
  },
  PRO: {
    maxRunsPerMonth: 30,
    synthesisModel: 'claude-sonnet-4-6',
    interviewModel: 'claude-haiku-4-5-20251001',
    reviewerModel: 'claude-haiku-4-5-20251001',
    chairModel: 'claude-sonnet-4-6',
  },
  ENTERPRISE: {
    maxRunsPerMonth: Infinity,
    synthesisModel: 'claude-sonnet-4-6',
    interviewModel: 'claude-haiku-4-5-20251001',
    reviewerModel: 'claude-sonnet-4-6',
    chairModel: 'claude-sonnet-4-6',
  },
};

export const MAX_REVISIONS = 3;

export const PHASE_NAMES: Record<number, string> = {
  2: 'PRD Interview',
  3: 'PRD Synthesis',
  4: 'Council Review',
};
