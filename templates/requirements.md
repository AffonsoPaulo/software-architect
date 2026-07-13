# Requirements — Template

Saved at `docs/03-requirements/requirements.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/03-requirements-engineering.md`. This is where the project's actual requirements live — the first document in the traceability graph proper (see `rules/traceability-rules.md`), and the one every later phase ultimately traces back to.

## Structure

```yaml
---
requirements:
  - id: REQ-001
    type: "functional"
    # "functional" | "non-functional"
    description: "<the requirement, stated as a single testable capability>"
    acceptance_criteria:
      - "<a specific, checkable condition — not 'works well', something you could pass/fail>"
    business_rule: "BR-003"
    # optional — the BR-XXX this requirement enforces, if any (rules/traceability-rules.md:
    # not every requirement has one, especially pure technical/NFR requirements)
    priority: "must"
    # "must" | "should" | "could" (MoSCoW) — or an equivalent scheme confirmed with the user
    edge_cases:
      - "<a specific scenario where this requirement's normal behavior doesn't
         straightforwardly apply — an error condition, a boundary, a conflict
         with another requirement>"
---
```

```markdown
# Requirements

## Functional requirements
<One subsection per REQ-XXX of type "functional", in front-matter order.
Each restates the requirement in full, its acceptance criteria as a
checklist, its business rule reference if any, priority, and edge cases.>

### REQ-001 — <short title>
**Description**: ...
**Acceptance criteria**:
- [ ] ...
**Business rule**: BR-003 (if applicable)
**Priority**: must
**Edge cases**:
- ...

## Non-functional requirements
<Same format, for type "non-functional" — performance, availability,
scalability, usability, compliance, etc. Each still needs acceptance
criteria specific enough to be testable, e.g. "95th percentile response
time under 300ms at 500 concurrent users," not "the system should be fast."
`[confirmation individual]` — these are asked and confirmed individually.>
```

## Notes for whoever fills this in

- **Every requirement needs, at minimum**: a complete description, at least one testable acceptance criterion, its business rule link if one exists, at least one edge case, and no unresolved ambiguity in its wording. This is not a style guideline — it is exactly what `quality-gates/03-requirements-engineering-gate.md` checks, criterion by criterion, per requirement.
- **Traceability exception**: a purely non-functional requirement does not need a `US-XXX` in phase 04 — it traces directly to `ARCH-XXX`/`SEC-XXX` instead (`rules/traceability-rules.md`). Functional requirements always need at least one `US-XXX`.
- `REQ-XXX` IDs come from `project-state.md`'s `id_sequences.REQ`, global to the project, never renumbered.
