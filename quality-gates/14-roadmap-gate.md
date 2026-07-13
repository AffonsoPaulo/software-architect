# Roadmap Gate

## Scriptable criteria
- [ ] `has_real_dates` is set explicitly (not null/missing) — checked by `scripts/validate-gate.mjs`
- [ ] 100% of approved `US-XXX`/`UC-XXX` entries appear in exactly one milestone's `delivers` list or in `deferred` — checked by `scripts/validate-traceability.mjs`
- [ ] No milestone dependency cycle exists — checked by `scripts/validate-gate.mjs`

## Judgment criteria (AI/human)
- [ ] Every milestone has a concrete, checkable done criterion — not "it's finished"
- [ ] `has_real_dates` reflects an actual confirmed commitment from the user, not an aspiration or a passing mention
- [ ] `gantt` is used only if `has_real_dates` is true; otherwise a dependency `flowchart` is used
- [ ] Every deferred item has a stated reason, not a blank placeholder
- [ ] The full milestone plan was explicitly confirmed by the user, per `rules/confirmation-protocol.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific milestone or unaddressed item, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria.
