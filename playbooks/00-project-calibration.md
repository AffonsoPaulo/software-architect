# Playbook 00 — Project Calibration

## Objective

The mandatory entry point for every project, in every cycle. Determines project type and size, decides — with the user, never alone — which of phases 01–17 apply to this cycle and which are skippable with a recorded reason, sets the project-wide confirmation mode and document language, and initializes or extends `docs/project-state.md`. No other phase runs before this one completes.

This playbook has two modes, selected by `SKILL.md` based on the project's current state (see `SKILL.md`'s entry logic):

- **Initial mode**: no `docs/project-state.md` exists yet. Full calibration, creates `cycle` 1.
- **Incremental mode**: `docs/project-state.md` exists and its active cycle already has `ready_for_implementation: true`. The user wants to add something new. Creates a new `cycle`, reusing every project-wide setting and every existing document/ID as a confirmed baseline.

## When to run

Always, first, in both of the situations above. There is no path through this Skill that reaches phase 01 without going through this playbook.

## When NOT to run

Never skipped. If `SKILL.md` detects state 2 (project in progress, mid-cycle), it resumes directly at the recorded `next_pending_question` instead of re-running this playbook — that is a resume, not a skip.

## Inputs

- Initial mode: none — this is the first phase.
- Incremental mode: the full existing `docs/project-state.md`, and, implicitly, every document it references (their content is not re-read line by line here, but their existence and IDs are treated as the confirmed baseline).

## Outputs

- `docs/project-state.md` — created (initial mode) or extended with a new `cycle` (incremental mode).
- `docs/00-calibration/calibration.md` — created (initial mode) or appended with a new cycle section (incremental mode).

## Documents produced

- `docs/00-calibration/calibration.md` via `templates/calibration.md`.
- `docs/project-state.md` via `templates/project-state.md`.

## Mandatory questions

**Initial mode only** (project-wide, asked once, never re-asked in later cycles):

- Project type: new product / feature on existing product / prototype / internal script / legacy migration — `[confirmation individual]`
- Size: small (few screens/endpoints, one developer) / medium / large (multiple teams, multi-tenant, compliance needs) — `[confirmation individual]`
- Confirmation mode: Strict or Agile — explain the difference (`rules/confirmation-protocol.md`) before asking — `[confirmation individual]`
- Document language — propose the language the user is currently conversing in, but confirm explicitly before recording it (`rules/language-policy.md`) — `[confirmation individual]`

**Asked in both modes, scoped differently:**

