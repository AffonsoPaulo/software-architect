# User Stories

### US-001 — Create a task
*Traces to: REQ-001 · Priority: Must have*

**As a** Team Member, **I want to** create a task in a project and optionally assign it to someone, **so that** work gets tracked from the moment it's identified.

**Business value**
Directly replaces the design-partner's current "add a row to the spreadsheet" action — the single most frequent operation in their existing workflow, so it has to work smoothly from day one.

**Acceptance criteria**
- [ ] Creating a task requires a title and a project; assignee is optional.
- [ ] A new task starts in 'To Do' status.

**Non-functional considerations**
Must respect REQ-003's tenant isolation from the first line of code — see the Special cases note in `docs/05-use-cases/use-cases.md`'s UC-001 about building this tenant-safe rather than retrofitting it.

**Out of scope for this story**
Bulk task creation (e.g. CSV import) — explicitly deferred, not part of this story's acceptance criteria.

**Open questions**
None outstanding.

### US-002 — View and filter tasks
*Traces to: REQ-002 · Priority: Must have*

**As a** Team Member, **I want to** view all tasks in a project filtered by status or assignee, **so that** I can see what my team is working on without asking in chat.

**Business value**
Directly addresses the design-partner's quantified pain point (5-10 minutes per "who owns this" lookup) — this is the story that actually delivers the Business objective's value proposition, not just the mechanics of having tasks exist.

**Acceptance criteria**
- [ ] The task list respects status and assignee filters, combined.

**Non-functional considerations**
This is the endpoint under the heaviest read load (REQ-004); its query plan needs to use the composite index on (project_id, status) from Database Design, not a table scan.

**Out of scope for this story**
Saved/named filter presets, sorting options beyond the default — not requested by the design partner and not needed for MVP.

**Open questions**
None outstanding.

Note: REQ-003 (tenant isolation) and REQ-004 (concurrency/latency) are both non-functional and have no User Story — they trace directly to Architecture and Security components, per `rules/traceability-rules.md`'s documented exception.
