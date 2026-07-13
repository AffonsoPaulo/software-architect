# Checklist Structure

Format every file in `checklists/` must follow.

## Purpose, and how it differs from a Quality Gate

- A **checklist** (`checklists/<phase>-checklist.md`) is for continuous self-assessment *during* a phase — the AI can consult it at any point while running the phase's interview to check it isn't missing something.
- A **Quality Gate** (`quality-gates/<phase>-gate.md`, see `quality-gate-structure.md`) is the formal *exit* checkpoint — evaluated once, at the end of the phase, to decide whether the Skill may advance.

A checklist item and a gate criterion covering the same concern must say the same thing — the checklist is derived 1:1 from the gate's criteria, just phrased as an in-progress checkbox rather than a pass/fail rule. They must never diverge; if a gate criterion changes, the matching checklist item changes with it.

## Required structure of a checklist file

```markdown
# <Phase Name> Checklist

- [ ] <actionable item, phrased as something to verify — mirrors a gate criterion>
- [ ] ...
```

- Every item must be actionable and checkable at a glance — not vague ("requirements seem complete") but specific ("every REQ-XXX has a testable acceptance criterion").
- Items are listed in the same order as the criteria in the matching `quality-gates/<phase>-gate.md`, so the two files can be scanned side by side.
- A checklist file never introduces a criterion that isn't also in the matching gate file — if something matters enough to check, it matters enough to be a formal gate criterion.
