# Skill: Requirements Engineering

This document provides the PRD Interviewer and PRD Writer agents with structured techniques for eliciting, organizing, and validating requirements to produce a complete, measurable PRD.

---

## Requirements Quality Standards

A requirement is only valid if it passes all four tests:

| Test | Question | Fail Condition |
|------|----------|----------------|
| **Specific** | Does it describe one distinct behavior or property? | "The system shall be user-friendly" — too broad |
| **Measurable** | Can we verify it passed or failed? | "The system shall be fast" — no metric |
| **Achievable** | Is it technically feasible given constraints? | "Zero downtime during deployment" without blue-green infra |
| **Traceable** | Can it be linked to a user need or business goal? | Requirements without a "because" are scope creep waiting to happen |

---

## Functional vs. Non-Functional Requirements

### Functional Requirements (FRs)

Pattern: `The system shall [behavior] when [trigger/condition] for [actor].`

Good FR examples:
- `FR-3: The system shall send an email notification to the submitting user within 60 seconds of a form submission being approved or rejected.`
- `FR-7: The system shall prevent any user from accessing records outside their assigned organizational unit, enforcing this restriction at the API layer regardless of UI state.`

Bad FR examples:
- `The system shall be easy to use.` → Not a FR — translate to specific behaviors.
- `The system shall use PostgreSQL.` → Implementation detail.
- `The system shall handle errors gracefully.` → Vague.

### Non-Functional Requirements (NFRs)

Every NFR must have a measurable target.

| Category | Pattern | Example |
|----------|---------|---------|
| **Performance** | [operation] in [time] at [load] | Search returns results in < 500ms at 200 concurrent users |
| **Availability** | [system] achieves [uptime %] measured [period] | API gateway achieves 99.9% uptime measured monthly |
| **Scalability** | [system] supports [volume] without [degradation] | System supports 10,000 concurrent sessions |
| **Security** | [asset/operation] requires [control] | All user sessions require MFA authentication |
| **Data** | [data] retained for [period] per [requirement] | Audit logs retained 7 years, encrypted at rest |

---

## Acceptance Criteria Methodology

### Format: Given/When/Then

```
Given [a specific initial state],
When [a specific action occurs],
Then [a specific, observable outcome results].
```

### Acceptance Criteria Completeness Check

For each FR, verify criteria cover:

- [ ] **Happy path**: The normal successful case
- [ ] **Edge cases**: Boundary conditions
- [ ] **Failure cases**: What happens when input is invalid
- [ ] **Authorization**: What a user without permission receives

---

## User Stories Structure

```
**US-N: [Story Name]**
As a [specific persona],
I want to [specific action],
So that [specific outcome that matters to them].

Acceptance Criteria:
- Given [state], when [action], then [result]
```

### Common Mistakes to Avoid

| Mistake | Wrong | Right |
|---------|-------|-------|
| **Generic persona** | "As a user..." | "As an agency procurement officer..." |
| **Vague action** | "I want to manage my data" | "I want to export my transaction history as CSV" |
| **Missing outcome** | "So that it works" | "So that I can provide it to the auditor" |

---

## Scope Management

### The MVP Boundary Test

For every feature, ask: "If we removed this from the first release, would the system fail to solve the stated problem for the primary user?"

- If yes → MVP scope
- If no → candidate for future phase

---

## Completeness Checklist

### Functional Requirements
- [ ] All primary user stories have corresponding FRs
- [ ] All FRs have at least 2 acceptance criteria
- [ ] All acceptance criteria are testable
- [ ] Error handling is specified
- [ ] Authorization is specified

### Non-Functional Requirements
- [ ] At least one performance target with a number
- [ ] Availability or uptime requirement
- [ ] Security requirements explicitly stated
- [ ] Data retention requirement if system persists data

### User Stories
- [ ] All primary personas covered with ≥3 stories each
- [ ] All secondary personas covered with ≥1 story
- [ ] No stories with generic personas
