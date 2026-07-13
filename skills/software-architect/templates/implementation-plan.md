# Implementation Plan — Template

Saved at `docs/16-implementation-plan/implementation-plan.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/16-implementation-plan.md`. Sequences the approved Backlog into an actual build order, with technical dependencies and a Definition of Done per task. **This is the last document produced before the final Review gate (phase 17)** — nothing about the project's plan is decided after this except what Review itself catches and routes back through Change Management.

Every `TASK-XXX` here already exists — declared once in `docs/15-backlog/backlog.md` (`templates/backlog.md`). This document never repeats a `TASK-XXX` as a heading (that would register as a second declaration of the same ID and fail `scripts/validate-ids.mjs`'s uniqueness check, per `rules/document-format.md`) — it sequences existing tasks in a plain markdown table instead, read directly by `scripts/validate-gate.mjs`'s dependency-cycle check.

## Structure (Casual)

```markdown
# Implementation Plan

## Definition of Done
<Confirmed once, applies to every task below — `[confirmation individual]`
the first time — e.g. tests passing, code reviewed, documentation
updated.>

## Sequence

| Task | Depends on | Parallelizable with |
|---|---|---|
| TASK-001 | (none) | — |
| TASK-002 | TASK-001 | — |
| TASK-003 | TASK-001, TASK-002 | — |

```mermaid
flowchart TD
    ...
```
<Or `gantt` if useful alongside the flowchart — rules/diagram-conventions.md.>
```

## Fully Dressed additions

```markdown
## Sequence

| Task | Depends on | Parallelizable with | Owner | Estimate |
|---|---|---|---|---|
| TASK-001 | (none) | — | ... | ... |

## Risk mitigation
<Per task with a real execution risk (not every task needs an entry) —
what could go wrong during implementation and how it's mitigated. Ties
to `docs/11-security/risk-register.md` for anything significant enough
to warrant a RISK-XXX.>

## Critical path
<Which sequence of tasks determines the shortest possible completion
time — the chain where any delay directly delays the whole plan. Derived
from the dependency table above, not a separate independent judgment.>
```

The `Owner`/`Estimate` columns are additive to the same table — a Fully Dressed project still uses one `## Sequence` table, just with more columns, so `scripts/validate-gate.mjs`'s cycle check keeps working against columns 1 and 2 regardless of how many more follow.

## Notes for whoever fills this in

- **Every task referenced here must exist in `docs/15-backlog/backlog.md`** — this document sequences the Backlog, it never introduces new work.
- **No dependency cycles.** A depends on B depending on A (directly or transitively) is not a valid plan — resolve it with the user, don't record it.
- **Definition of Done is confirmed once and applied to every task**, not redefined per task, unless a specific task genuinely needs additional criteria beyond the standard (rare, and should be called out explicitly when it happens).
