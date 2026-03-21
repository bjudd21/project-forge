# Project Forge — PRD Addendum v1.4

**Codename**: Project Forge (final product name TBD)
**Status**: Architecture decisions locked, ready for implementation
**Date**: 2026-03-21
**Supersedes**: AetrixOS PRD v1.3 (Electron/desktop decisions)
**Preserves**: Product philosophy, target user, pricing tiers, Founding Member program from v1.3

---

## 1. Strategic Context

### 1.1 What Changed

The original PRD (v1.3) specified an Electron/React/TypeScript desktop application with local Ollama inference. Through architecture review, four critical issues emerged:

1. **Distribution friction**: Electron requires download → install → Ollama setup → model pull before first use. For the target user (IT managers, non-developer business users), this funnel has catastrophic drop-off.
2. **Memory overhead**: Electron (~200MB) + Ollama (~4-18GB depending on model) leaves minimal headroom on 16GB laptops — the most common hardware for the target user.
3. **Dual-project drag**: The Workflow Orchestration System (WOS) and AetrixOS were developing in parallel with overlapping scope, competing for limited discretionary time.
4. **Revenue timeline**: SaaS deploys faster than desktop, scales with usage, and matches the 6-month revenue target.

### 1.2 What This Addendum Covers

This document captures four locked architecture decisions and their implications:

1. Agent manifest format (the agent definition schema)
2. Platform, architecture, and cost model
3. Model tier mapping across pricing tiers
4. MVP scope and first quest definition

### 1.3 WOS Disposition

The Workflow Orchestration System (`bjudd21/workflow-orchestration-system`) is frozen as a reference implementation. Its agent prompts, skill documents, handoff contracts, and pipeline patterns are ported into Project Forge as seed content. The WOS repo receives a final commit marking it as archived with a pointer to the new repo.

**Assets ported from WOS**:
- 7 agent system prompts (`prompts/prd-development/`, `prompts/prd-council/core/`)
- 10 skill documents (`skills/prd/`, `skills/council/`)
- 3 handoff contract schemas (`contracts/`)
- Pipeline phase sequencing pattern (Interview → Synthesis → Council Review)
- Coverage checklist and completion signal patterns

---

## 2. Decision 1: Agent Manifest Format

### 2.1 Design Philosophy

The agent definition schema follows a "professional first, RPG wink second" principle. The schema structure mirrors an RPG character sheet — but the field names use professional vocabulary that an IT manager immediately understands. A D&D player recognizes the layout without anyone explaining the metaphor.

The manifest IS the agent's configuration. It is not a UI skin over a separate config format.

### 2.2 Agent Manifest Schema

```yaml
# Example: Council Security Reviewer
name: "Security Reviewer"
role: "reviewer"                          # Archetype: reviewer | interviewer | synthesizer | executor
version: "1.0.0"

# Core behavior
prompt: "./prompts/prd-council/core/security-reviewer.md"
skills:                                    # Skill documents injected into LLM context
  - "./skills/council/security-review.md"
  - "./skills/council/fisma-compliance-check.md"
stance: "adversarial"                      # Review posture: adversarial | advocacy | neutral | synthesis

# Model configuration
parameters:
  temperature: 0.3
  max_tokens: 4096
  top_p: 0.9
context_budget: 8000                       # Estimated input token cost for orchestrator planning
model_tier: "free"                         # Minimum tier required: free | pro | enterprise

# Handoff contracts
input_contract: "./contracts/prd-output.schema.md"
output_contract: "./contracts/council-reviewer-output.schema.md"

# Metadata
description: "Identifies security risks, compliance gaps, and attack surface concerns in PRDs."
tags: ["security", "compliance", "review"]
```

### 2.3 Role Archetypes

| Role | Behavior Pattern | Examples |
|------|-----------------|----------|
| `interviewer` | Conversational, one question at a time, coverage tracking, completion signal | PRD Interviewer |
| `synthesizer` | Takes structured input, produces comprehensive document, quality-focused | PRD Writer, Council Chair |
| `reviewer` | Takes document input, produces structured critique with severity ratings | Technical, Security, Executive, User Advocate reviewers |
| `executor` | Takes task definition, produces code or action output | Task decomposer (post-MVP) |

### 2.4 UI Mapping

The agent manifest renders in the UI as a card with visual structure reminiscent of a character sheet:

