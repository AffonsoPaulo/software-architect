# Vision — Template

Saved at `docs/01-discovery/vision.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/01-discovery.md`. This is the narrative root of the whole project — it has no artifact ID and no `traces_to` (see `rules/traceability-rules.md`: the graph is anchored at Business Rule/Requirement, and Vision sits above even those). Every `REQ-XXX` written in phase 03 should be traceable back to a specific part of this document in prose, even though that link isn't a formal ID reference.

## Structure

```markdown
# Vision

## Problem
<The problem that motivates this project, and who has it. Not a solution —
a problem. If the user's answer already describes a solution, separate the
two: ask what the underlying problem is that this solution is meant to fix.>

## Target audience
<Who the primary users/stakeholders are. Not a full persona exercise —
that level of detail belongs to later phases if needed. Just: who is this
for.>

## Current state
<What exists today: current system, competitors, manual process being
replaced. "Nothing, this is greenfield" is a valid answer if confirmed as
such — never assumed.>

## Business objective
<Why this project matters, in terms specific enough to be falsifiable —
not "grow the business" but what growth, measured how. If the user's first
answer is vague, ask what would make it obviously true or false in six
months.>

## Success criteria
<At least one measurable criterion. "Users like it" is not measurable;
"reduce average checkout time from 4 minutes to under 1" is. This section
cannot be empty — the gate rejects a Vision without at least one.>

## Constraints
<Known constraints: deadline, budget, mandated technology, regulatory
requirements. `[confirmation individual]` — these often have a high cost
of reversal if gotten wrong.>

## Out of scope
<Explicitly what this project does NOT cover, even if adjacent or
tempting. If nothing is out of scope, that itself is worth confirming
explicitly rather than leaving the section empty by omission.>
```

## What this document must never contain

Functional requirements, acceptance criteria, or anything with a `REQ-XXX` ID — those belong to `docs/03-requirements/requirements.md` (phase 03). Vision describes the problem and what success looks like, not the solution's behavior. If a draft answer starts describing specific features or flows, that content belongs in phase 03's interview, not here — note it for later rather than documenting it now.
