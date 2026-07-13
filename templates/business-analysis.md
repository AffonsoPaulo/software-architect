# Business Analysis — Template

Saved at `docs/02-business-analysis/business-analysis.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/02-business-analysis.md`. This is the bridge between Discovery (the problem) and Requirements Engineering (formal requirements) — it models the business processes, actors, and rules that Requirements will later formalize into `REQ-XXX` items.

## Structure

```yaml
---
business_rules:
  - id: BR-001
    statement: "<the rule, stated as a policy or constraint — e.g. 'refunds are only issued within 30 days of purchase'>"
---
```

```markdown
# Business Analysis

## Business processes
<One subsection per process relevant to this project, each with a
step-by-step description and a Mermaid `flowchart` per
rules/diagram-conventions.md — as-is (current process) always, to-be
(future process) only if relevant/different from as-is.>

### <Process name>
<Steps, numbered.>

```mermaid
flowchart TD
    ...
```

## Actors
<Business actors/roles involved — not UX personas, business roles: e.g.
"Support Agent," "Finance Approver." One line each: who they are and what
they do in the processes above.>

## Business rules
<One entry per BR-XXX declared in the front-matter above, each restated in
full sentence form with enough context to stand alone — the front-matter
`statement` field can be terse, this section is the readable version.>

## Justification
<The value/ROI: cost reduction, new market, risk mitigation — whatever the
user actually said. Not a generic business-case template filled in by the
AI; the user's own reasoning, rewritten for clarity and confirmed.>
```

## Notes for whoever fills this in

- Every process description needs at least one actor identified — a process with no actor is incomplete, not just under-detailed (this is a gate criterion, not a style preference).
- `BR-XXX` IDs come from `rules/id-conventions.md`'s global sequence (`project-state.md`'s `id_sequences.BR`) — never renumbered, never reused if a rule is later dropped (mark `[DEPRECATED]` instead, per `rules/id-conventions.md`).
- Not every business rule here will map to a formal `REQ-XXX` later — some are context, not requirements. `rules/traceability-rules.md` documents this as an expected, non-required link, not an error.