- Are there prior artifacts (PRD, legacy code, a prototype)? If so, where? (Initial mode: about the whole project. Incremental mode: about anything new since the last cycle that the Skill doesn't already know about.)
- Are there stakeholders beyond the current user who need to be consulted?
- For each phase 01–17 (initial) or each phase the increment might touch (incremental): include or skip, with a reason. The AI proposes a list; the user confirms or edits it — the AI never finalizes this list unilaterally.

**Incremental mode only:**

- What is the scope of this increment, in the user's own words?
- Does this increment require changing any already-approved document? If yes, this is not answered here — it is flagged to open a Change Request (`rules/change-management.md`) once the relevant phase is reached.

## Optional questions

- Deeper stakeholder mapping (roles, decision authority) if the user wants to go beyond a simple list.
- More detail about prior artifacts than "it exists at X" — only if the user volunteers it or it's needed to answer the phase-inclusion question.

## Interview flow

1. Detect mode automatically by checking for `docs/project-state.md` — this is a file check, not a question.
2. **Initial mode**: ask project type → size → prior artifacts → stakeholders → confirmation mode → language, in that order (each confirmed individually — see "How to confirm answers"). Then propose the phase-inclusion list and confirm it as a whole (this list benefits from being reviewed together, once the individual inputs above are settled).
3. **Incremental mode**: read the existing `project-state.md` silently first — do not ask the user to repeat anything already there. Ask increment scope → prior artifacts (delta only) → stakeholders (delta only) → propose which phases this increment touches → ask about existing-document impact last, since the answer may depend on what phases are touched.
4. If project type is "feature on existing product" or "legacy migration" (in either mode): after project type is confirmed, trigger the brownfield subagent (see "Special cases") before finalizing the phase-inclusion list — its findings inform which phases are realistically needed.

## How to confirm answers

Governed entirely by `rules/confirmation-protocol.md`. This playbook's only local addition: the phase-inclusion list is proposed as a batch (a table) even in Strict mode, because reviewing it item-by-item in isolation is worse than reviewing it as a coherent whole — but the user's edits to individual rows are still each acknowledged, not silently merged.

## How to document answers

- Project type, size, confirmation mode, language → `project-state.md` top-level fields, plus written out in prose in `calibration.md`.
- Phase inclusion/skip table → both the terse `status`/`skip_reason` per phase entry in `project-state.md`'s active cycle, and the full table with reasoning in `calibration.md`.
- Brownfield subagent findings → a dedicated section in `calibration.md`, explicitly labeled as findings, never merged into a confirmed-answer section.

## How to validate answers

- Every phase from 01 to 17 has an explicit status (included/skipped) before this phase's gate can pass — no phase is left implicitly undecided.
- Phases 03 (Requirements), 08 (Architecture), 11 (Security), and 17 (Review) can never be marked skipped, in either mode — reject the proposal and ask again if the user tries.

## Special cases

- **Brownfield subagent research**: triggered per `rules/delegation-policy.md` when project type is "feature on existing product" or "legacy migration". The subagent explores the existing repository read-only and reports facts (stack, structure, apparent conventions) — never decisions. If a finding contradicts something the user already said, surface the discrepancy explicitly per `rules/delegation-policy.md` before proceeding.
- **Incremental mode on a project with multiple prior cycles**: read the most recent cycle's state, not an aggregate of all of them — `project-state.md`'s `id_sequences` already accounts for the full history regardless of which cycle is being read.
- **User wants to skip Calibration itself**: not possible — explain that every phase's skip decision is decided here, so there is nothing to skip yet.

## Common ambiguities

- User unsure whether their project is a "prototype" or a "new product" — ask what happens to the code after this initial version: thrown away/replaced (prototype) or built on directly (new product). Don't guess.
- "Size" conflated with "importance" — a small, critical project is still small in the sense this question means (scope/surface area), not low-priority. Clarify if the user's answer suggests this confusion.

## Frequent errors

- Finalizing the phase-inclusion list without the user's explicit confirmation of the full table, not just the individual factors that fed into it.
- Re-asking project type, size, confirmation mode, or language in incremental mode — these are project-wide and already answered.
- Treating brownfield subagent findings as settled fact without flagging contradictions with what the user said.

## Examples

> AI: "Given this is a feature on an existing product (medium size), here's my proposed phase list: Discovery — skip, this feature's context is already clear from your description; Business Analysis — include, there's a new business rule involved; Requirements — include (always mandatory)... [continues through 17]. Does this list match what you'd want, or should any of these change?"
> User: "Skip Frontend Planning too, this is a backend-only feature."
> AI: "Got it — updating Frontend Planning to skipped, reason: 'backend-only feature, no UI surface.' Here's the revised list: [...]. Confirm?"

## Anti-patterns

See `rules/ai-invariants.md` — in particular, never assume a phase's skip status without the user's explicit confirmation of the full list, and never treat a brownfield subagent's findings as a substitute for asking the user.

## Checklist

`checklists/00-calibration-checklist.md`

## Quality Gate

`quality-gates/00-calibration-gate.md`. Summary: every phase 01–17 has an explicit status; the four always-mandatory phases are never skipped; confirmation mode and language are recorded; `project-state.md` is left in a state `SKILL.md` can act on directly.

## Approval criteria

This phase is done when `project-state.md`'s active cycle has a complete phase list (every phase 01–17 present with a status), confirmation mode and language are set, `calibration.md` is written, and the user has given explicit final confirmation of the whole phase-inclusion list. Only then does the Skill move to the first included phase.
