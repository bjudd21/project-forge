# Contract: PRD Output Schema

**Phase**: 3 → 4 (PRD Synthesis → Council Review)
**Validated by**: Phase 4 workflow before starting council review

---

## Purpose

This contract defines the required structure and content quality for a PRD handoff. Phase 4 (Council Review) will reject a PRD that is missing required sections, contains unmeasurable NFRs, or lacks measurable acceptance criteria.

---

## Required Frontmatter

```yaml
---
phase: prd-synthesis
project: [project name — kebab-case]
version: v[N]
date: [ISO 8601 date]
status: Draft | Under Review | Approved
entry_point: greenfield | repo-analysis | multi-repo-analysis
compliance: [list of frameworks] | none
source_interview: workspace/{project-name}/handoffs/002-prd-interview.md
source_analysis: workspace/{project-name}/handoffs/001-analysis-complete.md | none
---
```

---

## Required Sections

The following 7 sections are always required. Section 8 (Compliance) is required when `compliance` is not `none`.

- **Section 1**: `## 1. Executive Summary` — ≥2 paragraphs, ≥150 words, at least one measurable metric
- **Section 2**: `## 2. Functional Requirements` — ≥3 FRs, each with ≥2 acceptance criteria
- **Section 3**: `## 3. Non-Functional Requirements` — ≥2 NFRs with measurable targets
- **Section 4**: `## 4. User Stories` — ≥3 user stories with specific personas and Given/When/Then criteria
- **Section 5**: `## 5. Architecture Recommendations` — ≥100 words, no implementation-specific choices unless user-constrained
- **Section 6**: `## 6. Risk Assessment` — ≥2 risks with likelihood and impact
- **Section 7**: `## 7. MVP vs. Future Phases` — explicit MVP scope + at least 1 deferred item
- **Section 8**: `## 8. Compliance Requirements` — required when compliance ≠ none

---

## Validation Logic for Phase 4

```
HARD FAIL (blocks council review):
1. Frontmatter missing or malformed
2. phase != "prd-synthesis"
3. version missing or malformed
4. Any required section (1-7) missing
5. Section 8 missing when compliance != none
6. Fewer than 3 FRs
7. Any FR missing acceptance criteria
8. Fewer than 2 NFRs
9. Any NFR with no measurable target
10. Fewer than 3 user stories
11. Any user story with generic "user" persona
12. Risk section has fewer than 2 risks
13. Future phases section absent or empty

SOFT WARN (reported but not blocking):
- Fewer than 5 FRs
- Only 1 user persona
- No timeline mentioned
- FR contains framework/library names
```