- **Header area**: Name, role badge, stance indicator
- **Skills block**: List of attached skill documents
- **Parameters panel**: Temperature, token budget, model tier
- **Contract indicators**: Input/output schema references

Users building custom agents fill out this card. The fields map 1:1 to the YAML manifest.

---

## 3. Decision 2: Platform, Architecture & Cost Model

### 3.1 Platform Decision

**SaaS web application** with a deferred optional local CLI mode.

| Component | Choice | Rationale |
|-----------|--------|----------|
| Frontend | React + TypeScript + Tailwind | Preserved from v1.3, web-native |
| Backend | Node.js (Express or Fastify) | TypeScript end-to-end, Worker Threads for pipeline |
| LLM Inference | Anthropic API / AWS Bedrock (on-demand) | No GPU infrastructure, pay-per-token |
| Database | PostgreSQL (Supabase or Neon) | User accounts, pipeline state, run history |
| File Storage | S3/R2 | Handoff artifacts, exported PRDs |
| Auth | Clerk or Auth0 | Free tier available, SSO for Enterprise |
| Hosting | Vercel/Railway/Fly.io | Deploy from Git, auto-scaling |

### 3.2 Architecture

```
┌─────────────────────────────────────────────────┐
│  React Frontend (Vercel/CDN)                    │
│  - Interview chat UI                            │
│  - Council review live stream                   │
│  - Agent manifest editor (post-MVP)             │
└───────────────┬─────────────────────────────┘
                │ REST / WebSocket
┌───────────────▼─────────────────────────────┐
│  Node.js API Server                             │
│  ┌────────────────────┐  ┌────────────────────┐ │
│  │  Main Thread        │  │  Pipeline Worker   │ │
│  │  - Auth middleware   │  │  - Pipeline ctrl   │ │
│  │  - API routes        ◄│►│  - Phase runner    │ │
│  │  - WebSocket relay   │  │  - Contract valid  │ │
│  │  - IPC relay         │  │  - API calls       │ │
│  └────────────────────┘  └─────────┬──────────┘ │
└─────────────────────────────────────────┬────────┘
                                     │ HTTP
                    ┌────────────────▼────────────┐
                    │  Anthropic API / Bedrock     │
                    │  (Haiku 4.5 + Sonnet 4.6)   │
                    └─────────────────────────────┘
```

**Worker Thread architecture**: The Pipeline Worker runs in a Node.js Worker Thread, communicating with the main thread via `postMessage`. This keeps the API server responsive during multi-minute pipeline runs.

### 3.3 Cost Model

#### Token Budget Per Pipeline Run

| Phase | Agent(s) | Input Tokens | Output Tokens | Model |
|-------|----------|-------------|---------------|-------|
| Interview (8 turns + extraction) | Interviewer | ~82K | ~6K | Haiku 4.5 |
| PRD Synthesis | PRD Writer | ~10K | ~5K | Sonnet 4.6 |
| Council Review (4 reviewers) | Tech, Security, Exec, UX | ~36K | ~8K | Haiku 4.5 |
| Council Chair Synthesis | Chair | ~17K | ~3K | Sonnet 4.6 |
| **Total per run** | | **~145K** | **~22K** | |

#### Per-Run Cost by Model Strategy

| Strategy | Cost/Run | Notes |
|----------|----------|-------|
| All Haiku 4.5 ($1/$5 per MTok) | $0.26 | Cheapest, good quality |
| **Mixed: Haiku + Sonnet (recommended)** | **$0.39** | **Haiku for speed agents, Sonnet for synthesis/judgment** |
| All Sonnet 4.6 ($3/$15 per MTok) | $0.77 | Best quality, highest cost |

---

## 4. Decision 3: Model Tier Mapping

### 4.1 Tier Structure

| | Free | Pro ($29/mo) | Enterprise (custom) |
|---|---|---|---|
| **Pipeline runs/month** | 3 | 30 | Unlimited |
| **Interview + Reviewers** | Haiku 4.5 | Haiku 4.5 | Haiku 4.5 or Sonnet 4.6 |
| **Synthesis + Chair** | Haiku 4.5 | Sonnet 4.6 | Sonnet 4.6 or Opus 4.6 |
| **Custom agents** | — | Yes | Yes |
| **Export formats** | Markdown only | Markdown + DOCX + PDF | All + API access |
| **SSO / Audit log** | — | — | Yes |
| **Local mode (Ollama CLI)** | — | — | Yes |

---

## 5. Decision 4: MVP Scope — "First Quest"

