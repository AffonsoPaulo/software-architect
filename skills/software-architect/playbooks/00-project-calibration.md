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
- Documentation depth: Casual or Fully Dressed — explain the difference (`rules/documentation-depth.md`) before asking — `[confirmation individual]`
- Document language — propose the language the user is currently conversing in, but confirm explicitly before recording it (`rules/language-policy.md`) — `[confirmation individual]`

**Asked in both modes, scoped differently:**

- Who is confirming this cycle's answers (name/handle)? — `[confirmation individual]`, recorded as this cycle's `author` (`project-state.md`'s `cycles[]`, `rules/versioning.md`). Asked fresh every single cycle, initial and incremental alike — never inherited from a prior cycle even when it's genuinely the same person asking again, since a different cycle can be a different person and nothing else in the interview would catch that.
- Are there prior artifacts (PRD, legacy code, a prototype, or another project this Skill already planned)? If so, where? (Initial mode: about the whole project. Incremental mode: about anything new since the last cycle that the Skill doesn't already know about.)
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
2. **Initial mode**: ask author (who's confirming this cycle) first, then project type → size → prior artifacts → stakeholders → confirmation mode → documentation depth → language, in that order (each confirmed individually — see "How to confirm answers"). Then propose the phase-inclusion list and confirm it as a whole (this list benefits from being reviewed together, once the individual inputs above are settled).
3. **Incremental mode**: read the existing `project-state.md` silently first — do not ask the user to repeat anything already there. Ask author first (this cycle's, not re-read from the prior cycle), then increment scope → prior artifacts (delta only) → stakeholders (delta only) → propose which phases this increment touches → ask about existing-document impact last, since the answer may depend on what phases are touched.
4. If project type is "feature on existing product" or "legacy migration" (in either mode): after project type is confirmed, trigger the brownfield subagent (see "Special cases") before finalizing the phase-inclusion list — its findings inform which phases are realistically needed.
5. If prior artifacts identifies another project this Skill already planned (in either mode, and regardless of project type — a genuinely new product can still have a sibling reference): after prior artifacts is confirmed, trigger a read-only subagent against that project's `docs/` (see "Special cases"). Unlike step 4, this is not gated by project type.

## How to confirm answers

Governed entirely by `rules/confirmation-protocol.md`. This playbook's only local addition: the phase-inclusion list is proposed as a batch (a table) even in Strict mode, because reviewing it item-by-item in isolation is worse than reviewing it as a coherent whole — but the user's edits to individual rows are still each acknowledged, not silently merged.

## How to document answers

- **Incremental mode's new cycle entry** → once scope and author are confirmed, run `node scripts/new-cycle.mjs <project-root> --scope "<scope>" --author "<author>"` rather than hand-editing `cycles[]` and `active_cycle_id` — it computes the next cycle id, initializes `ready_for_implementation`/`ready_for_implementation_at`/`phases` consistently, and never touches `id_sequences`, all mechanically. Follow with `scripts/validate-ids.mjs` and `scripts/validate-versioning.mjs` to confirm the file is still well-formed before continuing. Initial mode has no prior cycle to append to — `project-state.md` itself is created fresh from `templates/project-state.md` instead.
- Project type, size, confirmation mode, documentation depth, language → `project-state.md` top-level fields, plus written out in prose in `calibration.md`.
- Author → this cycle's entry in `project-state.md`'s `cycles[].author`, plus the `Author` row in `calibration.md`'s table (`rules/versioning.md`). Once this phase's gate passes, it also becomes the `Author` on every artifact this cycle goes on to create, and the first `docs/CHANGELOG.md` entry ("Initial calibration confirmed", or for incremental mode, the increment's own scope) is logged with it.
- Phase inclusion/skip table → both the terse `status`/`skip_reason` per phase entry in `project-state.md`'s active cycle, and the full table with reasoning in `calibration.md`.
- Brownfield subagent findings → a dedicated section in `calibration.md`, explicitly labeled as findings, never merged into a confirmed-answer section.
- Sibling-project subagent findings → their own separate dedicated section in `calibration.md` (`templates/calibration.md`'s "Sibling-project research summary"), distinct from the brownfield section above even when a project has both — the two answer different questions ("what does the existing codebase already do" vs. "what did a related project already decide") and reading them as one merged list would blur that.

## How to validate answers

- Every phase from 01 to 17 has an explicit status (included/skipped) before this phase's gate can pass — no phase is left implicitly undecided.
- Phases 03 (Requirements), 08 (Architecture), 11 (Security), and 17 (Review) can never be marked skipped, in either mode — reject the proposal and ask again if the user tries.
- `cycles[].author` is set for this cycle specifically — not blank, and not silently copied from the previous cycle's entry (`scripts/validate-versioning.mjs` checks this mechanically; see `quality-gates/00-calibration-gate.md`).

## Special cases

- **Brownfield subagent research**: triggered per `rules/delegation-policy.md` when project type is "feature on existing product" or "legacy migration". The subagent explores the existing repository read-only and reports facts (stack, structure, apparent conventions) — never decisions. If a finding contradicts something the user already said, surface the discrepancy explicitly per `rules/delegation-policy.md` before proceeding.
- **Sibling-project subagent research**: triggered per `rules/delegation-policy.md` whenever prior artifacts names another project this Skill already planned, regardless of project type. The subagent reads only that project's already-*approved* documents (a `draft` or `pending re-approval` document there is skipped — it isn't a settled decision yet) and reports back what it decided (tech stack, domain entities, architecture pattern, security posture), never as a recommendation for this project. These findings are consulted later, as an offered starting point during Domain Model, Database Design, Architecture, and Security's own confirmation loops — "Project A decided X here; reuse it, adapt it, or does this project need something different?" — never applied without that phase's own explicit confirmation, and never copied into this project's documents or ID sequence directly.
- **Incremental mode on a project with multiple prior cycles**: read the most recent cycle's state, not an aggregate of all of them — `project-state.md`'s `id_sequences` already accounts for the full history regardless of which cycle is being read.
- **User wants to skip Calibration itself**: not possible — explain that every phase's skip decision is decided here, so there is nothing to skip yet.

## Common ambiguities

- User unsure whether their project is a "prototype" or a "new product" — ask what happens to the code after this initial version: thrown away/replaced (prototype) or built on directly (new product). Don't guess.
- "Size" conflated with "importance" — a small, critical project is still small in the sense this question means (scope/surface area), not low-priority. Clarify if the user's answer suggests this confusion.
- Brownfield project type conflated with a sibling-project reference — these are independent: a genuinely new product can still have a sibling project informing it (e.g. a second product in the same company, sharing no code but a similar domain), and a brownfield project doesn't automatically have one. Ask about each on its own terms rather than assuming one implies the other.

## Frequent errors

- Finalizing the phase-inclusion list without the user's explicit confirmation of the full table, not just the individual factors that fed into it.
- Re-asking project type, size, confirmation mode, documentation depth, or language in incremental mode — these are project-wide and already answered.
- The opposite error for `author`: assuming it carries over from the previous cycle because it's "probably the same person," instead of asking fresh — this is the one question in this playbook that's deliberately re-asked every single cycle.
- Treating brownfield subagent findings as settled fact without flagging contradictions with what the user said.
- Treating sibling-project subagent findings as this project's own answer instead of a starting suggestion — a related project's decision confirms nothing about this one until the user actually says so in the phase where it comes up.
- Hand-editing `cycles[]`/`active_cycle_id` for a new incremental cycle instead of running `scripts/new-cycle.mjs` — the same class of easy-to-miss mistake (wrong next id, a forgotten field, an accidentally reset `id_sequences`) as the front-matter/delimiter bug this package already hit once, this time on the write side instead of the read side.

## Examples

> AI: "Given this is a feature on an existing product (medium size), here's my proposed phase list: Discovery — skip, this feature's context is already clear from your description; Business Analysis — include, there's a new business rule involved; Requirements — include (always mandatory)... [continues through 17]. Does this list match what you'd want, or should any of these change?"
> User: "Skip Frontend Planning too, this is a backend-only feature."
> AI: "Got it — updating Frontend Planning to skipped, reason: 'backend-only feature, no UI surface.' Here's the revised list: [...]. Confirm?"

## Anti-patterns

See `rules/ai-invariants.md` — in particular, never assume a phase's skip status without the user's explicit confirmation of the full list, and never treat a brownfield or sibling-project subagent's findings as a substitute for asking the user.

## Checklist

`checklists/00-calibration-checklist.md`

## Quality Gate

`quality-gates/00-calibration-gate.md`. Summary: every phase 01–17 has an explicit status; the four always-mandatory phases are never skipped; confirmation mode, documentation depth, language, and this cycle's author are recorded; `project-state.md` is left in a state `SKILL.md` can act on directly.

## Approval criteria

This phase is done when `project-state.md`'s active cycle has a complete phase list (every phase 01–17 present with a status), confirmation mode, documentation depth, and language are set, `calibration.md` is written, and the user has given explicit final confirmation of the whole phase-inclusion list. Only then does the Skill move to the first included phase.
