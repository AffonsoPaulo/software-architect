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
- **If `MINOR` (or `MAJOR`) differs**: tell the user explicitly that the Skill's mandatory content changed since this project (or cycle) was last touched, and ask directly which of three things to do. This is a real, explicit question, not a remark folded into a longer message, and the Skill waits for an answer before proceeding down any path. It never defaults to "continue normally" on the assumption that's what the user would want — picking the lower-friction path unasked is exactly what `ai-invariants.md`'s "Ask before assuming" forbids, applied to the Skill's own drift instead of a document's content.
  - **"Continue normally"** — proceed exactly as State 2 or State 3 below describes. In State 2, the in-progress phase's own diff (step 1 below) still always runs regardless of this answer — that part is cheap, safety-net-only, and not something the user opts out of; the question is only about the *other*, already-approved phases.
  - **"Run the compatibility audit"** — run the compatibility audit (below) before anything else, scoped to whichever phases are already approved at this point in the project. Scriptable checks only — fast, but blind to drift that only a judgment criterion would catch.
  - **"Run the full compatibility audit"** — the compatibility audit above, plus a phase-by-phase judgment-criteria review (below) for every already-approved phase. Meaningfully more thorough and meaningfully more expensive — the right choice when the drift is old enough, or the project consequential enough, that "the scripts are clean" isn't reassurance by itself.

Once this check has resolved — the Patch-only mention shown, or the Minor-or-above question answered, either branch — update `project-state.md`'s `skill_version` to match `SKILL.md`'s current `version`, in the same step, before continuing into State 2 or State 3 below. Without this, the exact same gap resurfaces on every future invocation even after the user already saw it and decided: the same Patch-level mention repeated forever, or the same Minor-or-above question re-asked every session regardless of the answer already given — precisely the repetitive noise this file's own Patch-only case warns against. This is bookkeeping, not a new confirmed answer subject to `confirmation-protocol.md`, and it never implies more than what actually happened above — bumping it after "continue normally" records only that the user was told and chose to proceed, not that a compatibility audit ran.

## Backfilling `export_labels` (mechanical, not a question)

`project-state.md`'s `export_labels` (`templates/project-state.md`) is populated once, mechanically, during Calibration — never a question of its own, just a direct consequence of the `language` answer (`playbooks/00-project-calibration.md`). When the Skill adds a new `export_labels` key after a project was calibrated, that project's `export_labels` simply doesn't have it: `scripts/build-doc-site.mjs`/`scripts/build-doc-word.mjs` both fall back to the English default for a missing key, so nothing errors — the export just quietly mixes in a stray English string among otherwise-translated chrome, and stays that way forever unless something backfills it.

This is drift too, but not the Minor/Patch kind above — it never needed a mandatory question in the first place, so there's nothing to ask about now either. Whenever `skill_version` drift is detected (Patch-only included, unlike the question above) and the project's `language` isn't `"en"`: run `scripts/validate-export-labels.mjs` against the project, and for any key it reports as missing or still equal to its English default, translate and record it the same mechanical way Calibration first did — no confirmation loop, no separate question, just applying the same translation quality already established for every other key. `scripts/validate-export-labels.mjs` is also part of phase 17's own gate (`quality-gates/17-review-gate.md`), so a gap here is caught there too even if it was missed on an earlier resume.

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
2. If the user asked for either audit above, run it now, before scoping the new request — its findings may be relevant context for what the new request should actually cover.
3. If the user declines both audits, or leaves a reported gap open, nothing blocks the project — this Skill has no authority over already-implemented code, and the project's existing `ready_for_implementation: true` stands.

## The compatibility audit (scriptable)

A read-only pass, structured like phase 17's structural check (`rules/delegation-policy.md`'s mechanical-audit use): re-runs every already-`approved` phase's current Quality Gate against the project's existing confirmed content and reports gaps, without modifying anything. Mechanically implemented by `scripts/audit-compatibility.mjs` (`node scripts/audit-compatibility.mjs [project-root]`) — it reruns `validate-gate.mjs` for every phase whose current status is `completed`, scriptable criteria checked directly, judgment criteria listed (not evaluated) for manual comparison against what was actually confirmed, exactly like `validate-gate.mjs` already does for a single phase. One mechanism, asked about upfront in either state (see above) rather than something the user has to think to request — State 3 is simply where it was first written up, not where it's restricted to. It never auto-applies a fix: any gap the user decides is worth addressing routes through a normal Change Request (`rules/change-management.md`), scoped to just that gap's own impact list, like any other CR. Declining it, or leaving a reported gap open, blocks nothing — see "Why not automatic" for why running it is the user's call, not a forced re-walk.

## The full compatibility audit (scriptable + judgment)

Everything the compatibility audit above does, plus one additional pass the scriptable version can't: for every already-`approved` phase, a subagent (`rules/delegation-policy.md`'s judgment-criteria-review use) reads that phase's own documents, the *current* `quality-gates/<phase>-gate.md`'s Judgment criteria, and the *current* playbook/template for that phase, and reports — per criterion — whether the content looks like it satisfies it, is unclear, or doesn't, with its reasoning either way. One subagent per phase (or a small batch), not the whole project at once, so a large already-approved history doesn't have to fit in one pass.

This closes a real gap the scriptable audit alone has: not every rule change shows up as a new scriptable check or even a new gate criterion — some just sharpen what an existing *judgment* criterion means, and the scriptable audit has no way to notice that at all, since it never evaluates judgment criteria to begin with, only lists them.

Every reported finding is a candidate, not a verdict. The main thread reads the specific document the finding points at and independently confirms the gap is real before treating it as one — a subagent can misread ambiguous prose the same way a person can, and this is exactly the kind of task that's easy to over-trust because it *looks* mechanical (rules/delegation-policy.md). A finding that doesn't hold up on that re-check is dropped silently, not reported to the user as a maybe. Only a finding the main thread confirms is genuinely a gap becomes a candidate for a Change Request, same as any finding from the scriptable audit — never auto-applied.

Meaningfully more expensive than the scriptable audit alone (one subagent pass per already-approved phase, not a script run), which is exactly why it's its own, separate option rather than folded into "run the audit" by default — see "Why not automatic," which applies here even more than to the scriptable version.

## Why not automatic

- Most Skill-version bumps are wording/clarity fixes with no new mandatory content. Walking every phase on every bump would be busywork disproportionate to the actual change — the same proportionality principle that already governs CR blast radius (`change-management.md`) and documentation depth (`rules/documentation-depth.md`). This applies doubly to the full audit's judgment review, which costs a subagent pass per phase rather than a script run.
- A finished project may never touch a given phase again. Forcing a full re-walk imposes cost with no corresponding user intent. On-touch checking (below) already covers the case where a phase's drift actually matters — the moment there's a real reason to reopen it.

## On-touch checking (applies in every state)

Whenever an already-`approved` phase is reopened for any reason — a CR's impact list, or an incremental cycle whose scope includes that phase — it is re-validated against its **current** Quality Gate, not the gate version that existed when it was first approved. This is what actually closes the drift loop for older phases: they stay silently out of sync only until the next real reason to reopen them, at which point current rules apply automatically, because gates are read fresh from disk every time (`rules/playbook-structure.md`) — never cached from the phase's original approval. This section exists only to make that behavior explicit, not to introduce a new mechanism.
