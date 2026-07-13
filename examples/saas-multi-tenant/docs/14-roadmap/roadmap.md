---
has_real_dates: true
milestones:
  - id: "milestone-core"
    name: "Core task management"
    delivers: ["US-001"]
    done_criterion: "Team members can create tasks in a project; tenant isolation (REQ-003) verified by TEST-003 passing in CI."
    depends_on: []
    target_date: "2026-07-15"
  - id: "milestone-visibility"
    name: "Task visibility"
    delivers: ["US-002"]
    done_criterion: "Team members can view and filter the task list; load test (TEST-004) passes at 500 concurrent users."
    depends_on: ["milestone-core"]
    target_date: "2026-08-01"
deferred: []
---

# Roadmap

## Milestones
Real deadline confirmed with the design-partner customer's onboarding date — `has_real_dates: true`.

### Milestone 1 — Core task management (target: 2026-07-15)
Delivers US-001. Done when task creation works end-to-end and TEST-003 (cross-tenant isolation) passes in CI.

### Milestone 2 — Task visibility (target: 2026-08-01)
Delivers US-002. Depends on Milestone 1. Done when filtering works and TEST-004 (load test) passes.

```mermaid
gantt
    dateFormat YYYY-MM-DD
    title TaskFlow Roadmap
    section MVP
    Core task management   :m1, 2026-06-15, 2026-07-15
    Task visibility         :m2, after m1, 2026-08-01
```
