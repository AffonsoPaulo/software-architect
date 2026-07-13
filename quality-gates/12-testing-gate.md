# Testing Gate

## Scriptable criteria
- [ ] Every `TEST-XXX` ID is unique and correctly formatted per `rules/id-conventions.md` — checked by `scripts/validate-ids.mjs`
- [ ] Every `TEST-XXX` has a non-empty `traces_to` pointing to a `REQ-XXX` that actually exists — checked by `scripts/validate-traceability.mjs`
- [ ] 100% of functional `REQ-XXX` entries in `docs/03-requirements/requirements.md` are referenced by at least one `TEST-XXX` — checked by `scripts/validate-traceability.mjs`
- [ ] Every `TEST-XXX` has an explicit `kind` (`automated` or `manual`) — checked by `scripts/validate-gate.mjs`

## Judgment criteria (AI/human)
- [ ] Every non-functional requirement has a stated validation strategy, even if not a classic automated test
- [ ] Each test plan's description is specific enough to determine pass/fail, tied to its requirement's actual acceptance criterion
- [ ] `kind` reflects what was actually confirmed, not a default assumption of "automated"
- [ ] Every test plan was explicitly confirmed by the user, per `rules/confirmation-protocol.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific requirement or test plan, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria.
