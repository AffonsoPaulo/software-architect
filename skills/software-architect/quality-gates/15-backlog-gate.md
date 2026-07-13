# Backlog Gate

## Scriptable criteria
- [ ] Every `TASK-XXX` ID is unique and correctly formatted per `rules/id-conventions.md` — checked by `scripts/validate-ids.mjs`
- [ ] Every `TASK-XXX` has a non-empty `traces_to` pointing to a `US-XXX` or `UC-XXX` that actually exists — checked by `scripts/validate-traceability.mjs`
- [ ] Every `US-XXX` belonging to a milestone currently included in `docs/14-roadmap/roadmap.md` is referenced by at least one `TASK-XXX` — checked by `scripts/validate-traceability.mjs`

## Judgment criteria (AI/human)
- [ ] `definition_of_ready` is recorded once and applied consistently, not redefined per item
- [ ] Non-story items (infrastructure, setup) trace to whatever User Story/Use Case they actually enable, not left dangling
- [ ] Priority reflects actual relative order within its milestone, not an abstract importance label
- [ ] Every backlog item was explicitly confirmed by the user, per `rules/confirmation-protocol.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific item or User Story, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria.
