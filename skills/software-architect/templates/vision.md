# Vision — Template

Saved at `docs/01-discovery/vision.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/01-discovery.md`. This is the narrative root of the whole project — it has no artifact ID and no `traces_to` (see `rules/traceability-rules.md`: the graph is anchored at Business Rule/Requirement, and Vision sits above even those). Every `REQ-XXX` written in phase 03 should be traceable back to a specific part of this document in prose, even though that link isn't a formal ID reference. Plain markdown throughout, per `rules/document-format.md` — this document has no IDs of its own, so it never needs the heading + metadata-line convention.

## Structure (Casual)

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

## Fully Dressed additions

Five subsections are added. Each is placed immediately after the Casual section it extends, not appended at the end — a Stakeholder profiles table read right after Target audience, or a Success metrics table read right after Success criteria, is what makes those pairs actually relate to each other on the page. Full document at this depth:

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

## Stakeholder profiles
<One entry per distinct stakeholder GROUP (not the same as Target
audience's end users) — e.g. "Finance," "Support," "Compliance." Each
with: what they care about in this project, and what would make them
consider it a success or a failure.>

| Stakeholder group | Cares about | Success looks like |
|---|---|---|
| <group> | <what they care about in this project> | <what would make them consider it a success, or a failure> |

## Current state
<What exists today: current system, competitors, manual process being
replaced. "Nothing, this is greenfield" is a valid answer if confirmed as
such — never assumed.>

## Business objective
<Why this project matters, in terms specific enough to be falsifiable —
not "grow the business" but what growth, measured how. If the user's first
answer is vague, ask what would make it obviously true or false in six
months.>

## Business opportunity
<What this project makes possible beyond just fixing the problem above —
new revenue, market position, competitive parity. Distinct from
"Business objective": objective is the falsifiable target, opportunity is
the broader upside case behind pursuing it at all.>

## Success criteria
<At least one measurable criterion. "Users like it" is not measurable;
"reduce average checkout time from 4 minutes to under 1" is. This section
cannot be empty — the gate rejects a Vision without at least one.>

## Success metrics
<Every "Success criteria" entry restated with a measured baseline and a
target: metric name, current value (or "not currently measured," if
true), target value, and how/when it's measured. This is what turns a
qualitative success criterion into something that can actually be
checked after launch.>

| Metric | Baseline | Target | Measured |
|---|---|---|---|
| <metric name> | <current value, or "not currently measured"> | <target value> | <how/when it's measured> |

## Constraints
<Known constraints: deadline, budget, mandated technology, regulatory
requirements. `[confirmation individual]` — these often have a high cost
of reversal if gotten wrong.>

## Assumptions and dependencies
<What this Vision assumes to be true but hasn't been verified (e.g. "we
assume the existing payment provider's API supports partial refunds"),
and any external dependency the project's success relies on but doesn't
control (a partner's API, a regulatory deadline, another team's
deliverable).>

## Business-level risks
<Risks at the level of the business case itself — not technical risk
(that's `docs/11-security/risk-register.md`) — e.g. "a competitor ships
this first," "the regulatory window closes before launch." Each gets a
one-line mitigation or explicit acceptance.>

## Out of scope
<Explicitly what this project does NOT cover, even if adjacent or
tempting. If nothing is out of scope, that itself is worth confirming
explicitly rather than leaving the section empty by omission.>
```

## What this document must never contain

Functional requirements, acceptance criteria, or anything with a `REQ-XXX` ID — those belong to `docs/03-requirements/requirements.md` (phase 03). Vision describes the problem and what success looks like, not the solution's behavior. If a draft answer starts describing specific features or flows, that content belongs in phase 03's interview, not here — note it for later rather than documenting it now.
