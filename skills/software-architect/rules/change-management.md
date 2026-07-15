# Change Management

How the Skill handles a change to a document that has already been approved. This is never a direct edit — it always goes through a formal Change Request (CR).

## When a CR is triggered

- The user explicitly asks to change something already confirmed in an earlier phase.
- The AI detects an inconsistency between an approved document and something confirmed later — this happens constantly in normal, non-Review phases, not just at the Review gate. Example: while confirming an entity's attributes in phase 06 (Domain Model), the user realizes a precondition recorded in `UC-003` (phase 05, already approved) was incomplete. The fix is not local to the `ENT-XXX` document being written right now — `UC-003` itself is out of date and must be corrected via a CR, with its own impact list recomputed (which may reach back further still, e.g. `US-XXX`), even though the discovery happened phases later. The AI only ever **proposes** a CR in this case — it never applies a change to an approved document on its own initiative, and it never silently limits the fix to whichever document it happens to be writing at the time.
- Reopening a phase during the Review gate (phase 17) is a specific case of the above — this always routes through a CR, never a standalone fix to the originating document, so downstream propagation actually happens.

## Flagging the conflict out loud is not the same as opening the CR

The single most common way this rule fails in practice isn't the AI missing the conflict — it's the AI noticing it, saying so, and then documenting the current phase's answer anyway, leaving the earlier document stale until the user separately, explicitly asks for the fix later. That is not "proposing a CR," it's mentioning one and not following through — indistinguishable in outcome from never having noticed at all.

Once the AI has said out loud that a new answer contradicts an approved document, the current question's confirmation loop (`confirmation-protocol.md`) does not reach step 9 (document updated) until the CR has actually been opened (at minimum steps 1–3 below: created, artifact named, impact list computed) and put in front of the user as part of resolving *this* answer — never deferred as a remark the user has to chase down separately.

- **Wrong**: "Good — noting that this also affects UC-003's routing assumption." *(then documents the new `API-XXX` and moves on to the next question; `UC-003` stays stale until the user separately asks about it.)*
- **Right**: "This also changes `UC-003`'s routing assumption, which is already approved — opening CR-004 against `UC-003` now; impact list: `UC-003` and anything that traces to it. Let's resolve that first, then I'll come back and confirm this `API-XXX` answer." The current answer is not treated as confirmed while a self-detected conflict sits open.

## The CR process

1. Create a new `CR-XXX` entry using `templates/change-request.md`, saved at `docs/change-requests/CR-XXX.md` in the target project.
2. The CR names the specific artifact ID(s) affected (e.g. `REQ-014`) and the reason for the change.
3. Using the table in `traceability-rules.md`, compute every downstream document that references the affected artifact(s), directly or transitively. This is the CR's "impact list."
4. Every document on the impact list is reopened for a fresh confirmation pass on the specific parts affected — not rewritten wholesale, and not silently left as-is. "Reopened" means the full confirmation loop (`confirmation-protocol.md`, steps 1–10) runs for the affected part, exactly as it would for a brand-new answer in that phase: the AI shows its proposed rewrite, asks "Is this what you meant?", and only writes the file after the user confirms. This holds even when the user is the one who said "yes, update it" — that instruction authorizes reopening the question, it is not itself the confirmed rewrite. The user approving that a fix should happen is a different thing from the user approving the specific text of the fix; both are required, and skipping straight from the first to a direct file edit is exactly the shortcut this rule exists to prevent.
   - **Wrong**: User: "Yeah, go ahead and update UC-003." AI edits `UC-003` directly, then reports "Done — I updated UC-003 to match." *(The rewritten text was never actually shown for confirmation; only the fact that an edit happened was.)*
   - **Right**: User: "Yeah, go ahead and update UC-003." AI: "Here's the specific change to `UC-003`'s main flow: [shows the rewritten step]. Does this match what you meant?" User confirms. Only then is `UC-003` written and marked `pending re-approval` → `approved`.
   - This applies exactly the same way when the mechanism used to apply the edit is a script, a bulk find-replace, or any other programmatic/automated change instead of the AI typing the new text directly — a batch of files edited by a script the AI wrote and ran is still a set of confirmed answers, not a shortcut around them. The resulting text of each affected line still has to be shown and confirmed before the script runs, not summarized as "updated N lines across M files" after the fact.
5. Each affected document's status in `project-state.md` moves from `approved` to `pending re-approval` until its owning phase confirms the update.
6. Only once every item on the impact list is re-approved does the CR itself close.
7. Closing always produces a `docs/CHANGELOG.md` entry — Major or Patch depending on whether the change reverses/supersedes a prior decision, not on how many documents the impact list touches, per `rules/versioning.md`. No exception for a CR that feels small or whose impact list is wide; that's exactly what Patch is for.

## What a CR does not do

- It does not touch documents outside the computed impact list — traceability is what defines blast radius, not guesswork.
- It does not bypass the normal confirmation loop (`confirmation-protocol.md`) for any reopened document — a CR is not a shortcut, it's a scoped reopening.
- It does not reset any artifact ID — see `id-conventions.md`. A changed requirement keeps its `REQ-XXX` ID; only its content changes, and the project's `docs_version` bumps once the CR closes (`rules/versioning.md`) — there is no separate per-document version counter anymore.

## Logging

Every applied CR is logged in `project-state.md`: CR ID, artifact(s) affected, date, and the full impact list with each item's re-approval status. This log is what lets a future session (or a later `cycle`, see `document-locations.md`) understand why a document looks the way it does.

The CR's own metadata line (`templates/change-request.md`) carries an `Author` key — whoever drove that specific change, not necessarily the same field as the artifact's own `Author` (which records who originally created it, per `rules/versioning.md`).
