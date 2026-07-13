# Change Request — Template

One file per Change Request, saved at `docs/change-requests/CR-XXX.md` in the target project (see `rules/document-locations.md`). Created per the process in `rules/change-management.md` — never as a substitute for editing an approved document directly.

## Structure

```yaml
---
id: CR-001
status: "open"
# "open" | "closed"
opened_at: "2026-07-13T10:00:00Z"
closed_at: null
artifact_ids: ["REQ-014"]
# The specific artifact ID(s) this CR changes — the trigger, not the whole document
reason: "<why this change is happening, in the user's own words as confirmed>"
impact_list:
  # Computed from rules/traceability-rules.md: every document that references
  # any of the artifact_ids above, directly or transitively. Do not hand-pick
  # this list — derive it from the traceability graph, or the whole point of
  # having one is defeated.
  - document: "docs/04-user-stories/user-stories.md"
    artifact_ids: ["US-022", "US-023"]
    status: "pending_reapproval"
    # "pending_reapproval" | "reapproved"
    reapproved_at: null
---
```

```markdown
## What changed
<The specific change, stated plainly — what the artifact said before, what
it says now, confirmed with the user via the normal confirmation loop
(rules/confirmation-protocol.md).>

## Why
<The reason the change is needed. If this CR was proposed by the AI after
detecting an inconsistency rather than requested by the user, say so
explicitly — and note that the AI only ever proposed it; the user approved
opening the CR.>
```

## Notes for whoever fills this in

- A CR does not close until every entry in `impact_list` reaches `status: reapproved`. Partial closure does not exist.
- Reopening a phase during the Review gate (phase 17) always produces a CR — never a standalone edit to the document where the problem originated (`plan-00-overview.md` decision #16, `playbooks/17-review.md`).
- The artifact(s) named in `artifact_ids` keep their original ID after the change — a CR updates content and increments the document's `version` in `project-state.md`, it never reassigns IDs.
