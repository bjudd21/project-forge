# Contract: Council Reviewer Output Schema

**Phase**: 4 (Council Review — Individual Reviewer)
**Validated by**: Phase 4 council runner before passing outputs to Council Chair

---

## Purpose

This contract defines the required structure for individual reviewer outputs (Technical, Security, Executive, User Advocate, and any specialized reviewers). The council runner validates each reviewer's output before passing the collection to the Council Chair for synthesis.

---

## Required Structure

Every reviewer output must follow this structure:

```markdown
## [Reviewer Type] Review

**Stated Biases**: [2-3 biases stated plainly]

**Overall Rating**: APPROVED | APPROVED WITH CONCERNS | REVISE AND RESUBMIT

**Findings** (3-5 items):

### Finding N: [Short title]
- **Type**: Concern | Endorsement
- **Severity**: CRITICAL | HIGH | MEDIUM | LOW
- **Confidence**: HIGH | MEDIUM | LOW
- **Description**: [What was found. Specific reference to FR or section.]
- **Recommendation**: [What change to the PRD would address this.]

**Summary**: [2-3 sentences on overall posture and what must be resolved.]
```

---

## Validation Rules

```
HARD FAIL (blocks council chair synthesis):
1. Review section heading missing
2. Overall Rating missing or not one of: APPROVED, APPROVED WITH CONCERNS, REVISE AND RESUBMIT
3. Fewer than 3 findings
4. Any finding missing Type, Severity, or Confidence
5. Summary section missing or empty

SOFT WARN (reported but not blocking):
- Fewer than 2 findings with Severity of HIGH or above
- Finding Description does not reference a specific FR or section
- No Endorsement findings (reviewer found nothing positive)
```

---

## Rating Definitions

| Rating | Meaning |
|--------|---------|
| **APPROVED** | No significant concerns. PRD can proceed. |
| **APPROVED WITH CONCERNS** | Addressable concerns found. PRD can proceed with revisions. |
| **REVISE AND RESUBMIT** | Critical gaps must be resolved before PRD advances. |

---

## Severity Definitions

| Severity | Meaning |
|----------|---------|
| **CRITICAL** | Fundamental gap that will cause failure if not addressed. Triggers REVISE AND RESUBMIT. |
| **HIGH** | Significant concern. Should be resolved before development starts. |
| **MEDIUM** | Addressable concern. Can proceed with awareness. |
| **LOW** | Minor observation or improvement suggestion. |

---

## Confidence Definitions

| Confidence | Meaning |
|------------|---------|
| **HIGH** | Clearly present or clearly stated in PRD. No ambiguity. |
| **MEDIUM** | PRD is ambiguous — may be addressed implicitly. Flag as question. |
| **LOW** | May be an issue depending on implementation details not in PRD. |
