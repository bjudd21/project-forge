# Skill: Council Synthesis

This document provides the Council Chair agent with frameworks for multi-perspective synthesis, consensus detection, conflict resolution, recommendation prioritization, and stakeholder decision framing.

---

## Synthesis Process Overview

The Council Chair receives multiple independent review outputs and must produce a single coherent document that:
1. Is more useful than reading all reviews separately
2. Does not lose any critical finding in the summarization process
3. Gives the stakeholder a clear path forward

The process has four steps: **Cluster → Assess → Prioritize → Frame**.

---

## Step 1: Cluster Findings

Map all findings across reviewers into clusters. A cluster is a group of findings that address the same underlying issue.

Clusters with findings from multiple reviewers are **stronger signals**. A concern raised independently by two reviewers with different perspectives is more credible than a concern raised by one.

---

## Step 2: Assess Severity and Consensus

| Type | Definition | Synthesis Action |
|------|-----------|------------------|
| **Strong consensus** | Three or more reviewers raise the same concern | Lead the synthesis with this; weight CRITICAL |
| **Moderate consensus** | Two reviewers align | Present as significant finding |
| **Single reviewer concern** | Only one reviewer flagged it | Present faithfully with appropriate weight |
| **Conflict** | Two reviewers contradict each other | Present both positions; recommend resolution path |

### Severity Elevation Rules

- A MEDIUM finding becomes HIGH in synthesis if it appears in 3+ reviewer outputs
- A HIGH finding becomes CRITICAL if cluster-consistent and no reviewer contradicted it
- A single reviewer's CRITICAL finding remains CRITICAL — do not downgrade

---

## Step 3: Prioritize Revisions

**Tier 1 — Must Address Before Proceeding**
- Any CRITICAL-severity finding
- REVISE AND RESUBMIT from any reviewer

**Tier 2 — Should Address Before Proceeding**
- HIGH-severity findings that are specific and addressable
- MEDIUM findings in 2+ reviewers

**Tier 3 — Address in Next Pass**
- MEDIUM findings from one reviewer
- Concerns requiring more information

**Tier 4 — Optional Improvements**
- LOW-severity findings
- Style or clarity suggestions

---

## Step 4: Frame Conflicts for Stakeholders

```
**Conflict: [Topic]**

[Reviewer A] argues: [position, with their reasoning]
[Reviewer B] argues: [position, with their reasoning]

**Resolution path**: [What additional information would resolve this? What are the consequences of each choice?]
```

---

## Overall Verdict Decision Logic

```
IF any reviewer rated REVISE AND RESUBMIT:
  → Overall verdict: REVISE AND RESUBMIT

ELSE IF any CRITICAL finding exists:
  → Overall verdict: REVISE AND RESUBMIT

ELSE IF 2+ reviewers rated APPROVED WITH CONCERNS and HIGH findings exist:
  → Overall verdict: APPROVED WITH CONCERNS

ELSE IF 1 reviewer rated APPROVED WITH CONCERNS and findings are MEDIUM/LOW:
  → Overall verdict: APPROVED WITH CONCERNS

ELSE (all reviewers APPROVED, no HIGH+ findings):
  → Overall verdict: APPROVED
```

---

## Synthesis Quality Checklist

- [ ] Every reviewer's output is reflected
- [ ] Consensus points identified where 2+ reviewers agree
- [ ] Conflicts clearly presented with both sides and resolution path
- [ ] Revision list is ordered by priority
- [ ] Revisions are specific and actionable
- [ ] Stakeholder decisions clearly framed with options and consequences
- [ ] Overall verdict is justified by the findings
- [ ] Individual reviewer ratings included in output table
