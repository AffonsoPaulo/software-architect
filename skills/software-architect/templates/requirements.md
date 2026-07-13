# Requirements — Template

Saved at `docs/03-requirements/` in the target project (see `rules/document-locations.md`). Produced by `playbooks/03-requirements-engineering.md`. This is where the project's actual requirements live — the first document in the traceability graph proper (see `rules/traceability-rules.md`), and the one every later phase ultimately traces back to.

This category splits into an **index file** (`requirements.md`) and one **item file** per requirement (`req-001.md`, `req-002.md`, ...) — see `rules/document-locations.md`. Each item file is a complete document on its own, per `rules/document-format.md`.

## Index file — `requirements.md`

```markdown
# Requirements

<One or two sentences of context, if useful — this file is a table of
contents, not a restatement of every requirement.>

| ID | Title | Type | Priority | Traces to |
|---|---|---|---|---|
| [REQ-001](req-001.md) | Post a recipe | Functional | Must have | BR-003 |
| [REQ-002](req-002.md) | Response time | Non-functional | Must have | (none) |
```

## Item file — `req-001.md`

```markdown
# REQ-001 — <short title>
*Type: Functional · Priority: Must have · Traces to: BR-003*

<The requirement, stated as a single testable capability.>

**Acceptance criteria**
- [ ] <a specific, checkable condition — not "works well", something you
  could pass/fail>

**Edge cases**
- <a specific scenario where this requirement's normal behavior doesn't
  straightforwardly apply — an error condition, a boundary, a conflict
  with another requirement>
```

- `Traces to` holds the `BR-XXX` this requirement enforces, if any (`rules/traceability-rules.md`: not every requirement has one, especially pure technical/NFR requirements) — write `(none)` explicitly when there isn't one.
- `Priority` uses MoSCoW (`Must have` / `Should have` / `Could have`) or an equivalent scheme confirmed with the user.
- `Type` is `Functional` or `Non-functional`. Non-functional requirements are always individually confirmed (`[confirmation individual]`).

## Fully Dressed additions

Add these lines to the item file's metadata line, and these subsections underneath:

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
- The index file's table is kept in sync with the item files as requirements are added/changed — it's a reading aid, never the source of truth for a requirement's actual content.
