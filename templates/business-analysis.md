# Business Analysis — Template

Saved at `docs/02-business-analysis/business-analysis.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/02-business-analysis.md`. This is the bridge between Discovery (the problem) and Requirements Engineering (formal requirements) — it models the business processes, actors, and rules that Requirements will later formalize into `REQ-XXX` items. `BR-XXX` entries follow the heading + metadata-line convention in `rules/document-format.md` — declared once, in the "Business rules" section, nowhere else.

## Structure (Casual)

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
<One heading per business rule, per rules/document-format.md.>

### BR-001 — <short title>
*Traces to: (none)*

<The rule, stated as a policy or constraint, in full sentence form — e.g.
"Refunds are only issued within 30 days of purchase.">

## Justification
<The value/ROI: cost reduction, new market, risk mitigation — whatever the
user actually said. Not a generic business-case template filled in by the
AI; the user's own reasoning, rewritten for clarity and confirmed.>
```

## Fully Dressed additions

```markdown
### <Process name> — To-be
<Only when the to-be process genuinely differs from as-is. Same
step-by-step + flowchart treatment, with each changed step flagged
against the as-is version it replaces.>

### <Process name> — Metrics
<Current (baseline) and target value for whatever this process is
measured by — cycle time, error rate, cost per transaction, volume. "Not
currently measured" is a valid current value if true; a target with no
baseline to compare against isn't useful.>

### <Process name> — RACI
| Step | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |
<Who does the work, who answers for the outcome, who's consulted before
a decision, who's told after. Roles from "Actors" above, not names.>

## Pain points
<Quantified, not just described — "manual reconciliation takes 6 hours/
week and produces roughly 2 errors/month," not "reconciliation is
slow and error-prone." Each pain point traces back to the process/step
it occurs in.>

## Organizational impact
<Who is affected by this project beyond the direct actors above — teams
whose workflow changes, roles that get created/removed/redefined, training
or change-management needs. "None beyond the actors already listed" is a
valid, explicit answer.>
```

## Notes for whoever fills this in

- Every process description needs at least one actor identified — a process with no actor is incomplete, not just under-detailed (this is a gate criterion, not a style preference).
- `BR-XXX` IDs come from `rules/id-conventions.md`'s global sequence (`project-state.md`'s `id_sequences.BR`) — never renumbered, never reused if a rule is later dropped (mark `[DEPRECATED]` instead, per `rules/id-conventions.md`).
- Not every business rule here will map to a formal `REQ-XXX` later — some are context, not requirements. `rules/traceability-rules.md` documents this as an expected, non-required link, not an error.
