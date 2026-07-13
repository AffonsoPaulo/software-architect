---
definition_of_ready: "Requirement, use case, and (for non-trivial items) relevant architecture/database decisions approved; no open questions blocking a developer from starting; Definition of Done criteria understood."
items:
  - id: TASK-001
    traces_to: ["US-001"]
    milestone: "milestone-core"
    priority: "high"
    status: "not_started"
  - id: TASK-002
    traces_to: ["US-001"]
    milestone: "milestone-core"
    priority: "high"
    status: "not_started"
    # Tenant Context Middleware + RLS policies — infra item enabling US-001 safely
  - id: TASK-003
    traces_to: ["US-001"]
    milestone: "milestone-core"
    priority: "medium"
    status: "not_started"
    # CI/CD pipeline setup — enables shipping US-001 at all
  - id: TASK-004
    traces_to: ["US-002"]
    milestone: "milestone-visibility"
    priority: "high"
    status: "not_started"
  - id: TASK-005
    traces_to: ["US-002"]
    milestone: "milestone-visibility"
    priority: "medium"
    status: "not_started"
    # Load testing infrastructure (k6 scripts, CI integration) — needed for milestone-visibility's done criterion
---

# Backlog

## Definition of Ready
Requirement/use case/relevant architecture approved, no open blocking questions, DoD understood.

## Items by milestone

### Milestone 1 — Core task management
- TASK-001 — Implement task creation (API-001, ENT-003/TBL-003). Traces to US-001.
- TASK-002 — Implement Tenant Context Middleware (ARCH-002) and RLS policies (ADR-002). Traces to US-001 (task creation must be tenant-safe from the start).
- TASK-003 — Set up CI/CD pipeline per `docs/13-deployment/deployment.md`. Traces to US-001.

### Milestone 2 — Task visibility
- TASK-004 — Implement task listing/filtering (API-002). Traces to US-002.
- TASK-005 — Set up load-testing infrastructure (k6, CI integration) to validate REQ-004. Traces to US-002.
