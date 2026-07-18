# Skill Version Drift

How the Skill handles its own `skill_version` (`project-state.md`, sourced from `SKILL.md`'s frontmatter `version`) being older than the currently installed Skill — i.e. the Skill's own rules/playbooks changed since this project (or its active cycle) was started. Distinct from `rules/versioning.md`, which tracks the target **project's** `docs_version` as its own documents change — this file is about the **Skill's** version drifting under an existing project, not the project's documents changing.

## When this is checked

Once per invocation, per `SKILL.md`'s entry logic, in states 2 and 3 only (never state 1 — a brand-new project always starts on the current version, nothing can have drifted yet).

## Skill version semantics: Minor vs. Patch

`SKILL.md`'s own `version` follows `MAJOR.MINOR.PATCH`, decided by the same underlying question `rules/versioning.md` uses for the target project's `docs_version` — "does this add new confirmable content" — aimed at the Skill's own files instead of a project's documents:

- **Patch** (`x.x.Z`): wording/clarity fixes, tightened enforcement of an existing rule, cross-reference corrections — nothing an already-approved document could now be missing as a result. Most Skill updates are this.
- **Minor** (`x.Y.x`): a new or changed mandatory question, a new Quality Gate criterion, a new required template field — anything that could mean a document already marked `approved` under an older version is now incomplete relative to current rules.
- **Major** (`X.x.x`): not currently used. Nothing in the Skill's evolution so far has meant reversing a structural decision the way a project's own CR can reverse an approved decision. Reserved for a future breaking change to `project-state.md`'s own schema, if that's ever needed — until then, `MAJOR` stays fixed at `1`.

This is a plain `semver` comparison, not something that needs a Skill-level changelog to determine: if the recorded `skill_version`'s `MINOR` (or `MAJOR`) component differs from the current `version`'s, a Minor-or-above change happened somewhere in between, regardless of how many Patch releases came with it. If only `PATCH` differs, nothing mandatory could have changed.

## The first thing that happens, in either state

The moment `skill_version` is found older than the current version — before doing anything else in this file — compare the two using the semver rule above.

- **If only `PATCH` differs**: no mandatory content could have changed. Mention it briefly, in passing — "the Skill received a patch-level update since this project started, nothing new to confirm" — and continue normally, no question asked, no audit implied. Forcing a decision here would be exactly the kind of noise that trains a user to stop reading these prompts, the same failure mode `rules/versioning.md` already guards against by not over-signaling Major on every CR.
- **If `MINOR` (or `MAJOR`) differs**: tell the user explicitly that the Skill's mandatory content changed since this project (or cycle) was last touched, and ask directly — continue normally, or run the compatibility audit against the phases already approved first? This is a real, explicit question, not a remark folded into a longer message, and the Skill waits for an answer before proceeding down either path. It never defaults to "continue normally" on the assumption that's what the user would want — picking the lower-friction path unasked is exactly what `ai-invariants.md`'s "Ask before assuming" forbids, applied to the Skill's own drift instead of a document's content.
  - **"Continue normally"** — proceed exactly as State 2 or State 3 below describes. In State 2, the in-progress phase's own diff (step 1 below) still always runs regardless of this answer — that part is cheap, safety-net-only, and not something the user opts out of; the question is only about the *other*, already-approved phases.
  - **"Run the audit"** — run the compatibility audit (below) before anything else, scoped to whichever phases are already approved at this point in the project.

Once this check has resolved — the Patch-only mention shown, or the Minor-or-above question answered, either branch — update `project-state.md`'s `skill_version` to match `SKILL.md`'s current `version`, in the same step, before continuing into State 2 or State 3 below. Without this, the exact same gap resurfaces on every future invocation even after the user already saw it and decided: the same Patch-level mention repeated forever, or the same Minor-or-above question re-asked every session regardless of the answer already given — precisely the repetitive noise this file's own Patch-only case warns against. This is bookkeeping, not a new confirmed answer subject to `confirmation-protocol.md`, and it never implies more than what actually happened above — bumping it after "continue normally" records only that the user was told and chose to proceed, not that a compatibility audit ran.

## State 2 — project in progress, resuming mid-phase

If `skill_version` is older and the active cycle has a phase with `status: in_progress`, once the check above has run (whether that meant a blocking question or just the brief Patch-only mention):

1. Before jumping straight to `next_pending_question`, re-read the **current** playbook for that in-progress phase and diff its "Mandatory questions" against what has already been confirmed and documented so far in this phase.
2. Any mandatory question with no corresponding confirmed answer yet — because it didn't exist, or wasn't mandatory, last time this phase was touched — gets asked now, inserted at the point the current playbook's Interview flow would put it, not tacked on at the end or silently deferred to the gate.
3. `next_pending_question` is only authoritative for what to ask next among questions the diff didn't flag. Where the two disagree, the diff wins.
4. This is a safety net layered on top of the phase's Quality Gate, not a replacement for it — the gate (`rules/quality-gate-structure.md`) still runs at phase close regardless, since a gate file is always read fresh from disk, never cached from when the phase started. Catching the gap here just means it's asked in the right place in the conversation instead of being caught late and out of order at the gate.
5. **This diff only covers the current in-progress phase.** Earlier phases in the same cycle that are already `approved` are covered by the audit above, if the user asked for it — not by this step, which never reaches back further than the phase currently open.

## State 3 — already implemented (`ready_for_implementation: true`), new request

Once the check above has run (whether that meant a blocking question or just the brief Patch-only mention):

1. If the new request's scope (per `playbooks/00-project-calibration.md`'s incremental mode) touches a given phase, that phase is checked against the **current** Quality Gate as part of reopening it normally — see "On-touch checking" below. No extra step needed here beyond what incremental mode already does.
2. If the user asked for the audit above, run it now, before scoping the new request — its findings may be relevant context for what the new request should actually cover.
3. If the user declines the audit, or leaves a reported gap open, nothing blocks the project — this Skill has no authority over already-implemented code, and the project's existing `ready_for_implementation: true` stands.

