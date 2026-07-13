# Backlog

## Definition of Ready
Requirement, use case, and (for non-trivial items) relevant architecture/database decisions approved; no open questions blocking a developer from starting; Definition of Done criteria understood.

## Items by milestone

### Milestone 1 — Core task management

#### TASK-001 — Implement task creation
*Traces to: US-001, UC-001 · Priority: High · Status: Not started*

Implement task creation (API-001, ENT-003/TBL-003).

**Estimate**: 5 story points.
**Dependencies**: TASK-002 (Tenant Context Middleware must exist first — task creation is built tenant-safe from the start, not retrofitted).
**Acceptance test scenarios**: Given a valid title and project, creating a task returns 201 and the task appears in that project's list. Given a project belonging to another tenant, creating a task returns 404 with no distinguishable difference from a genuinely nonexistent project.

#### TASK-002 — Implement Tenant Context Middleware and RLS policies
*Traces to: US-001 · Priority: High · Status: Not started*

Implement Tenant Context Middleware (ARCH-002) and RLS policies (ADR-002).

**Estimate**: 8 story points.
**Dependencies**: None — this is the foundational item every tenant-scoped feature depends on.
**Acceptance test scenarios**: Given a request authenticated to Tenant A, any query attempting to touch Tenant B's rows returns zero rows at the database layer, independent of application-level logic.

#### TASK-003 — Set up CI/CD pipeline
*Traces to: US-001 · Priority: Medium · Status: Not started*

Set up CI/CD pipeline per `docs/13-deployment/deployment.md`.

**Estimate**: 3 story points.
**Dependencies**: TASK-001 (needs something to deploy to have a meaningful pipeline to validate against).
**Acceptance test scenarios**: A merge to main triggers the pipeline, runs TEST-001 through TEST-003, and deploys to staging automatically on success.

### Milestone 2 — Task visibility

#### TASK-004 — Implement task listing/filtering
*Traces to: US-002, UC-002 · Priority: High · Status: Not started*

Implement task listing/filtering (API-002).

**Estimate**: 5 story points.
**Dependencies**: TASK-001, TASK-002.
**Acceptance test scenarios**: Given a project with tasks in multiple statuses and assignees, filtering by status and assignee together returns exactly the matching subset. Given a project with zero tasks, the response is an empty list, not an error.

#### TASK-005 — Set up load-testing infrastructure
*Traces to: US-002, UC-002 · Priority: Medium · Status: Not started*

Set up load-testing infrastructure (k6, CI integration) to validate REQ-004.

**Estimate**: 5 story points.
**Dependencies**: TASK-004 (needs the listing endpoint to load-test), TASK-003 (needs the CI pipeline to integrate into).
**Acceptance test scenarios**: TEST-004 runs in CI on demand (not on every merge, given its cost) and produces a pass/fail signal against the p95 < 300ms threshold.