### 5.1 MVP Pipeline

```
Phase 2: PRD Interview      → Conversational requirements gathering (chat UI)
         ↓ (auto-chains)
Phase 3: PRD Synthesis       → Sonnet synthesizes a full PRD from the interview
         ↓ (auto-chains)
Phase 4: Council Review      → 4 specialist agents review; chair synthesizes
         ↓
         ├── APPROVED → Export PRD
         ├── APPROVED WITH CONCERNS → Export PRD with revision notes
         └── REVISE AND RESUBMIT → Revision Loop
                ↓
Phase 3 (retry): Re-synthesis → Sonnet revises PRD with council feedback injected
         ↓ (auto-chains)
Phase 4 (retry): Re-review   → Council reviews revised PRD
         ↓
         (repeat until APPROVED or user accepts current version)
```

### 5.2 The Revision Loop (Key Differentiator)

When the council returns "REVISE AND RESUBMIT" or "APPROVED WITH CONCERNS," the user sees:

1. Council verdict and all reviewer feedback displayed in the UI
2. A "Revise PRD" button that re-triggers Phase 3 with the council's feedback injected
3. The revised PRD automatically flows back through Phase 4 for re-review
4. The user can also manually override: "Accept as-is" to export the current version

### 5.3 What Ships in MVP

| Component | Included | Notes |
|-----------|----------|-------|
| User auth (signup/login) | Yes | Clerk |
| Interview chat UI | Yes | Port from WOS frontend |
| Real-time pipeline progress | Yes | WebSocket streaming |
| Council review display | Yes | Live reviewer cards with streamed output |
| Revision loop | Yes | Key differentiator |
| PRD export (markdown) | Yes | Download button |
| Agent manifest viewer | Yes | Read-only view of the 7 agents |
| Billing / Stripe integration | Yes | Free + Pro tiers |
| Custom agent builder | No | Post-MVP |
| Task generation (Phase 5) | No | First post-MVP feature drop |

### 5.4 Post-MVP Roadmap (Priority Order)

1. **Task Generation** (Phase 5) — PRD → structured task list
2. **DOCX/PDF export** — Professional document formats
3. **Custom agent builder** — Users create and configure their own agents
4. **GitHub Issues integration** — Task list → GitHub Issues
5. **Local mode CLI** — Enterprise feature for data-sovereignty customers

### 5.5 Founding Member Program

- Founding Member pricing: $19/mo (locked for life) vs. $29/mo standard Pro
- Limited to first 100 members
- Includes all Pro features + input on roadmap priorities
- Marketing via "The IT Guy Explains" YouTube channel

---

## 6. Technical Specifications

### 6.1 Pipeline State Machine

```typescript
enum PipelineState {
  IDLE,
  RUNNING_PHASE,
  AWAITING_INPUT,      // Interview waiting for user response
  AWAITING_DECISION,   // Council verdict displayed, user chooses: accept or revise
  REVISION_LOOP,       // Re-running synthesis with council feedback
  COMPLETE,
  FAILED
}
```

### 6.2 API Routes (MVP)

```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/pipelines                    # List user's pipeline runs
POST   /api/pipelines                    # Start new pipeline run
GET    /api/pipelines/:id                # Get pipeline status + artifacts
POST   /api/pipelines/:id/interview      # Send interview message
POST   /api/pipelines/:id/revise         # Trigger revision loop
POST   /api/pipelines/:id/accept         # Accept current PRD
GET    /api/pipelines/:id/export         # Download PRD artifact
WS     /api/pipelines/:id/stream         # WebSocket for live progress events
GET    /api/agents                       # List available agent manifests
GET    /api/usage                        # Current month usage stats
POST   /api/billing/checkout             # Stripe checkout session
POST   /api/billing/webhook              # Stripe webhook handler
```

---

## 7. Open Questions & Testable Hypotheses

| ID | Question | Resolution Path |
|----|----------|-----------------|
| H-1 | Does Haiku-only free tier convert to Pro at acceptable rate? | A/B test post-launch |
| H-2 | Is 3 free runs/month the right cap? | Monitor free-to-Pro conversion by cohort |
| H-3 | Do users actually use the revision loop? | Track revision rate and correlate with NPS |
| Q-1 | Final product name | Separate naming session; codename "Project Forge" until resolved |
| Q-2 | Prompt caching ROI | Measure cache hit rates after launch |
| Q-3 | Enterprise pricing | Defer until first Enterprise inquiry |
