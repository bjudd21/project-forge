# Contract: Council Output Schema

**Phase**: 4 → 4.5 or 5 (Council Review → PM Destination Selection or Task Generation)
**File**: `workspace/{project-name}/handoffs/004-council-review.md`
**Validated by**: Phase 5 workflow before task generation

---

## Purpose

This contract defines the required structure of the council review output. The Phase 5 workflow and re-review gate node use this to verify the council completed a valid review, all required outputs are present, and the acceptance/rejection status is recorded.

---

## Required Frontmatter

```yaml
---
phase: council-review
project: [project name — kebab-case]
review_number: 1
date: [ISO 8601 date]
prd_version_reviewed: v[N]
reviewers:
  - technical-reviewer
  - security-reviewer
  - executive-reviewer
  - user-advocate
  - council-chair
overall_verdict: APPROVED | APPROVED_WITH_CONCERNS | REVISE_AND_RESUBMIT
status: ACCEPTED | REJECTED | PENDING
---
```

---

## Required Sections

- **Section 1**: `## Reviewer Outputs` — subsections for each reviewer with ≥3 findings each including severity
- **Section 2**: `## Council Chair Synthesis` — must contain Overall Verdict, Recommended PRD Revisions, Individual Reviewer Ratings table
- **Section 3**: `## User Decisions` — present even if PENDING
- **Section 4**: `## PRD Revision Log` — changes made as result of accepted recommendations
- **Section 5**: `## Re-Review Status` — Gate Decision: PROCEED | RECONVENE

---

## Validation Logic for Phase 5

```
HARD FAIL:
1. phase != "council-review"
2. overall_verdict missing or invalid
3. status == PENDING
4. Fewer than 4 reviewer subsections
5. Council Chair Synthesis missing
6. Re-review status missing or Gate Decision != PROCEED

PASS:
- All sections present
- status is ACCEPTED or REJECTED
- Gate Decision is PROCEED
```
