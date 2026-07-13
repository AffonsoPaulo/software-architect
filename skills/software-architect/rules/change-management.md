# Change Management

How the Skill handles a change to a document that has already been approved. This is never a direct edit — it always goes through a formal Change Request (CR).

## When a CR is triggered

- The user explicitly asks to change something already confirmed in an earlier phase.
- The AI detects an inconsistency (e.g. during the Review gate, phase 17) between an approved document and something confirmed later. The AI only ever **proposes** a CR in this case — it never applies a change to an approved document on its own initiative.
- Reopening a phase during the Review gate (phase 17) — per `plan-00-overview.md` decision #16, this always routes through a CR, never a standalone fix to the originating document, so downstream propagation actually happens.

## The CR process

1. Create a new `CR-XXX` entry using `templates/change-request.md`, saved at `docs/change-requests/CR-XXX.md` in the target project.
2. The CR names the specific artifact ID(s) affected (e.g. `REQ-014`) and the reason for the change.
3. Using the table in `traceability-rules.md`, compute every downstream document that references the affected artifact(s), directly or transitively. This is the CR's "impact list."
4. Every document on the impact list is reopened for a fresh confirmation pass on the specific parts affected — not rewritten wholesale, and not silently left as-is.
5. Each affected document's status in `project-state.md` moves from `approved` to `pending re-approval` until its owning phase confirms the update.
6. Only once every item on the impact list is re-approved does the CR itself close.
7. Closing always produces a `docs/CHANGELOG.md` entry — Major or Patch depending on the impact list's size and whether the change reverses/supersedes a prior decision, per `rules/versioning.md`. No exception for a CR that feels small; that's exactly what Patch is for.

## What a CR does not do

- It does not touch documents outside the computed impact list — traceability is what defines blast radius, not guesswork.
- It does not bypass the normal confirmation loop (`confirmation-protocol.md`) for any reopened document — a CR is not a shortcut, it's a scoped reopening.
- It does not reset any artifact ID — see `id-conventions.md`. A changed requirement keeps its `REQ-XXX` ID; only its content changes, and the project's `docs_version` bumps once the CR closes (`rules/versioning.md`) — there is no separate per-document version counter anymore.

## Logging

Every applied CR is logged in `project-state.md`: CR ID, artifact(s) affected, date, and the full impact list with each item's re-approval status. This log is what lets a future session (or a later `cycle`, see `document-locations.md`) understand why a document looks the way it does.

The CR's own metadata line (`templates/change-request.md`) carries an `Author` key — whoever drove that specific change, not necessarily the same field as the artifact's own `Author` (which records who originally created it, per `rules/versioning.md`).
