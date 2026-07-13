# User Stories Gate

## Scriptable criteria
- [ ] Every `US-XXX` ID is unique and correctly formatted per `rules/id-conventions.md` — checked by `scripts/validate-ids.mjs`
- [ ] Every `US-XXX` has a non-empty `traces_to` pointing to a `REQ-XXX` that actually exists — checked by `scripts/validate-traceability.mjs`
- [ ] Every functional `REQ-XXX` (`docs/03-requirements/`) is referenced by at least one `US-XXX`, unless it's a documented non-functional exception — checked by `scripts/validate-traceability.mjs`

## Judgment criteria (AI/human)
- [ ] Each story is phrased as a capability from the actor's perspective, not restated implementation detail
- [ ] The persona is specific to this project's actual actors, not a generic placeholder
- [ ] The benefit is genuine value, not a restatement of the action
- [ ] INVEST holds well enough to proceed — in particular Independent and Testable
- [ ] Every story was explicitly confirmed by the user, per `rules/confirmation-protocol.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific story (or requirement, if the failure is a missing story) rather than the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria.
