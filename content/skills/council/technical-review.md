# Skill: Technical Review

This document provides the Technical Reviewer agent with an architecture evaluation framework, feasibility assessment checklist, scope realism benchmarks, and technology risk indicators for PRD review.

---

## Architecture Evaluation Framework

### 1. Component Coupling Assessment

| Coupling Type | Green Signal | Red Flag |
|--------------|-------------|----------|
| **Sync dependencies** | Service calls have defined timeouts and fallback behavior | "Service A calls Service B" with no mention of failure handling |
| **Shared database** | Each service owns its data | Multiple services writing to the same tables |
| **Deployment coupling** | Components can be deployed independently | PRD implies all components must deploy together |

### 2. Data Flow Validation

For each major user action trace: entry point → services touched → state created/modified → response path → failure modes.

**Red flags in data flow:**
- Data transformations described but not the format
- State changes touching multiple data stores with no transaction management
- External API calls inline with user-facing operations

### 3. Integration Point Analysis

For each integration with an external system, assess: Protocol, Authentication, Availability SLA, Rate limits, Schema ownership, Test environment.

**Unspecified integrations are hidden risk.**

---

## Feasibility Assessment Checklist

### Technical Complexity vs. Stated Timeline

| Feature Type | Baseline Complexity | Often Underestimated Because |
|-------------|--------------------|--------------------------|
| CRUD with basic auth | Low | Straightforward |
| Real-time (WebSocket, SSE) | Medium-High | Infrastructure, reconnect logic |
| Search | Medium-High | Indexing, relevance, performance at scale |
| OAuth / SSO integration | Medium-High | Token refresh, edge cases |
| Payments | High | PCI scope, refunds, disputes |
| Multi-tenancy | High | Data isolation, per-tenant config |

### Hidden Complexity Indicators

| Indicator | Hidden Complexity |
|-----------|-------------------|
| "Users can upload files" | File validation, storage, virus scanning, size limits, access control |
| "Real-time updates" | WebSocket infrastructure, connection lifecycle, reconnect, missed events |
| "Audit trail" | Every entity change logged with who/when/what, immutable storage |
| "Single sign-on" | IdP integration, claim mapping, session federation |

---

## Technology Risk Indicators

### "Build vs. Buy" Risk

| Built Proposal | Commodity Alternative | Flag Level |
|---------------|----------------------|-----------|
| Custom authentication system | Auth0, Okta, Cognito, Keycloak | HIGH — auth is hard to get right |
| Custom email delivery | SendGrid, SES, Postmark | MEDIUM |
| Custom queue/background jobs | Redis + Bull, SQS, Celery | MEDIUM |

### Missing Infrastructure Requirements

- [ ] CI/CD pipeline
- [ ] Environment strategy (dev, test, staging, prod)
- [ ] Secrets management
- [ ] Logging and monitoring
- [ ] Backup and disaster recovery
- [ ] Database migrations strategy

---

## PRD Review Checklist for Technical Reviewer

- [ ] Is the system's architecture described at a component level?
- [ ] Are all integration points identified with protocol and auth?
- [ ] Are failure modes described for critical paths?
- [ ] Does the timeline match the scope?
- [ ] Are there hidden complexity items in the FRs?
- [ ] Are NFRs achievable with the implied architecture?
