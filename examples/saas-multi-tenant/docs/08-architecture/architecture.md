# Architecture

## Architectural style
Modular monolith — `[confirmation individual]`. Confirmed given the team's size (small enough that microservices' operational overhead isn't justified yet) and the MVP timeline constraint from Vision. Modularity within the monolith keeps a later split to services possible without a full rewrite.

## Architectural pattern
Layered — `[confirmation individual]`. Every request passes through the API layer (ARCH-001), then the cross-cutting Tenant Context Middleware layer (ARCH-002), before reaching data access (ARCH-003); PostgreSQL row-level security sits beneath the application layer as a second, independent enforcement layer, not a bypass path. Already implied by ADR-001 (module boundaries within the monolith) and ADR-002 (middleware + RLS as two enforcement layers) — no separate ADR needed for the pattern itself.

## Components

| ID | Component | Traces to | ADR |
|---|---|---|---|
| [ARCH-001](arch-001.md) | Application Server | (none) | ADR-001 |
| [ARCH-002](arch-002.md) | Tenant Context Middleware | REQ-003 | ADR-002 |
| [ARCH-003](arch-003.md) | Connection Pool + Read Replica Layer | REQ-004 | — |

## Core technologies
Node.js + PostgreSQL, deployed on AWS — `[confirmation individual]`. Confirmed based on the team's existing expertise (avoids a ramp-up cost the one-quarter MVP timeline can't absorb).

## Non-functional requirement coverage
| REQ-XXX (NFR) | Addressed by |
|---|---|
| REQ-003 (tenant isolation) | ARCH-002 / ADR-002 |
| REQ-004 (concurrency/latency) | ARCH-003 |

## Interaction style guidance
REST — a single API consumed by the web frontend (phase 10). No public third-party API in this release. Phase 09 details the actual endpoints.

## Context view
The whole system as one box: the web frontend and, indirectly, each customer organization's users, talk only to the Application Server over HTTPS. The Application Server is the only component with a network-facing surface; the database and its replicas are never reachable directly from outside AWS's private network.

```mermaid
graph TD
    Users["Customer org users (multiple tenants)"] --> Frontend["Web Frontend"]
    Frontend --> AppServer["TaskFlow (ARCH-001)"]
    AppServer --> DB[("PostgreSQL + replicas")]
    AppServer --> IdP["Google Workspace / Microsoft SSO"]
```

## Runtime view
Task creation (UC-001), showing the components collaborating at runtime:

```mermaid
sequenceDiagram
    participant FE as Web Frontend
    participant API as ARCH-001
    participant MW as ARCH-002
    participant DB as PostgreSQL (via ARCH-003)
    FE->>API: POST /v1/projects/{id}/tasks
    API->>MW: resolve tenant from session
    MW->>DB: insert task WHERE project.tenant_id = caller.tenant_id
    DB-->>API: task row or no rows (wrong tenant)
    API-->>FE: 201 or 404
```

## Crosscutting concepts
- **Logging**: structured JSON, every log line tagged with `tenant_id`, never with PII fields (per `docs/11-security/security.md`'s data classification) — enforced by a shared logging wrapper, not left to each module to remember.
- **Error handling**: every module throws a small set of typed application errors (NotFound, Forbidden, Validation); a single top-level handler in ARCH-001 maps them to the API's standard failure format (`docs/09-api-design/api.md`) — no module formats its own HTTP error response.
- **Configuration**: environment variables for non-secret config, AWS Secrets Manager for everything else (`docs/11-security/security.md`'s secrets strategy) — no config file checked into the repository.
- **Data access**: Repository-style modules per domain (no module runs raw queries directly), routing reads to the read replica and writes to primary via ARCH-003 — the same single enforcement point ADR-002 relies on for RLS, rather than isolation being one guarantee among many scattered ad hoc queries.

## Quality tree
Tenant isolation (REQ-003) was prioritized above all else, including above the MVP timeline itself — the team agreed no deadline pressure justifies shipping without ARCH-002 and its RLS backing. Latency (REQ-004) was prioritized above further modularity — the "Should have" priority reflects that a slower-than-ideal MVP is recoverable, a tenant-isolation failure is not.

## Risks and technical debt
- **Modular monolith may need to split before the next 10x of tenants**: acknowledged and deliberately deferred (ADR-001) — the module boundaries are kept clean specifically so this split doesn't require a rewrite when it becomes necessary.
- **Single Application Server type for all tenants**: a very large future tenant could still create noisy-neighbor pressure despite ARCH-003's read replicas; revisit with per-tenant resource limits if a specific customer's usage pattern demands it.

## Glossary
- **Read replica**: A read-only copy of the primary database, kept in sync asynchronously, used to offload read-heavy queries (task listing) from the primary.
- **Row-level security (RLS)**: A PostgreSQL feature that restricts which rows a query can see/modify based on a policy evaluated per-row — the second, independent enforcement layer behind REQ-003 (ADR-002).

```mermaid
graph TD
    CLI["Web Frontend"] --> API["ARCH-001: Application Server"]
    API --> Middleware["ARCH-002: Tenant Context Middleware"]
    Middleware --> Pool["ARCH-003: Connection Pool + Read Replicas"]
    Pool --> DB[("PostgreSQL")]
```
