# Skill: Security Review

This document provides the Security Reviewer agent with a threat modeling methodology, security requirements checklist, attack surface analysis framework, and compliance-aware review patterns for PRD assessment.

---

## Threat Modeling Methodology (STRIDE)

| Threat | Applies To | Key Questions |
|--------|-----------|---------------|
| **Spoofing** | Authentication | Can an attacker impersonate a legitimate user? |
| **Tampering** | Data integrity | Can data be modified in transit or at rest without detection? |
| **Repudiation** | Audit logging | Can a user deny performing an action? |
| **Information Disclosure** | Authorization, encryption | Can unauthorized users read data they shouldn't? |
| **Denial of Service** | Rate limiting, resilience | Can the system be made unavailable by flooding? |
| **Elevation of Privilege** | Authorization | Can a user gain capabilities beyond what they're authorized for? |

---

## Security Requirements Checklist

### Authentication

| Requirement | Priority |
|-------------|----------|
| All users must authenticate before accessing protected resources | CRITICAL |
| Passwords: 12+ chars, common password rejection | HIGH |
| MFA for privileged/admin accounts | HIGH |
| Account lockout after N failed attempts | HIGH |
| Session invalidation on password change | HIGH |

### Authorization

| Requirement | Priority |
|-------------|----------|
| Authorization enforced at API/service layer, not only in UI | CRITICAL |
| Role-based or attribute-based access control defined | HIGH |
| Horizontal access control: users cannot access other users' data | CRITICAL |

### Encryption

| Surface | Standard |
|---------|----------|
| Data in transit | TLS 1.2 minimum; TLS 1.3 preferred |
| Data at rest (sensitive) | AES-256 or equivalent |
| Password storage | bcrypt (cost ≥12), Argon2id, or scrypt |
| Cookies | HttpOnly; Secure; SameSite=Strict or Lax |

### Audit Logging

Must log: Authentication events, Authorization failures, Data access (sensitive records), Data modification (who/when/what changed), Admin actions, Security events.

Logs must include: timestamp (UTC), user ID, IP address, action, resource, outcome.
Logs must NOT include: passwords, full card numbers, SSNs, session tokens.

---

## PRD Review Checklist for Security Reviewer

- [ ] Is authentication explicitly required for all user-facing features?
- [ ] Is authorization defined and enforced at API layer?
- [ ] Is sensitive data identified and classified?
- [ ] Is encryption in transit required (TLS)?
- [ ] Is encryption at rest required for sensitive data?
- [ ] Is audit logging specified for security-relevant events?
- [ ] Is secrets management addressed?
- [ ] Are file uploads validated and scanned?
- [ ] Are there rate limiting or abuse prevention requirements?
