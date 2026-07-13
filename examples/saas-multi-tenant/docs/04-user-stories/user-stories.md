---
user_stories:
  - id: US-001
    traces_to: ["REQ-001"]
    persona: "Team Member"
    action: "create a task in a project and optionally assign it to someone"
    benefit: "work gets tracked from the moment it's identified, not lost in Slack"
    acceptance_criteria:
      - "Creating a task requires a title and a project; assignee is optional."
      - "A new task starts in 'To Do' status."
    invest_notes: "Independent, testable, small — a single CRUD-style action."
  - id: US-002
    traces_to: ["REQ-002"]
    persona: "Team Member"
    action: "view all tasks in a project, filtered by status or assignee"
    benefit: "I can see what my team is working on without asking in chat"
    acceptance_criteria:
      - "The task list respects status and assignee filters, combined."
    invest_notes: "Independent of US-001 — a read path, testable on its own with seeded data."
---

# User Stories

## US-001 — Create a task
**As a** Team Member, **I want to** create a task in a project and optionally assign it to someone, **so that** work gets tracked from the moment it's identified.

**Traces to**: REQ-001

**Acceptance criteria**:
- [ ] Creating a task requires a title and a project; assignee is optional.
- [ ] A new task starts in 'To Do' status.

## US-002 — View and filter tasks
**As a** Team Member, **I want to** view all tasks in a project filtered by status or assignee, **so that** I can see what my team is working on without asking in chat.

**Traces to**: REQ-002

**Acceptance criteria**:
- [ ] The task list respects status and assignee filters, combined.

Note: REQ-003 (tenant isolation) and REQ-004 (concurrency/latency) are both non-functional and have no User Story — they trace directly to Architecture and Security components, per `rules/traceability-rules.md`'s documented exception.
