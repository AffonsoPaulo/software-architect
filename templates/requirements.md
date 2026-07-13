# Requirements — Template

Saved at `docs/03-requirements/requirements.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/03-requirements-engineering.md`. This is where the project's actual requirements live — the first document in the traceability graph proper (see `rules/traceability-rules.md`), and the one every later phase ultimately traces back to. Each requirement is a heading followed by an italic metadata line, per `rules/document-format.md`.

## Structure (Casual)

```markdown
# Requirements

## Functional requirements
<One subsection per REQ-XXX of type "functional", in confirmed order.>

### REQ-001 — <short title>
*Type: Functional · Priority: Must have · Traces to: BR-003*

<The requirement, stated as a single testable capability.>

**Acceptance criteria**
- [ ] <a specific, checkable condition — not "works well", something you
  could pass/fail>

**Edge cases**
- <a specific scenario where this requirement's normal behavior doesn't
  straightforwardly apply — an error condition, a boundary, a conflict
  with another requirement>

## Non-functional requirements
<Same format, for type "non-functional" — performance, availability,
scalability, usability, compliance, etc. Each still needs acceptance
criteria specific enough to be testable, e.g. "95th percentile response
time under 300ms at 500 concurrent users," not "the system should be
fast." `[confirmation individual]` — these are asked and confirmed
individually.>

### REQ-002 — <short title>
*Type: Non-functional · Priority: Must have · Traces to: (none)*

...
```

- `Traces to` holds the `BR-XXX` this requirement enforces, if any (`rules/traceability-rules.md`: not every requirement has one, especially pure technical/NFR requirements) — write `(none)` explicitly when there isn't one.
- `Priority` uses MoSCoW (`Must have` / `Should have` / `Could have`) or an equivalent scheme confirmed with the user.

## Fully Dressed additions

Add these lines to the metadata (`*...*`) line, and these subsections under each requirement:

```markdown
*Type: Functional · Priority: Must have · Traces to: BR-003 · Status: Approved*

<description, as in Casual>

**Rationale**
<Why this requirement exists — the reasoning behind it, not a restatement
of the description. If it traces to a BR-XXX, this is more than that rule
restated: it's why THIS requirement is how that rule gets satisfied.>

**Source**
<Who/what originated this requirement — a named stakeholder, a
regulation, a prior incident, an existing system's behavior being
preserved. "The user, during Discovery" is a valid source for a
greenfield project's core requirements.>

**Acceptance criteria**
- [ ] ...

**Edge cases**
- ...

**Risk if not met**
<What concretely goes wrong if this requirement isn't satisfied —
severity, who's affected. Distinguishes a Must-have's actual stakes from
a Should-have's.>

**Verification method**
<How this gets confirmed as actually met — automated test (traces_to a
TEST-XXX once phase 12 runs), manual review, an external audit. Not the
test itself, just how it will be checked.>

**Dependencies**
<Other REQ-XXX this one depends on or conflicts with, if any — "(none)"
if standalone.>
```

`Status` values: `Draft` (not yet confirmed) / `Approved` (confirmed, current) / `Superseded` (replaced by a later CR — never deleted, per `rules/id-conventions.md`).

## Notes for whoever fills this in

- **Every requirement needs, at minimum**: a complete description, at least one testable acceptance criterion, its business rule link if one exists, at least one edge case, and no unresolved ambiguity in its wording. This is not a style guideline — it is exactly what `quality-gates/03-requirements-engineering-gate.md` checks, criterion by criterion, per requirement.
- **Traceability exception**: a purely non-functional requirement does not need a `US-XXX` in phase 04 — it traces directly to `ARCH-XXX`/`SEC-XXX` instead (`rules/traceability-rules.md`). Functional requirements always need at least one `US-XXX`.
- `REQ-XXX` IDs come from `project-state.md`'s `id_sequences.REQ`, global to the project, never renumbered.