## The compatibility audit

A read-only pass, structured like phase 17's structural check (`rules/delegation-policy.md`'s mechanical-audit use): re-runs every already-`approved` phase's current Quality Gate against the project's existing confirmed content and reports gaps, without modifying anything. Mechanically implemented by `scripts/audit-compatibility.mjs` (`node scripts/audit-compatibility.mjs [project-root]`) — it reruns `validate-gate.mjs` for every phase whose current status is `completed`, scriptable criteria checked directly, judgment criteria listed for manual comparison against what was actually confirmed, exactly like `validate-gate.mjs` already does for a single phase. One mechanism, asked about upfront in either state (see above) rather than something the user has to think to request — State 3 is simply where it was first written up, not where it's restricted to. It never auto-applies a fix: any gap the user decides is worth addressing routes through a normal Change Request (`rules/change-management.md`), scoped to just that gap's own impact list, like any other CR. Declining it, or leaving a reported gap open, blocks nothing — see "Why not automatic" for why running it is the user's call, not a forced re-walk.

## Why not automatic

- Most Skill-version bumps are wording/clarity fixes with no new mandatory content. Walking every phase on every bump would be busywork disproportionate to the actual change — the same proportionality principle that already governs CR blast radius (`change-management.md`) and documentation depth (`rules/documentation-depth.md`).
- A finished project may never touch a given phase again. Forcing a full re-walk imposes cost with no corresponding user intent. On-touch checking (below) already covers the case where a phase's drift actually matters — the moment there's a real reason to reopen it.

## On-touch checking (applies in every state)

Whenever an already-`approved` phase is reopened for any reason — a CR's impact list, or an incremental cycle whose scope includes that phase — it is re-validated against its **current** Quality Gate, not the gate version that existed when it was first approved. This is what actually closes the drift loop for older phases: they stay silently out of sync only until the next real reason to reopen them, at which point current rules apply automatically, because gates are read fresh from disk every time (`rules/playbook-structure.md`) — never cached from the phase's original approval. This section exists only to make that behavior explicit, not to introduce a new mechanism.
