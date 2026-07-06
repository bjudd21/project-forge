# Project Forge — ARCHIVED (2026-07)

*Paste this at the top of `<owner>/project-forge`'s README, then archive the repo (Settings → Archive repository). Same pattern as WOS → Forge.*

---

> **⚠️ This repository is archived.** Project Forge — a multi-agent PRD pipeline (Interview → Synthesis → Council Review → Revision Loop) — was dispositioned on 2026-07-05: **harvested into the Code Factory, not revived as a product.** Decision record: Code Factory Decision Log **D-039**.
>
> **What moved, and where:**
>
> | Asset | New home (code-factory repo) |
> |---|---|
> | Council Review — 4 biased reviewers + Council Chair (prompts + depth skills) | `factory-skills/prompts/council/` + orchestrating skill `factory-skills/.claude/skills/council-review.md` |
> | Output contracts (council-output, council-reviewer-output schemas) | `factory-skills/contracts/` |
> | Agent manifests (YAML character sheets) | `factory-skills/agent-manifests/` |
> | Interview → Synthesis elicitation technique | folded into `factory-skills/.claude/skills/create-prd.md` (v0.4) |
>
> **Deliberately left here (retrievable if ever needed):** FISMA/FedRAMP compliance skills (compliance layer deferred, D-031), the PRD 8-section output schema, prd-interviewer/prd-writer runtime prompts, the SaaS business model, the 28-issue backlog, and all naming/landing/launch material.
>
> **Lineage:** WOS (`<owner>/workflow-orchestration-system`, frozen 2026-03) → Forge (this repo, frozen 2026-07) → Code Factory / Builders Gateway. Each generation's best work compounds forward.


# project-forge
AI-powered multi-agent PRD pipeline for IT managers and business users. Interview → Synthesis → Council Review → Revision Loop.
