# Skill: Government PRD Requirements

This document provides conditional guidance for projects subject to government compliance frameworks. It is injected into the PRD Writer and PRD Interviewer when the interview identifies applicable frameworks (FISMA, FedRAMP, NIST 800-171, Section 508, or similar).

---

## When This Skill Applies

| Signal | Framework | Key Concern |
|--------|-----------|-------------|
| Federal agency system | FISMA | Security categorization, ATO, NIST 800-53 controls |
| Cloud service to federal agencies | FedRAMP | Authorized cloud, shared responsibility, continuous monitoring |
| Controlled Unclassified Information | NIST 800-171 | 110 security requirements, CUI handling |
| Federal accessibility requirement | Section 508 / WCAG 2.1 AA | All user interfaces, documents, and electronic content |

---

## FISMA: Federal Information Security Modernization Act

### Security Categorization (FIPS 199)

| Impact Level | When to Use |
|-------------|-------------|
| **Low** | Loss of CIA would have limited adverse effect |
| **Moderate** | Loss of CIA would have serious adverse effect |
| **High** | Loss of CIA would have severe or catastrophic effect |

PRD must state: `This system is categorized [Low/Moderate/High] under FIPS 199.`

### FISMA-Driven Requirements

When FISMA applies, the PRD must explicitly require:

| Requirement | FR or NFR |
|-------------|----------|
| Multi-factor authentication for privileged users | FR — Authentication |
| Session timeout after [N] minutes of inactivity | FR — Session Management |
| Audit logging of all user actions and admin events | FR — Audit Logging |
| Encryption at rest for all sensitive data | NFR — Security |
| Encryption in transit (TLS 1.2+) | NFR — Security |

---

## Section 508 / WCAG 2.1 AA: Accessibility

PRD must include explicit accessibility FRs:

```markdown
**FR-[N]: Accessibility Compliance**

All user-facing interfaces shall conform to WCAG 2.1 Level AA and Section 508 standards.

Acceptance Criteria:
- [ ] All images have appropriate alt text
- [ ] All form fields have programmatic labels
- [ ] All interactive elements are keyboard-navigable
- [ ] Color is not the sole means of conveying information
- [ ] Error messages identify the field in error and describe how to correct it
```

---

## Compliance Section Template for PRD

```markdown
## 8. Compliance Requirements

### 8.1 Applicable Frameworks
| Framework | Applicability | Lead |
|-----------|--------------|------|

### 8.2 Security Categorization (FISMA)
[FIPS 199 categorization and rationale]

### 8.3 ATO Pathway
[Timeline, inherited controls, system-specific controls]

### 8.4 Compliance-Driven Requirements
[Requirements that exist specifically to satisfy compliance]

### 8.5 Open Compliance Questions
[Decisions that must be made before development]
```
