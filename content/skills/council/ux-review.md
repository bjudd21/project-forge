# Skill: UX Review

This document provides the User Advocate agent with user journey validation methodology, usability heuristics adapted for PRD review, accessibility baseline checks, and user value scoring frameworks.

---

## User Journey Validation

For each primary user persona, trace:

1. **Entry** — How does the user discover and access the system?
2. **Onboarding** — What does a first-time user encounter?
3. **Core loop** — What does the user do on a typical session?
4. **Edge cases** — What happens when something goes wrong?
5. **Exit** — How does the user leave? What state is preserved?

### Journey Coverage Checklist

| Stage | Questions |
|-------|-----------|
| **Discovery** | How do users find this? |
| **Registration/Access** | Is the sign-up or provisioning flow specified? |
| **First use** | What does the user see before any data exists? |
| **Primary task** | Can the user complete their primary goal? |
| **Error recovery** | What does the user see when something fails? |
| **Account management** | Can the user update profile, change password? |

---

## Usability Heuristics (Adapted for PRD Review)

| Heuristic | What to Check in the PRD |
|-----------|-------------------------|
| **Visibility of system status** | Does the PRD require feedback for long operations? Loading states? |
| **User control and freedom** | Can users undo actions? Cancel out of flows? |
| **Error prevention** | Does the PRD describe validation before submission? |
| **Error messages** | Are error messages specific and actionable? |

---

## State Coverage: The Missing States

| Missing State | Questions |
|--------------|----------|
| **Empty state** | What does the user see before any data exists? |
| **Loading state** | For operations > 1-2 seconds, what does the user see? |
| **Error state** | What does the user see when an operation fails? |
| **Permission-denied state** | When a user tries to do something unauthorized, what do they see? |
| **Success state** | Is the user clearly told when an action succeeds? |

---

## Accessibility Baseline

### Section 508 / WCAG 2.1 AA Minimum Requirements

| Requirement | Check |
|-------------|-------|
| **Keyboard navigation** | All interactive elements operable without a mouse |
| **Alt text** | All images have alt text |
| **Form labels** | All form fields have programmatic labels |
| **Color contrast** | Text meets 4.5:1 contrast ratio minimum |
| **Error identification** | Errors identify the field in error with text |
| **Responsive layout** | Content usable at 320px wide and 400% zoom |

### High-Risk Features for Accessibility

| Feature | Accessibility Risk |
|---------|-------------------|
| **Drag-and-drop** | Must provide keyboard-accessible alternative |
| **Real-time updates** | Screen readers must be notified via ARIA live regions |
| **Toast/notification messages** | Must be announced to screen readers |

---

## PRD Review Checklist for User Advocate

- [ ] Are all primary user personas described with role, skill, constraints, and goals?
- [ ] Do secondary personas have at least one user story?
- [ ] Can the primary user complete their main goal?
- [ ] Are empty states, error states, and loading states specified?
- [ ] Are error messages described as actionable?
- [ ] Is the onboarding/first-use experience described?
- [ ] Are destructive actions confirmed or reversible?
- [ ] Is accessibility mentioned?
