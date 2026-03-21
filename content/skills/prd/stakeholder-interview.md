# Skill: Stakeholder Interview

This document provides the PRD Interviewer agent with a structured question bank, coverage methodology, and probing techniques for requirements gathering conversations.

---

## Coverage Areas & Question Bank

### Area 1: Problem Statement & Success Criteria

**Opening questions:**
- "What is the specific problem this project solves — and who experiences it today?"
- "What happens right now when this problem occurs? What's the workaround?"
- "If this project succeeds completely, what changes for the user in measurable terms?"

**Probing for specificity:**
- "How often does this problem occur? Daily, weekly, per transaction?"
- "How many people are affected — 5 internal users, 500 customers, or 50,000 citizens?"

**Success criteria framing:**
- "If I showed you a dashboard 6 months after launch, what metric would tell you this worked?"

---

### Area 2: Target Users

**Primary user questions:**
- "Who is the primary user — the person who interacts with the system most often?"
- "What is their technical skill level? Are they developers, business users, or members of the public?"
- "What device do they use? Desktop, mobile, or both?"

**Secondary user questions:**
- "Is there anyone else who interacts with this system — approvers, auditors, administrators?"

---

### Area 3: Core Functionality

**Scope anchoring:**
- "If you had to list the 3-5 things this system absolutely must do to be useful, what would they be?"

**Feature clarification:**
- "When you say [feature], what does that mean from the user's perspective — what action do they take, and what does the system do in response?"

**Workflow mapping:**
- "Walk me through the most common scenario, step by step, from the user's perspective."

---

### Area 4: Scope & Boundaries

**MVP definition:**
- "What is the minimum version of this system that you'd put in front of real users?"
- "Is there anything on your wishlist that you could live without for the first release?"

**Explicit out-of-scope:**
- "Is there anything this system should explicitly NOT do, even if technically possible?"

---

### Area 5: Non-Functional Requirements

**Performance:**
- "When you say 'fast,' what does that mean — how long is acceptable for the slowest operation?"
- "How many concurrent users do you expect at peak?"
- "Is there a specific SLA or uptime requirement — 99%, 99.9%, 24/7 availability?"

**Availability & resilience:**
- "What happens if this system is down for 1 hour? Is this mission-critical?"

---

### Area 6: Compliance & Regulatory Requirements

**Direct inquiry:**
> "Does this project need to meet any government or regulatory compliance frameworks? For example:
> - **FISMA** — federal information systems
> - **FedRAMP** — cloud services used by federal agencies
> - **SOC 2** — commercial trust and security
> - **HIPAA** — healthcare data
> - **GDPR** — EU personal data
> - **Section 508 / WCAG** — accessibility
> - **NIST 800-171** — controlled unclassified information (CUI)
> - **PCI DSS** — payment card data"

**If yes to any:**
- "For [framework], what impact level or tier applies?"
- "Is an ATO (Authority to Operate) required?"

---

### Area 7: Technical Constraints

**Existing stack:**
- "Is this a new system or a modification to something that already exists?"
- "Are there organizational standards for technology choices?"

**Deployment environment:**
- "Where will this be deployed — on-premises, cloud (which provider?), or hybrid?"

---

### Area 8: Timeline & Resources

**Timeline:**
- "What is the target delivery date, and is it fixed or flexible?"
- "Why that date? What happens if you miss it?"

**Team:**
- "Who is building this? How many developers, and what are their skill levels?"
- "Will you be using AI coding tools for implementation?"

**Budget:**
- "Are there budget constraints that affect technology choices?"

---

## Probing Techniques

### Converting Vague to Specific

| Vague Answer | Probing Response |
|-------------|------------------|
| "It needs to be fast" | "What's the slowest operation a user would wait for? What's the maximum acceptable time?" |
| "It needs to be secure" | "Which aspects of security concern you most — authentication, data at rest, audit trails?" |
| "It needs to scale" | "What's the expected load at launch? What does 10x growth look like in 2 years?" |
| "Standard security" | "By 'standard,' do you mean password authentication, or MFA, SSO, or FIPS 140-2?" |

### Handling "I Don't Know"

1. **Offer bounded options**: "If you had to guess, would it be closer to A, B, or C?"
2. **Ask who would know**: "Who in your organization would have the answer?"
3. **Accept and note the gap**: "That's okay — I'll note this as an open question for the PRD."

---

## Interview Completion Checklist

Before emitting `INTERVIEW_COMPLETE`, verify:

- [ ] Problem is stated specifically
- [ ] Success is measurable (at least one quantified metric)
- [ ] Primary user is described with skill level and environment
- [ ] Core functionality covers the user's primary workflow end to end
- [ ] MVP scope is explicitly bounded (in AND out of scope)
- [ ] At least one NFR has a measurable target
- [ ] Compliance question was asked and answered
- [ ] Technical stack constraints are identified or noted as unconstrained
- [ ] Timeline and team composition are captured
