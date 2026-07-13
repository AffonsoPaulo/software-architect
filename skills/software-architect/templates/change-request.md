# Change Request — Template

One file per Change Request, saved at `docs/change-requests/CR-XXX.md` in the target project (see `rules/document-locations.md`). Created per the process in `rules/change-management.md` — never as a substitute for editing an approved document directly. Follows the heading + metadata-line convention in `rules/document-format.md`.

## Structure (Casual)

```markdown
# CR-001 — <short title>
*Status: Open · Opened: 2026-07-13 · Traces to: REQ-014 · Author: Bob*

## What changed
<The specific change, stated plainly — what the artifact said before, what
it says now, confirmed with the user via the normal confirmation loop
(rules/confirmation-protocol.md).>

## Why
<The reason the change is needed. If this CR was proposed by the AI after
detecting an inconsistency rather than requested by the user, say so
explicitly — and note that the AI only ever proposed it; the user approved
opening the CR.>

## Impact list
<Computed from rules/traceability-rules.md: every document that references
any of the changed artifact(s), directly or transitively. Do not hand-pick
this list — derive it from the traceability graph, or the whole point of
having one is defeated.>

| Document | Artifacts affected | Status |
|---|---|---|
| docs/04-user-stories/user-stories.md | US-022, US-023 | Pending reapproval |
```

`Status` (top-level, the CR itself) is `Open` / `Closed`. `Traces to` names the specific artifact ID(s) this CR changes — the trigger, not the whole document. Each row's `Status` in the impact table is `Pending reapproval` / `Reapproved`.

## Fully Dressed additions

```markdown
# CR-001 — <short title>
*Status: Open · Opened: 2026-07-13 · Traces to: REQ-014 · Author: Bob*

## What changed
...

## Why
...

## Business justification
<Why this change is worth the reapproval churn it causes — distinct from
"Why," which explains the trigger; this explains why absorbing the
impact below is the right call versus leaving the original as-is.>

## Rollback plan
<If this change itself turns out to be wrong, how does the project get
back to the pre-CR state — re-superseding the ADR, reverting the
requirement text, re-running the impacted documents' confirmation. "Not
applicable — purely additive change with no prior state to revert to"
is valid when genuinely true.>

## Impact list
...
```

## Notes for whoever fills this in

- A CR does not close until every row in the impact list reaches `Status: Reapproved`. Partial closure does not exist.
- Reopening a phase during the Review gate (phase 17) always produces a CR — never a standalone edit to the document where the problem originated (`playbooks/17-review.md`).
- The artifact(s) named in `Traces to` keep their original ID after the change — a CR updates content, it never reassigns IDs. Closing the CR bumps the project's `docs_version` and adds a `docs/CHANGELOG.md` entry (`rules/versioning.md`) — there is no separate per-document version counter.
- `Author` is whoever drove this specific change — not necessarily the same person who originally created the artifact(s) it touches.
