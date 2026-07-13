# Playbook Structure

Every file in `playbooks/` MUST follow this exact structure, in this order, with no sections skipped. This file is the single source of truth for playbook shape — individual playbooks never redefine or vary it. If a section doesn't apply to a given phase, write "None for this phase" under that heading rather than omitting it.

## The 20 mandatory sections

1. **Objective** — one paragraph: what this phase accomplishes and why it exists in the flow.
2. **When to run** — conditions/project types where this phase applies.
3. **When NOT to run** — conditions under which this phase is skippable, and what (if anything) replaces it. Must stay consistent with the skip logic proposed in `playbooks/00-project-calibration.md`.
4. **Inputs** — which prior phases' *approved* documents this phase reads. Must never reference a phase not yet reached.
5. **Outputs** — which documents/files this phase produces or updates.
6. **Documents produced** — exact file path(s) under `/docs/<phase>/` in the target project, referencing the `templates/` file used to produce them.
7. **Mandatory questions** — the fixed list of questions this phase must ask. Tag a question `[confirmation individual]` if it belongs to an always-strict category (see `confirmation-protocol.md`). A mandatory question must never depend on an answer from a future phase.
8. **Optional questions** — asked only if relevant or if the user wants more depth; skipping them never blocks the gate.
9. **Interview flow** — the order questions are asked in, and any branching logic (e.g. brownfield vs. greenfield, per `rules/delegation-policy.md` where applicable).
10. **How to confirm answers** — phase-specific nuances only (e.g. which categories are always-strict here); the loop mechanics themselves are defined once in `confirmation-protocol.md`, never restated.
11. **How to document answers** — maps confirmed answers to fields in the phase's template.
12. **How to validate answers** — phase-specific semantic checks, distinct from the Quality Gate (which is the formal exit checkpoint, not a continuous check).
13. **Special cases** — edge cases specific to this phase (brownfield handling, "I don't know" answers with phase-specific nuance, etc.).
14. **Common ambiguities** — recurring confusion patterns this phase tends to produce, and how to resolve them.
15. **Frequent errors** — common mistakes an AI running this phase might make.
16. **Examples** — at least one short worked example of an answer being confirmed and documented.
17. **Anti-patterns** — things this phase must never do. Reference `rules/ai-invariants.md` instead of restating the rule in different words.
18. **Checklist** — pointer to `checklists/<phase>-checklist.md`. Never duplicated inline.
19. **Quality Gate** — pointer to `quality-gates/<phase>-gate.md`, plus a one-line summary. Never duplicated inline.
20. **Approval criteria** — the explicit statement of what "done" means for this phase — the final gate check before advancing.

## Format rules

- Each section is a `##` heading, in the exact order above.
- Sections 1–6 are short (2–5 lines each). Sections 7–9 are typically the bulk of the file. Sections 10–20 are usually 2–10 lines each and mostly point to shared `rules/`/`checklists/`/`quality-gates/` files rather than restating their content.
- A playbook file must never embed the full text of a `rules/`, `checklists/`, or `quality-gates/` file — always reference by relative path.

## The `[confirmation individual]` notation

Used in "Mandatory questions" to mark a question that always requires **individual** confirmation — the full Question → Answer → Interpretation → Rewrite → "Is this what you meant?" → Confirm loop for that single question — regardless of whether the project is running in Strict or Agile confirmation mode. See `confirmation-protocol.md` for the full loop definition and the canonical list of always-strict categories.
