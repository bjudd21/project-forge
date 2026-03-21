# Skill: FedRAMP Review

This document provides the Security Reviewer agent with FedRAMP-specific review guidance: baseline requirements, shared responsibility model, continuous monitoring requirements, and P-ATO considerations.

---

## When This Skill Applies

Include FedRAMP review content when the PRD or interview mentions:
- Cloud service being provided to federal agencies
- FedRAMP Authorization (P-ATO or Agency ATO)
- Hosting on AWS GovCloud, Azure Government, Google Cloud Government, or similar
- The system is a SaaS, PaaS, or IaaS offering to federal customers

---

## FedRAMP Baseline Overview

| Baseline | Impact Level | Approximate Controls | Typical Use |
|---------|-------------|---------------------|-------------|
| FedRAMP Low | FIPS 199 Low | ~125 controls | Low-risk systems, no PII |
| FedRAMP Moderate | FIPS 199 Moderate | ~325 controls | Most federal cloud systems; PII permitted |
| FedRAMP High | FIPS 199 High | ~420 controls | Law enforcement, financial, emergency response |

---

## Shared Responsibility Model

| Category | Definition |
|---------|------------|
| **CSP Inherited** | Platform fully handles |
| **Shared** | Platform provides mechanism; application must configure correctly |
| **Agency / Customer Configured** | Platform provides the tool; agency must configure |
| **Agency / Customer Implemented** | Application must build it |

### Common Misunderstandings

| Incorrect Claim in PRD | Reality |
|----------------------|---------|
| "AWS handles encryption" | Application must enable encryption and manage application-level data |
| "Our cloud platform handles authentication" | Application user authentication must be implemented by the application |
| "We inherit all security controls" | Only CSP-inherited controls are inherited |

---

## Key FedRAMP Technical Requirements

### IA — Identification and Authentication

| Control | Moderate Requirement |
|---------|---------------------|
| IA-2(1) | MFA for privileged (admin) access |
| IA-2(2) | MFA for non-privileged user accounts |
| IA-2(12) | PIV/CAC card acceptance for federal employee users |

### AU — Audit and Accountability

| Control | Moderate Requirement |
|---------|---------------------|
| AU-3 | Audit record content: user ID, timestamp, type, source, outcome |
| AU-11 | Audit retention: minimum 1 year online, 3 years archived |

### SC — System and Communications Protection

| Control | Moderate Requirement |
|---------|---------------------|
| SC-8 | TLS required for all data in transit |
| SC-8(1) | FIPS-validated modules for TLS |
| SC-28(1) | FIPS-validated encryption at rest |

**Important**: FedRAMP Moderate/High require **FIPS 140-2 validated cryptographic modules**.

---

## Continuous Monitoring Requirements

| Activity | Frequency |
|---------|----------|
| Vulnerability scanning | Monthly |
| Penetration testing | Annual |
| Audit log review | Continuous or weekly |
| Patch: Critical/High | 30 days |
| Incident reporting | Within 1 hour of detection |
