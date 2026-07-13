# Requirements

## Functional requirements

### REQ-001 — Task creation
*Type: Functional · Priority: Must have · Traces to: BR-002 · Status: Approved*

Users can create a task within a project, optionally assigning it to a team member.

**Rationale**
Task creation is the entry point for the whole product — without it, nothing else in this document has anything to operate on. It directly implements BR-002 (a task always belongs to exactly one project) at the point of creation, rather than leaving that constraint to be enforced only later.

**Source**
The design-partner customer, during Discovery and Business Analysis — this is the digitized version of "add a row to the spreadsheet."

**Acceptance criteria**
- [ ] Creating a task requires a title and a project; assignee and description are optional.
- [ ] A created task starts in 'To Do' status.

**Edge cases**
- Attempting to create a task without specifying a project is rejected with a clear error (enforces BR-002).
- Assigning a task to a user who isn't a member of the project's tenant is rejected.

**Risk if not met**
Without reliable task creation, the product has no value proposition over the spreadsheet it's replacing — this is a Must-have in the strictest sense, not a priority label applied by convention.

**Verification method**
Automated integration test (TEST-001).

**Dependencies**
None — this is the first capability and doesn't depend on any other requirement.

### REQ-002 — Task listing and filtering
*Type: Functional · Priority: Must have · Traces to: (none) · Status: Approved*

Users can view all tasks in a project, filterable by status and/or assignee.

**Rationale**
Directly addresses the design-partner's stated pain point: finding "who owns this task" currently costs 5-10 minutes per lookup. This is the read-side counterpart to REQ-001 — creation without visibility would recreate the spreadsheet's core failure mode in a new tool.

**Source**
The design-partner customer, during Business Analysis (pain point discussion).

**Acceptance criteria**
- [ ] The task list for a project shows every task belonging to that project, respecting the current filters.
- [ ] Filtering by status and assignee simultaneously narrows to tasks matching both.

**Edge cases**
- A project with zero tasks shows an empty list, not an error.

**Risk if not met**
Task creation alone doesn't solve the stated pain point (finding ownership/status) — without this, the product only half-replaces the spreadsheet.

**Verification method**
Automated integration test (TEST-002).

**Dependencies**
Depends on REQ-001 existing (there must be tasks to list).

## Non-functional requirements

### REQ-003 — Tenant data isolation
*Type: Non-functional · Priority: Must have · Traces to: (none) · Status: Approved*

Tenant data must be fully isolated — no tenant can access another tenant's data under any circumstance, including via crafted requests.

**Rationale**
This is a multi-tenant product from day one; a single cross-tenant data leak would be an existential trust failure with every customer, not a bug to fix in a patch release. It's the one requirement the whole Architecture and Security phases are organized around.

**Source**
Inherent to the multi-tenant SaaS business model — not requested by the design partner explicitly (they only have one tenant's perspective), but a structural requirement of serving 10 different customer organizations on shared infrastructure.

**Acceptance criteria**
- [ ] Every data-access path enforces tenant scoping at the query level, not only at the UI level — verified by an automated test that attempts cross-tenant access and asserts it's rejected.

**Edge cases**
- A user authenticated to Tenant A attempts to access a resource by guessing/incrementing an ID belonging to Tenant B — must be rejected identically to a not-found case, not leak existence.

**Risk if not met**
Total loss of customer trust and likely contract termination for any affected tenant; potential legal exposure depending on the data involved (GDPR applies — see `docs/11-security/security.md`).

**Verification method**
Automated e2e cross-tenant-access test (TEST-003), plus PostgreSQL row-level security as an independent second enforcement layer (ADR-002).

**Dependencies**
None directly, but shapes ARCH-002 and every subsequent data-access decision.

### REQ-004 — Concurrency and latency
*Type: Non-functional · Priority: Should have · Traces to: (none) · Status: Approved*

The system must support at least 500 concurrent users across all tenants combined, with 95th-percentile API response time under 300ms.

**Rationale**
500 concurrent users is roughly 15x the design-partner's own team size, sized to comfortably cover the target of 10 customer organizations at similar scale without requiring an architecture change before that goal is reached.

**Source**
Engineering lead's estimate, confirmed with the product lead against the "10 customers" business objective in Vision.

**Acceptance criteria**
- [ ] Load testing at 500 concurrent simulated users shows p95 response time under 300ms for the task list and task creation endpoints.

**Edge cases**
- Load concentrated on a single large tenant — must not degrade response times for other tenants (no noisy-neighbor effect).

**Risk if not met**
Slow response times under real usage would undermine the "faster than the spreadsheet" value proposition that's the whole basis for the Business objective's adoption target — a Should-have because it's about experience quality, not correctness, but with real consequence if badly missed.

**Verification method**
Automated load test (TEST-004), using k6.

**Dependencies**
None directly, but shapes ARCH-003 (connection pooling, read replicas).
