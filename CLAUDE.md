# Project Forge

## Purpose

SaaS web application that orchestrates multi-agent AI pipelines for IT managers and non-developer business users. The MVP pipeline takes a project idea through conversational interview → PRD synthesis → council review → revision loop, producing a professionally reviewed Product Requirements Document.

Codename "Project Forge" — final product name TBD.

## Status

Greenfield build. PRD Addendum v1.4 is the source of truth (`docs/prd-addendum-v1.4.md`). Agent prompts and skill documents ported from the Workflow Orchestration System reference implementation.

## Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: Clerk
- **LLM**: Anthropic API (Haiku 4.5 + Sonnet 4.6) via `@anthropic-ai/sdk`
- **Payments**: Stripe
- **Hosting**: Railway or Fly.io (backend), Vercel (frontend)
- **Monorepo**: Turborepo with `apps/web` and `apps/api`

## Commands

```bash
# Install dependencies
npm install

# Development (runs both frontend and API)
npm run dev

# Run API only
npm run dev --filter=api

# Run frontend only
npm run dev --filter=web

# Database
npx prisma migrate dev          # Run migrations
npx prisma generate             # Generate client
npx prisma studio               # Visual DB browser

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Architecture

```
project-forge/
├── apps/
│   ├── web/                     # React frontend (Vite + React Router)
│   │   ├── src/
│   │   │   ├── components/      # React components
│   │   │   ├── hooks/           # Custom hooks (useWebSocket, usePipeline)
│   │   │   ├── pages/           # Route pages
│   │   │   ├── lib/             # Utilities, API client
│   │   │   └── types/           # Shared TypeScript types
│   │   └── package.json
│   └── api/                     # Node.js backend (Express)
│       ├── src/
│       │   ├── routes/          # Express route handlers
│       │   ├── pipeline/        # Pipeline engine
│       │   │   ├── controller.ts    # Pipeline state machine
│       │   │   ├── phase-runner.ts  # Phase execution logic
│       │   │   ├── worker.ts        # Worker thread entry point
│       │   │   └── llm-client.ts    # Anthropic API wrapper
│       │   ├── agents/          # Agent manifest loader
│       │   ├── contracts/       # Handoff validation
│       │   ├── middleware/      # Auth, rate limiting
│       │   └── lib/             # Shared utilities
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
├── packages/
│   └── shared/                  # Shared types and constants
│       ├── src/
│       │   ├── types/           # AgentManifest, PipelineState, etc.
│       │   └── constants/       # Model config, tier limits
│       └── package.json
├── content/                     # Ported from WOS (read-only reference)
│   ├── prompts/                 # Agent system prompts
│   │   ├── prd-development/
│   │   └── prd-council/
│   ├── skills/                  # Skill documents
│   │   ├── prd/
│   │   └── council/
│   └── contracts/               # Handoff validation schemas
├── docs/
│   ├── prd-addendum-v1.4.md    # Source of truth
│   └── architecture.md
├── turbo.json
├── package.json
└── CLAUDE.md                    # This file
```

## Pipeline State Machine

```
IDLE → RUNNING_PHASE → AWAITING_INPUT → RUNNING_PHASE → ...
                ↑              ↓
                └── REVISION ──┘
                       ↓
                   COMPLETE
```

States: IDLE, RUNNING_PHASE, AWAITING_INPUT (interview), AWAITING_DECISION (council verdict), REVISION_LOOP, COMPLETE, FAILED.

## Key Design Decisions

1. **Worker Threads** — Pipeline execution runs in a Worker Thread, not the main Express process. Progress events flow: Worker → Main (postMessage) → Client (WebSocket).
2. **Mixed model strategy** — Haiku 4.5 for interview + reviewers (speed), Sonnet 4.6 for synthesis + chair (quality). Model selection is per-agent via the manifest's `model_tier` field.
3. **Handoff artifacts** — Markdown with YAML frontmatter, validated against schemas in `content/contracts/`. Pipeline phases communicate exclusively through these artifacts.
4. **Revision loop** — When council returns REVISE AND RESUBMIT, the controller re-runs Phase 3 (synthesis) with council feedback injected, then re-runs Phase 4 (council). Max 3 revisions.

## Agent Manifest Format

```yaml
name: "Security Reviewer"
role: "reviewer"
version: "1.0.0"
prompt: "./content/prompts/prd-council/core/security-reviewer.md"
skills:
  - "./content/skills/council/security-review.md"
stance: "adversarial"
parameters:
  temperature: 0.3
  max_tokens: 4096
context_budget: 8000
model_tier: "free"
input_contract: "./content/contracts/prd-output.schema.md"
output_contract: "./content/contracts/council-reviewer-output.schema.md"
```

## Model Configuration

| Model | ID | Input/MTok | Output/MTok | Used For |
|-------|----|-----------|-------------|----------|
| Haiku 4.5 | claude-haiku-4-5-20251001 | $1.00 | $5.00 | Interview, reviewers |
| Sonnet 4.6 | claude-sonnet-4-6 | $3.00 | $15.00 | Synthesis, chair |

## Tier Limits

| Tier | Runs/Month | Synthesis Model | Price |
|------|-----------|----------------|-------|
| Free | 3 | Haiku 4.5 | $0 |
| Pro | 30 | Sonnet 4.6 | $29/mo |
| Enterprise | Unlimited | Sonnet/Opus | Custom |

## Conventions

- All TypeScript, strict mode
- Prisma for database access (never raw SQL)
- Zod for runtime validation
- Agent prompts are markdown files read from disk at runtime (not embedded in code)
- Handoff artifacts validated against contract schemas before phase transitions
- Every API route requires auth middleware except `/api/auth/*` and `/api/billing/webhook`
- WebSocket connections authenticated via token in connection params
- Commit format: `type(scope): description` — e.g., `feat(pipeline): add revision loop state transition`

## Key Files

@docs/prd-addendum-v1.4.md
@apps/api/src/pipeline/controller.ts
@apps/api/src/pipeline/phase-runner.ts
@packages/shared/src/types/index.ts
