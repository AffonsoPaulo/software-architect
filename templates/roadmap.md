# Roadmap — Template

Saved at `docs/14-roadmap/roadmap.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/14-roadmap.md`. Organizes everything defined so far into delivery milestones with dependencies — a synthesis of the whole project up to this point, not a new source of requirements. Does not break milestones down into individual tasks — that's phase 15 (Backlog). Milestones don't get a formal ID prefix (`rules/id-conventions.md`) — each is a heading followed by an italic metadata line, per `rules/document-format.md`, using the milestone's name in place of an ID.

## Structure (Casual)

```markdown
# Roadmap

**Has real dates**: No <REQUIRED, explicit. "Yes" only if the user
actually provided real dates — never assumed. If "No", milestones are
ordered/relative only (Milestone 1, Milestone 2...), never assigned a
calendar date.>

## Milestones

### Milestone 1 — MVP
*Delivers: US-001, US-002, UC-003 · Depends on: (none) · Target date: (none)*

<What "done" means for this milestone, concretely.>

## Deferred
<Anything confirmed as approved but intentionally not in the current
roadmap. One bullet per item, ID first, then the reason — never silently
dropped.>

- US-014 — nice-to-have, revisit after MVP validates the core flow

```mermaid
gantt
    ...
```
<Use `gantt` only if "Has real dates" is Yes. Otherwise use a `flowchart`
of milestone dependencies — per rules/diagram-conventions.md.>
```

Every `US-XXX`/`UC-XXX` in the project must appear in exactly one milestone's `Delivers` list, or in `Deferred` with a reason — never silently absent from both.

## Fully Dressed additions

```markdown
### Milestone 1 — MVP
*Delivers: US-001, US-002, UC-003 · Depends on: (none) · Target date: (none)*

<done criterion, as in Casual>

**External dependencies**
<Anything this milestone needs from outside the team's own control —
a partner's API going live, a legal review completing, a third-party
credential being issued. "(none)" if genuinely self-contained.>

**Success metrics**
<Business-level metrics that tell you this milestone actually worked
once shipped — ties back to Vision's Success metrics (Fully Dressed)
where relevant, scoped down to what this specific milestone should move.>

**Milestone risks**
<Risks specific to delivering THIS milestone (schedule, scope, technical)
— distinct from the project-wide risk register, though a serious one may
also get a RISK-XXX entry there.>

## Stakeholder communication plan
<Who needs to know about progress/delays on this roadmap, how often, and
through what channel — e.g. "biweekly update to Finance via email."
"(none) — single-person project" is valid.>
```

## Notes for whoever fills this in

- **Never assume a real date.** If the user hasn't provided one, milestones stay relative (Milestone 1, Milestone 2...) — do not invent a target date to make the roadmap look more concrete than it is.
- **Every approved `US-XXX`/`UC-XXX` must be accounted for** — either delivered by exactly one milestone, or explicitly deferred with a reason. This is the gate's primary check.
- This document does not decompose milestones into tasks — that's `docs/15-backlog/backlog.md` (phase 15), working from this roadmap.
