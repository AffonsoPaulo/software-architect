# Implementation Plan — Template

Saved at `docs/16-implementation-plan/implementation-plan.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/16-implementation-plan.md`. Sequences the approved Backlog into an actual build order, with technical dependencies and a Definition of Done per task. **This is the last document produced before the final Review gate (phase 17)** — nothing about the project's plan is decided after this except what Review itself catches and routes back through Change Management.

## Structure

```yaml
---
definition_of_done: "<what makes a task actually complete — confirmed once,
  `[confirmation individual]` the first time, reused as the project's
  standing standard afterward>"
sequence:
  - task: "TASK-001"
    # REQUIRED — must reference a TASK-XXX that exists in
    # docs/15-backlog/backlog.md. No task appears here without first
    # existing in the Backlog.
    depends_on: []
    # other TASK-XXX ids that must complete first — no cycles allowed
    parallelizable_with: []
    # other TASK-XXX ids that can proceed at the same time, if relevant to note
---
```

```markdown
# Implementation Plan

## Definition of Done
<Confirmed once, applies to every task below — e.g. tests passing,
code reviewed, documentation updated.>

## Sequence
<Every TASK-XXX from the Backlog, in build order, with its dependencies
made explicit — not left to be inferred at implementation time.>

```mermaid
flowchart TD
    ...
```
<Or `gantt` if useful alongside the flowchart — rules/diagram-conventions.md.>
```

## Notes for whoever fills this in

- **Every task referenced here must exist in `docs/15-backlog/backlog.md`** — this document sequences the Backlog, it never introduces new work.
- **No dependency cycles.** A depends on B depending on A (directly or transitively) is not a valid plan — resolve it with the user, don't record it.
- **Definition of Done is confirmed once and applied to every task**, not redefined per task, unless a specific task genuinely needs additional criteria beyond the standard (rare, and should be called out explicitly when it happens).
