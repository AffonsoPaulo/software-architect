# Versioning and the Changelog

How `docs_version` (a single, project-wide semantic version, recorded in `project-state.md`) and `docs/CHANGELOG.md` (its human-readable log) track this documentation set's history over time. Distinct from `rules/id-conventions.md` (permanent artifact identity — never changes) and `rules/change-management.md` (the Change Request process itself — this rule covers what happens to the version/changelog as a *result* of a CR closing, or of a phase completing; it doesn't redefine when a CR is needed).

## What triggers an entry

Exactly two triggers, nothing else:

1. **A phase's gate passes with genuinely new content** — e.g. phase 03 completing with REQ-001 through REQ-004 newly written. Re-confirming something already recorded (resuming a session, incremental mode re-reading prior answers) is not a trigger.
2. **A Change Request closes** — every item on its impact list reaches `Reapproved` (`rules/change-management.md`). A CR always produces an entry once it closes, regardless of how small the change — by definition it's a change to something already approved, which is exactly what this log exists to surface.

Fixing a typo, rewording for clarity with no meaning change, or any edit that doesn't go through a CR and isn't new phase content, never produces an entry — see `rules/document-format.md`'s "paste into Word" bar; this changelog is for substance, not copy-editing.

## Deciding Major, Minor, or Patch

- **Minor** (`x.Y.x`): triggered by (1) above — new content added during normal forward phase progress. The common case for most of a project's life.
- **Patch** (`x.x.Z`): triggered by (2) — a CR whose impact list touches one document/category and doesn't reverse or supersede a previously-approved decision. A correction or clarification.
- **Major** (`X.x.x`): triggered by (2) — a CR whose impact list spans more than one phase/category, OR that reverses/supersedes a previously-approved decision (an ADR marked `Superseded`, a changed Vision `Business objective`, a reversed architecture choice).

When a CR's impact could be read either way, prefer Major — the cost of under-signaling a real reversal is higher than the cost of an extra Major bump.

## Where it lives, and how it starts

`docs/CHANGELOG.md`, root of `docs/`, not phase-numbered (`rules/document-locations.md`) — alongside `project-state.md`, for the same reason: project-wide, not phase-specific. The first entry is logged once Calibration (phase 00) completes: `1.0.0`, description along the lines of "Initial calibration confirmed."

`project-state.md`'s `changelog[]` array mirrors `CHANGELOG.md` 1:1 — same reason `change_requests[]` already mirrors `docs/change-requests/CR-XXX.md`: the AI needs a machine-readable copy to resume correctly without re-parsing a markdown table. Write both together, in the same step, every time — never one without the other. `scripts/validate-versioning.mjs` checks they stay in sync.

**Opposite order, same content.** `changelog[]` is appended to in chronological order (oldest first — a plain array push, the natural way to extend it turn by turn). `CHANGELOG.md`'s table is newest-first (the standard "Keep a Changelog" reading convention — a reader wants the latest entry without scrolling). This is intentional, not a bug to reconcile: `scripts/validate-versioning.mjs` compares them by content, reversing one before the comparison, not by raw order.

## Author

`Author` on a `CHANGELOG.md` entry is whoever drove the triggering event: the active cycle's `author` (`project-state.md`'s `cycles[]`, asked once per cycle in `playbooks/00-project-calibration.md` — never re-asked mid-cycle) for a phase-triggered entry, or the CR's own `Author` (its metadata line, `templates/change-request.md`) for a CR-triggered entry. These are normally the same person, since a CR is opened within an active cycle's session, but the CR's own metadata line is the recorded source specifically, since a CR can in principle be reviewed by someone other than whoever is currently driving unrelated parts of the same cycle.

This is also where every ID'd artifact's `Author` metadata-line key comes from (`rules/document-format.md`'s "Standard keys") — populated automatically from the active cycle when the artifact is created, never asked per-artifact. An artifact's `Author` and a later CR's `Author` can differ: the artifact records who created it, the CR that later touched it records who changed it.
