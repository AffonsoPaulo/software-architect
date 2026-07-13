# Business Analysis Gate

## Scriptable criteria
- [ ] `docs/02-business-analysis/business-analysis.md` exists — checked by `scripts/validate-gate.mjs`
- [ ] Every `BR-XXX` ID is unique and correctly formatted per `rules/id-conventions.md` — checked by `scripts/validate-ids.mjs`

## Judgment criteria (AI/human)
- [ ] Every business process described has at least one identified actor
- [ ] Every business rule is a genuine policy/constraint, not a restated process step
- [ ] The justification reflects the user's own stated reasoning, not a generic AI-constructed business case
- [ ] Actors are business roles, not UX personas
- [ ] Every process and rule was explicitly confirmed by the user, per `rules/confirmation-protocol.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific question that produced it, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria.
