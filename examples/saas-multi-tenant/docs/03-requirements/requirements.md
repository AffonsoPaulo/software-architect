---
requirements:
  - id: REQ-001
    type: "functional"
    description: "Users can create a task within a project, optionally assigning it to a team member."
    acceptance_criteria:
      - "Creating a task requires a title and a project; assignee and description are optional."
      - "A created task starts in 'To Do' status."
    traces_to: ["BR-002"]
    priority: "must"
    edge_cases:
      - "Attempting to create a task without specifying a project is rejected with a clear error (enforces BR-002)."
      - "Assigning a task to a user who isn't a member of the project's tenant is rejected."
  - id: REQ-002
    type: "functional"
    description: "Users can view all tasks in a project, filterable by status and/or assignee."
    acceptance_criteria:
      - "The task list for a project shows every task belonging to that project, respecting the current filters."
      - "Filtering by status and assignee simultaneously narrows to tasks matching both."
    traces_to: []
    priority: "must"
    edge_cases:
      - "A project with zero tasks shows an empty list, not an error."
  - id: REQ-003
    type: "non-functional"
    description: "Tenant data must be fully isolated — no tenant can access another tenant's data under any circumstance, including via crafted requests."
    acceptance_criteria:
      - "Every data-access path enforces tenant scoping at the query level, not only at the UI level — verified by an automated test that attempts cross-tenant access and asserts it's rejected."
    traces_to: []
    priority: "must"
    edge_cases:
      - "A user authenticated to Tenant A attempts to access a resource by guessing/incrementing an ID belonging to Tenant B — must be rejected identically to a not-found case, not leak existence."
  - id: REQ-004
    type: "non-functional"
    description: "The system must support at least 500 concurrent users across all tenants combined, with 95th-percentile API response time under 300ms."
    acceptance_criteria:
      - "Load testing at 500 concurrent simulated users shows p95 response time under 300ms for the task list and task creation endpoints."
    traces_to: []
    priority: "should"
    edge_cases:
      - "Load concentrated on a single large tenant — must not degrade response times for other tenants (no noisy-neighbor effect)."
---

# Requirements

## Functional requirements

### REQ-001 — Task creation
**Description**: Users can create a task within a project, optionally assigning it to a team member.
**Acceptance criteria**:
- [ ] Creating a task requires a title and a project; assignee and description are optional.
- [ ] A created task starts in 'To Do' status.
**Traces to**: BR-002
**Priority**: must
**Edge cases**:
- Creating a task without a project is rejected (enforces BR-002).
- Assigning to a user outside the project's tenant is rejected.

### REQ-002 — Task listing and filtering
**Description**: Users can view all tasks in a project, filterable by status and/or assignee.
**Acceptance criteria**:
- [ ] The task list shows every task in the project respecting current filters.
- [ ] Combined filters narrow to tasks matching both.
**Priority**: must
**Edge cases**:
- A project with zero tasks shows an empty list, not an error.

## Non-functional requirements

### REQ-003 — Tenant data isolation
**Description**: Tenant data must be fully isolated — no tenant can access another tenant's data under any circumstance.
**Acceptance criteria**:
- [ ] Every data-access path enforces tenant scoping at the query level, verified by an automated cross-tenant-access test.
**Priority**: must
**Edge cases**:
- Guessing/incrementing an ID belonging to another tenant must be rejected identically to not-found — no existence leak.

### REQ-004 — Concurrency and latency
**Description**: The system must support at least 500 concurrent users with p95 API response time under 300ms.
**Acceptance criteria**:
- [ ] Load testing at 500 concurrent users shows p95 under 300ms for task list and task creation.
**Priority**: should
**Edge cases**:
- Load concentrated on one large tenant must not degrade other tenants' response times.
