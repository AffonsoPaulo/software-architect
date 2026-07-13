---
controls:
  - id: SEC-001
    traces_to: ["ARCH-002", "API-001", "API-002"]
    description: "Every data-access query is scoped by tenant via ARCH-002's middleware-injected context, backed by PostgreSQL row-level security policies as an independent second enforcement layer (ADR-002)."
  - id: SEC-002
    traces_to: ["ARCH-001", "API-001", "API-002"]
    description: "All API access requires an authenticated session (OAuth/SSO); role-based authorization (Project Admin vs. Team Member, per BR-001) is enforced on every mutating endpoint."
threat_model:
  - component: "ARCH-002"
    threats:
      - category: "Information Disclosure"
        description: "A missed tenant-scoping check in a new query could leak another tenant's data."
        mitigation: "SEC-001"
  - component: "ARCH-001"
    threats:
      - category: "Elevation of Privilege"
        description: "A Team Member could attempt to call a Project-Admin-only action (e.g. task deletion) directly against the API, bypassing UI-level role checks."
        mitigation: "SEC-002"
data_classification:
  - data: "Task titles and descriptions"
    classification: "business-sensitive"
    handling: "Not encrypted beyond standard at-rest database encryption; access controlled entirely by tenant/role scoping (SEC-001, SEC-002) — no special handling beyond that was requested by the design-partner customer."
  - data: "User email addresses"
    classification: "PII"
    handling: "Standard at-rest encryption; never included in logs; only accessible to users within the same tenant."
authentication:
  mechanism: "OAuth via SSO (Google Workspace and Microsoft supported at launch) — `[confirmation individual]`."
authorization:
  model: "RBAC — Project Admin and Team Member roles, per Business Analysis's actor definitions — `[confirmation individual]`."
compliance:
  - "GDPR applies (the design-partner customer has EU-based team members); no other regulatory frameworks required at launch — `[confirmation individual]`."
secrets_strategy: "AWS Secrets Manager for database credentials and OAuth client secrets — `[confirmation individual]`."
---

# Security

## Threat model
### ARCH-002 — Tenant Context Middleware
- **Information Disclosure**: a missed tenant-scoping check in a new query could leak another tenant's data. Mitigated by SEC-001 (middleware scoping + RLS as an independent second layer).

### ARCH-001 — Application Server
- **Elevation of Privilege**: a Team Member could call a Project-Admin-only action directly, bypassing UI-level checks. Mitigated by SEC-002 (server-side RBAC enforcement, not UI-only).

## Authentication and authorization
OAuth via SSO (Google Workspace, Microsoft) — `[confirmation individual]`. RBAC with Project Admin / Team Member roles — `[confirmation individual]`.

## Data classification
Task titles/descriptions: business-sensitive. User emails: PII, standard at-rest encryption, never logged.

## Compliance
GDPR applies (EU-based team members at the design-partner customer) — `[confirmation individual]`. No other frameworks required at launch.

## Secrets strategy
AWS Secrets Manager for database credentials and OAuth client secrets — `[confirmation individual]`.

## Controls

### SEC-001 — Tenant isolation enforcement
Protects: ARCH-002, API-001, API-002. See threat model above.

### SEC-002 — Authentication and role-based authorization
Protects: ARCH-001, API-001, API-002. Both API-001 and API-002 require an authenticated session; API-001 (task creation) additionally checks the caller's role doesn't block the action per BR-001 semantics (task creation isn't Admin-only, but deletion — not yet in this release's API — will be when added).
