# Versioning and the Changelog

How `docs_version` (a single, project-wide semantic version, recorded in `project-state.md`) and `docs/CHANGELOG.md` (its human-readable log) track this documentation set's history over time. Distinct from `rules/id-conventions.md` (permanent artifact identity — never changes) and `rules/change-management.md` (the Change Request process itself — this rule covers what happens to the version/changelog as a *result* of a CR closing, or of a phase completing; it doesn't redefine when a CR is needed).

## What triggers an entry

Exactly two triggers, nothing else:

1. **A phase's gate passes with genuinely new content** — e.g. phase 03 completing with REQ-001 through REQ-004 newly written. Re-confirming something already recorded (resuming a session, incremental mode re-reading prior answers) is not a trigger.
2. **A Change Request closes** — every item on its impact list reaches `Reapproved` (`rules/change-management.md`). A CR always produces an entry once it closes, regardless of how small the change — by definition it's a change to something already approved, which is exactly what this log exists to surface.

Fixing a typo, rewording for clarity with no meaning change, or any edit that doesn't go through a CR and isn't new phase content, never produces an entry — see `rules/document-format.md`'s "paste into Word" bar; this changelog is for substance, not copy-editing.

A new incremental cycle opening is not a third trigger of its own — `scripts/new-cycle.mjs` creates the cycle before that cycle's own Calibration gate has passed, so it never writes a changelog entry itself. It's the very next entry (normally that cycle's own Calibration gate passing, trigger 1 above) that changes shape — see "A new cycle's own seed" below.

## Deciding Major, Minor, or Patch

- **Major** (`X.x.x`): `MAJOR` always equals the active cycle's own `id` (`project-state.md`'s `cycles[].id`) — not a separately-tracked counter, the exact same integer. It changes only when a new cycle starts, which is a structural fact already recorded elsewhere, not a judgment call. See "A new cycle's own seed" below for exactly which entry carries the change.
- **Minor** (`x.Y.x`): triggered by (1) — new content added during normal forward phase progress — or by (2) a CR that reverses or supersedes a previously-approved decision (an ADR marked `Superseded`, a changed Vision `Business objective`, a reversed architecture choice, a requirement whose meaning — not just wording — changed). Both share Minor because, within a cycle, both are "read this, something changed" — the distinction between routine progress and an overturned decision lives in the entry's own `Description` text (and, for a reversal, the CR/ADR it points at), not in a separate digit.
- **Patch** (`x.x.Z`): triggered by (2) — a CR that doesn't reverse or supersede a previously-approved decision. A correction, clarification, or propagated consistency fix — regardless of how many documents or phases are on its impact list. Traceability propagation (e.g. a wording fix in `UC-003` that also touches `US-002` and `ENT-004` for consistency) is exactly what Patch exists for; breadth alone never bumps this to Minor.

When it's genuinely unclear whether a CR reverses a decision or merely clarifies/propagates one, the AI does not default silently either way — it asks the user directly, per `confirmation-protocol.md`, and records the answer in the CR itself — this still decides Minor vs. Patch, exactly as before; it just no longer decides Major.

## A new cycle's own seed

The moment `MAJOR` needs to change, `MINOR` and `PATCH` both reset to `0` — same as any semver scheme. Concretely:

- **Cycle 1** never needs a distinct reset event: `docs_version` starts at `1.0.0` the instant Calibration's own gate passes for it, which already puts `MAJOR` at `1` (cycle 1's own id) with nothing prior to reset from.
- **Cycle 2 and beyond**: `scripts/new-cycle.mjs` runs first (appends the cycle to `cycles[]`, sets `active_cycle_id`) but does not touch `docs_version` or the changelog — that cycle's own Calibration gate hasn't passed yet at that point, and `docs_version` must never move without a matching changelog entry (`scripts/validate-versioning.mjs` checks the two stay in lockstep). Once that gate does pass, the entry logged for it (normally worded "Cycle N calibration confirmed — <scope>", same as any other phase-gate entry) is the one that resets: `MAJOR` becomes the new cycle's own `id`, `MINOR` and `PATCH` both `0` — e.g. cycle 2 opening after `1.13.0` logs `2.0.0`, not `1.14.0`. Every entry after that, until the next cycle opens, bumps Minor/Patch normally off that new `X.0.0` base.

## Where it lives, and how it starts

`docs/CHANGELOG.md`, root of `docs/`, not phase-numbered (`rules/document-locations.md`) — alongside `project-state.md`, for the same reason: project-wide, not phase-specific. The first entry is logged once Calibration (phase 00) completes: `1.0.0`, description along the lines of "Initial calibration confirmed."

`project-state.md`'s `changelog[]` array mirrors `CHANGELOG.md` 1:1 — same reason `change_requests[]` already mirrors `docs/change-requests/CR-XXX.md`: the AI needs a machine-readable copy to resume correctly without re-parsing a markdown table. Write both together, in the same step, every time — never one without the other. `scripts/validate-versioning.mjs` checks they stay in sync.

**Opposite order, same content.** `changelog[]` is appended to in chronological order (oldest first — a plain array push, the natural way to extend it turn by turn). `CHANGELOG.md`'s table is newest-first (the standard "Keep a Changelog" reading convention — a reader wants the latest entry without scrolling). This is intentional, not a bug to reconcile: `scripts/validate-versioning.mjs` compares them by content, reversing one before the comparison, not by raw order.

## Author

`Author` on a `CHANGELOG.md` entry is whoever drove the triggering event: the active cycle's `author` (`project-state.md`'s `cycles[]`, asked once per cycle in `playbooks/00-project-calibration.md` — never re-asked mid-cycle) for a phase-triggered entry, or the CR's own `Author` (its metadata line, `templates/change-request.md`) for a CR-triggered entry. These are normally the same person, since a CR is opened within an active cycle's session, but the CR's own metadata line is the recorded source specifically, since a CR can in principle be reviewed by someone other than whoever is currently driving unrelated parts of the same cycle.

This is also where every ID'd artifact's `Author` metadata-line key comes from (`rules/document-format.md`'s "Standard keys") — populated automatically from the active cycle when the artifact is created, never asked per-artifact. An artifact's `Author` and a later CR's `Author` can differ: the artifact records who created it, the CR that later touched it records who changed it.
