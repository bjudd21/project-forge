# Contract: PRD Interview Output Schema

**Phase**: 2 → 3 (Interview → PRD Synthesis)
**File**: `workspace/{project-name}/handoffs/002-prd-interview.md`
**Validated by**: Phase 3 workflow before starting PRD synthesis

---

## Purpose

This contract defines the required structure and content of the interview handoff artifact produced by Phase 2. Phase 3 (PRD Writer) will reject an incomplete handoff and require re-running or manually completing Phase 2.

---

## Required Frontmatter

The handoff file must begin with a valid YAML frontmatter block:

```yaml
---
phase: prd-interview
completed: [ISO 8601 timestamp — e.g., 2026-02-28T14:32:00Z]
agent: prd-interviewer
project: [project name — no spaces, kebab-case]
entry_point: greenfield | repo-analysis | multi-repo-analysis
compliance_applicable: true | false
compliance_frameworks: [list of frameworks, or empty list]
coverage_complete: true
---
```

**Validation rules:**
- `phase` must equal `prd-interview`
- `completed` must be a valid ISO 8601 timestamp
- `project` must be present and non-empty
- `entry_point` must be one of the three allowed values
- `coverage_complete` must be `true` — a `false` value indicates an incomplete interview and blocks Phase 3

---

## Required Sections

All six sections below must be present. A section is present if it contains at least one non-empty line below its heading.

### Section 1: Coverage Summary

**Heading**: `## Coverage Summary`

**Contents**: A table or checklist showing which of the 8 coverage areas were completed.

```markdown
## Coverage Summary

| # | Area | Status | Notes |
|---|------|--------|-------|
| 1 | Problem Statement & Success Criteria | ✓ | |
| 2 | Target Users | ✓ | |
| 3 | Core Functionality | ✓ | |
| 4 | Scope & Boundaries | ✓ | |
| 5 | Non-Functional Requirements | ✓ | Uptime target TBD |
| 6 | Compliance | ✓ | FISMA Moderate applies |
| 7 | Technical Constraints | ✓ | |
| 8 | Timeline & Resources | ✓ | |
```

**Validation rule**: No area may have status `incomplete` or be missing from the table.

---

### Section 2: Extracted Requirements

**Heading**: `## Extracted Requirements`

**Contents**: Structured summary of requirements organized by category.

Required subsections: Problem Statement, Success Criteria, Primary Users, Secondary Users, Core Functional Requirements, MVP Scope Boundary, Non-Functional Requirements, Technical Constraints, Timeline & Resources, Compliance.

**Validation rule**: All subsections must be present.

---

### Section 3: Raw Interview Transcript

**Heading**: `## Interview Transcript`

**Contents**: The complete conversation in chronological order.

**Validation rules:**
- Transcript must be present and non-empty
- Transcript must contain at least 6 exchanges
- Transcript must end with `INTERVIEW_COMPLETE` or equivalent completion signal

---

### Section 4: Open Questions

**Heading**: `## Open Questions`

**Contents**: Any questions not fully resolved during the interview.

**Validation rule**: Section must be present. May state no open questions if true.

---

### Section 5: Compliance Summary

**Heading**: `## Compliance Summary`

**Contents**: Summary of applicable compliance frameworks or explicit statement that none apply.

**Validation rule**: Section must be present. `compliance_applicable` in frontmatter must match this section.

---

### Section 6: Handoff Notes

**Heading**: `## Handoff Notes`

**Contents**: Any context the PRD Writer needs that doesn't fit the structured sections above.

**Validation rule**: Section must be present.

---

## Validation Logic for Phase 3

```
PASS conditions (all must be true):
1. Frontmatter parses without error
2. phase == "prd-interview"
3. coverage_complete == true
4. All 6 sections are present (by heading)
5. Section 3 (Transcript) contains at least 6 exchanges
6. No coverage area in Section 1 has status "incomplete"

FAIL conditions (any triggers rejection):
- Missing or malformed frontmatter
- coverage_complete == false
- Any required section missing
- Transcript contains fewer than 6 exchanges
- Any coverage area marked incomplete
```
