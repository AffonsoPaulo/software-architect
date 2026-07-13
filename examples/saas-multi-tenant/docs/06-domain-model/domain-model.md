# Domain Model

## Entities and value objects

### ENT-001 — Tenant
*Kind: Entity · Traces to: UC-001*

**Attributes**
- name
- created at

**Invariants**
- A tenant's identifier, once assigned, never changes and is never reused, even if the tenant is deactivated.

**Belongs to aggregate**: itself is the root

### ENT-002 — Project
*Kind: Entity · Traces to: UC-001*

**Attributes**
- name
- tenant reference

**Invariants**
- A project always belongs to exactly one tenant, set at creation and never changed.

**Belongs to aggregate**: itself is the root

### ENT-003 — Task
*Kind: Entity · Traces to: UC-001, UC-002*

**Attributes**
- title
- description
- status
- assignee reference
- project reference

**Invariants**
- A task always belongs to exactly one project (BR-002).
- A task's assignee, if set, must be a member of the task's project's tenant.
- Status transitions only move forward (To Do → In Progress → Done) or to Deleted; a Done task cannot silently revert to To Do.

**Belongs to aggregate**: ENT-002

### ENT-004 — User
*Kind: Entity · Traces to: UC-001*

**Attributes**
- name
- email
- role
- tenant reference

**Invariants**
- A user belongs to exactly one tenant — no cross-tenant user accounts (a person on two customer teams needs two separate accounts).

**Belongs to aggregate**: itself is the root

## Aggregates
- **Tenant** (ENT-001): its own aggregate, root-level customer boundary.
- **Project** (ENT-002): aggregate root; contains Task (ENT-003) as part of its consistency boundary — `[confirmation individual]`, confirmed because task status transitions need to be consistent with the project they belong to (e.g. bulk project archival needs to affect all its tasks atomically).
- **User** (ENT-004): its own aggregate, referenced by Task but not owned by Project's aggregate.

## Ubiquitous language
| Term | Meaning |
|---|---|
| Tenant | A customer organization — the unit of data isolation across the whole product |
| Project | A container for related tasks, always scoped to one tenant |
| Task | A unit of trackable work, always scoped to one project |
| Team Member | A user role that can create/assign tasks and update tasks assigned to them |
| Project Admin | A user role that additionally can delete tasks and manage project membership |

## Bounded context notes
Single bounded context for this release — Tenant/Project/Task/User all live in one model with no translation layer between subdomains. Revisit if a future release (e.g. billing, reporting) introduces genuinely different language for the same concepts.

## Domain events
- **TaskCreated**: fired when a task is created; no current subscriber, but recorded here since Deployment's observability plan logs it for per-tenant activity metrics.
- **TaskStatusChanged**: fired on any status transition; same treatment — logged for observability, no functional subscriber yet in this release.

## Example scenario walkthrough
A Team Member at the design-partner's tenant creates a task "Fix homepage typo" in their "Website" project, assigning it to a colleague. ENT-003 (Task) is created with `project_id` pointing to the "Website" Project (ENT-002), which itself carries the design-partner's `tenant_id` (ENT-001). The assignee (ENT-004, User) is validated as belonging to that same tenant before the task is saved — satisfying Task's second invariant. The task starts in "To Do." When the colleague finishes the fix, they move it to "Done" — a valid forward transition per Task's third invariant. If someone later tried to move it back to "To Do," that would violate the invariant and is rejected.
