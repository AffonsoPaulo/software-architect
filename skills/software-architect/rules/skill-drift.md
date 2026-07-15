# Skill Version Drift

How the Skill handles its own `skill_version` (`project-state.md`, sourced from `SKILL.md`'s frontmatter `version`) being older than the currently installed Skill — i.e. the Skill's own rules/playbooks changed since this project (or its active cycle) was started. Distinct from `rules/versioning.md`, which tracks the target **project's** `docs_version` as its own documents change — this file is about the **Skill's** version drifting under an existing project, not the project's documents changing.

## When this is checked

Once per invocation, per `SKILL.md`'s entry logic, in states 2 and 3 only (never state 1 — a brand-new project always starts on the current version, nothing can have drifted yet).

## State 2 — project in progress, resuming mid-phase

If `skill_version` is older and the active cycle has a phase with `status: in_progress`:

1. Tell the user explicitly that the Skill's rules changed since this phase was last touched (`SKILL.md`'s existing warning).
2. Before jumping straight to `next_pending_question`, re-read the **current** playbook for that in-progress phase and diff its "Mandatory questions" against what has already been confirmed and documented so far in this phase.
3. Any mandatory question with no corresponding confirmed answer yet — because it didn't exist, or wasn't mandatory, last time this phase was touched — gets asked now, inserted at the point the current playbook's Interview flow would put it, not tacked on at the end or silently deferred to the gate.
4. `next_pending_question` is only authoritative for what to ask next among questions the diff didn't flag. Where the two disagree, the diff wins.
5. This is a safety net layered on top of the phase's Quality Gate, not a replacement for it — the gate (`rules/quality-gate-structure.md`) still runs at phase close regardless, since a gate file is always read fresh from disk, never cached from when the phase started. Catching the gap here just means it's asked in the right place in the conversation instead of being caught late and out of order at the gate.

## State 3 — already implemented (`ready_for_implementation: true`), new request

Do not automatically re-walk every phase — see "Why not automatic" below. Instead:

1. Warn the user once that the Skill's version has advanced since this project's active cycle reached `ready_for_implementation: true`.
2. If the new request's scope (per `playbooks/00-project-calibration.md`'s incremental mode) touches a given phase, that phase is checked against the **current** Quality Gate as part of reopening it normally — see "On-touch checking" below. No extra step needed here beyond what incremental mode already does.
3. If the user asks specifically whether anything is now missing project-wide — or simply wants to know before deciding what to work on next — offer an explicit, opt-in **compatibility audit**: a read-only pass, structured like phase 17's structural check (`rules/delegation-policy.md`'s mechanical-audit use), that re-runs every phase's current Quality Gate against the project's existing confirmed content and reports gaps, without modifying anything.
4. The audit never auto-applies a fix. Any gap the user decides is worth addressing routes through a normal Change Request (`rules/change-management.md`), scoped to just that gap's own impact list, like any other CR.
5. If the user declines the audit, or leaves a reported gap open, nothing blocks the project — this Skill has no authority over already-implemented code, and the project's existing `ready_for_implementation: true` stands.

## Why not automatic

- Most Skill-version bumps are wording/clarity fixes with no new mandatory content. Walking every phase on every bump would be busywork disproportionate to the actual change — the same proportionality principle that already governs CR blast radius (`change-management.md`) and documentation depth (`rules/documentation-depth.md`).
- A finished project may never touch a given phase again. Forcing a full re-walk imposes cost with no corresponding user intent. On-touch checking (below) already covers the case where a phase's drift actually matters — the moment there's a real reason to reopen it.

## On-touch checking (applies in every state)

Whenever an already-`approved` phase is reopened for any reason — a CR's impact list, or an incremental cycle whose scope includes that phase — it is re-validated against its **current** Quality Gate, not the gate version that existed when it was first approved. This is what actually closes the drift loop for older phases: they stay silently out of sync only until the next real reason to reopen them, at which point current rules apply automatically, because gates are read fresh from disk every time (`rules/playbook-structure.md`) — never cached from the phase's original approval. This section exists only to make that behavior explicit, not to introduce a new mechanism.
