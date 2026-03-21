# Skill: FISMA Compliance Check

This document provides the Security Reviewer agent with FISMA-specific review guidance: control family checklist, impact level assessment, and inherited vs. system-specific control identification.

---

## When This Skill Applies

Include FISMA review content when the PRD or interview mentions:
- Federal government agency as the deploying or operating organization
- "ATO" (Authority to Operate)
- NIST 800-53
- FedRAMP
- CUI (Controlled Unclassified Information)

---

## Impact Level Assessment (FIPS 199)

| System Category | C | I | A |
|----------------|---|---|---|
| Low | Low | Low | Low |
| Moderate | Moderate (or any Mod) | — | — |
| High | High (any) | — | — |

### Common Federal System Categories

| System Type | Typical Category |
|-------------|------------------|
| Internal HR / employee portal | Low |
| Benefits payment system | Moderate |
| Citizen-facing tax or benefits portal | Moderate |
| Law enforcement records | High |

---

## Engineering-Relevant Control Families

| Family | Code | PRD Check |
|--------|------|----------|
| **Access Control** | AC | RBAC defined? Least privilege? |
| **Audit and Accountability** | AU | Security events logged? Retention stated? |
| **Identification and Authentication** | IA | Authentication required? MFA for privileged? |
| **System and Communications Protection** | SC | TLS required? Session management? |
| **System and Information Integrity** | SI | Input validation? Patch management? |

### Minimum Controls by Impact Level

**Low Baseline**: AC-2, AC-3, AU-2, AU-3, IA-2, IA-5, SC-8, SC-28, SI-10

**Moderate Baseline (adds to Low)**: IA-2(1) MFA for privileged, IA-2(2) MFA for non-privileged, SC-28(1) crypto at rest, RA-5 vulnerability scanning

**High Baseline (adds to Moderate)**: MFA required for ALL users, SC-8(1) FIPS-validated TLS

---

## Inherited vs. System-Specific Controls

### Always System-Specific (Cannot Be Inherited)

| Control | Why It Cannot Be Inherited |
|---------|---------------------------|
| AC-2 (Account Management) | Application manages its own user accounts |
| AC-3 (Access Enforcement) | Application enforces its own authorization logic |
| AU-2/AU-3 (Audit Logging) | Application generates its own audit events |
| IA-2 (Authentication) | Application authenticates its own users |
| SI-10 (Input Validation) | Application validates its own inputs |

---

## FISMA-Specific PRD Findings Templates

### Finding: Missing Impact Level

```
Finding: FISMA Impact Level Not Stated
Severity: HIGH
Description: All federal systems must be categorized under FIPS 199 before ATO can proceed.
Recommendation: Add to Section 8: "This system is categorized [Low/Moderate/High] under FIPS 199."
```

### Finding: MFA Not Required

```
Finding: MFA Absent for [Moderate/High]-Impact System
Severity: CRITICAL
Description: NIST 800-53 IA-2(1)/(2) requires MFA at Moderate baseline. Absence will prevent ATO.
Recommendation: Add to FR-[Authentication]: "All user accounts shall require multi-factor authentication."
```
