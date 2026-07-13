# Backlog — Template

Saved at `docs/15-backlog/backlog.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/15-backlog.md`. Breaks the Roadmap's milestones into prioritized work items, ready to become the sequenced Implementation Plan (phase 16).

## Structure

```yaml
---
definition_of_ready: "<what makes an item ready for development — confirmed
  once, `[confirmation individual]` the first time, then reused as the
  project's standing standard for every item after>"
items:
  - id: TASK-001
    traces_to: ["US-006"]
    # REQUIRED — a US-XXX or UC-XXX. Never an invented item with no
    # requirement/story/use-case lineage behind it. Non-story items (e.g.
    # infra setup) still trace to whatever they exist to support.
    milestone: "milestone-mvp"
    # the milestone slug from docs/14-roadmap/roadmap.md this item belongs to
    priority: "high"
    # relative priority within the milestone
    status: "not_started"
    # always starts here
---
```

```markdown
# Backlog

## Definition of Ready
<Confirmed once, applies to every item below.>

## Items by milestone
<Grouped by milestone, ordered by priority within each: item, what it
covers, traces_to.>
```

## Notes for whoever fills this in

- **Every item needs `traces_to`** pointing to a real `US-XXX` or `UC-XXX` — no item is invented without lineage, even infrastructure/setup items (trace them to whichever story/use case they exist to enable).
- **Every User Story belonging to a milestone included in the current roadmap needs at least one corresponding backlog item** — this is the gate's primary check.
- `TASK-XXX` IDs come from `project-state.md`'s `id_sequences.TASK`, global to the project, per `rules/id-conventions.md`.
