# Backlog — Template

Saved at `docs/15-backlog/backlog.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/15-backlog.md`. Breaks the Roadmap's milestones into prioritized work items, ready to become the sequenced Implementation Plan (phase 16). Each item is a heading followed by an italic metadata line, per `rules/document-format.md` — this is the one and only place `TASK-XXX` is declared (Implementation Plan only sequences these, it never redeclares them — see `templates/implementation-plan.md`).

## Structure (Casual)

```markdown
# Backlog

## Definition of Ready
<Confirmed once, applies to every item below — `[confirmation individual]`
the first time, then reused as the project's standing standard for every
item after.>

## Items by milestone
<Grouped by milestone, ordered by priority within each.>

### Milestone 1 — MVP

#### TASK-001 — <short title>
*Traces to: US-006 · Priority: High · Status: Not started*

<What this item covers.>
```

`Status` always starts as `Not started`. `Priority` is relative within the milestone.

## Fully Dressed additions

```markdown
#### TASK-001 — <short title>
*Traces to: US-006 · Priority: High · Status: Not started*

<what this item covers, as in Casual>

**Estimate**: <story points or time — whatever unit the team already
uses; "not estimated yet" is valid if genuinely not done>

**Dependencies**
<Other TASK-XXX this one depends on for planning purposes — distinct
from Implementation Plan's build-sequencing depends_on, this is
Backlog-level "can't reasonably start until" — or "(none).">

**Acceptance test scenarios**
<One or more concrete scenarios (Given/When/Then or plain prose) that
confirm this item is actually done — more concrete than the US-XXX's
own acceptance criteria, scoped to exactly this slice of work.>
```

## Notes for whoever fills this in

- **Every item needs `traces_to`** pointing to a real `US-XXX` or `UC-XXX` — no item is invented without lineage, even infrastructure/setup items (trace them to whichever story/use case they exist to enable).
- **Every User Story belonging to a milestone included in the current roadmap needs at least one corresponding backlog item** — this is the gate's primary check.
- `TASK-XXX` IDs come from `project-state.md`'s `id_sequences.TASK`, global to the project, per `rules/id-conventions.md`.
