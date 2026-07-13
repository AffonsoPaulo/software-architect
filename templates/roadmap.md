# Roadmap — Template

Saved at `docs/14-roadmap/roadmap.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/14-roadmap.md`. Organizes everything defined so far into delivery milestones with dependencies — a synthesis of the whole project up to this point, not a new source of requirements. Does not break milestones down into individual tasks — that's phase 15 (Backlog).

## Structure

```yaml
---
has_real_dates: false
# REQUIRED, explicit. true only if the user actually provided real dates —
# never assumed. If false, milestones are ordered/relative only (Milestone
# 1, Milestone 2...), never assigned a calendar date.
milestones:
  - id: "milestone-mvp"
    # milestones don't get a formal ID prefix (none reserved in
    # rules/id-conventions.md) — use a short, stable slug instead
    name: "MVP"
    delivers: ["US-001", "US-002", "UC-003"]
    # REQUIRED — every US-XXX/UC-XXX in the project must appear in the
    # `delivers` list of exactly one milestone, OR be explicitly listed
    # in `deferred` below with a reason. Never silently absent from both.
    done_criterion: "<what 'done' means for this milestone, concretely>"
    depends_on: []
    # other milestone ids that must complete first, if any
    target_date: null
    # only set if has_real_dates is true
deferred:
  - item: "US-014"
    reason: "<why this is out of the current roadmap — e.g. 'nice-to-have,
      revisit after MVP validates the core flow'>"
---
```

```markdown
# Roadmap

## Milestones
<One subsection per milestone: what it delivers (by US-XXX/UC-XXX),
dependencies on other milestones, done criterion.>

## Deferred
<Anything confirmed as approved but intentionally not in the current
roadmap, with a stated reason — never silently dropped.>

```mermaid
gantt
    ...
```
<Use `gantt` only if `has_real_dates: true`. Otherwise use a `flowchart`
of milestone dependencies — per rules/diagram-conventions.md.>
```

## Notes for whoever fills this in

- **Never assume a real date.** If the user hasn't provided one, milestones stay relative (Milestone 1, Milestone 2...) — do not invent a target date to make the roadmap look more concrete than it is.
- **Every approved `US-XXX`/`UC-XXX` must be accounted for** — either delivered by exactly one milestone, or explicitly deferred with a reason. This is the gate's primary check.
- This document does not decompose milestones into tasks — that's `docs/15-backlog/backlog.md` (phase 15), working from this roadmap.
