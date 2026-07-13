# Domain Model Gate

## Scriptable criteria
- [ ] Every `ENT-XXX` ID is unique and correctly formatted per `rules/id-conventions.md` — checked by `scripts/validate-ids.mjs`
- [ ] Every `ENT-XXX` has a non-empty `traces_to` pointing to a `UC-XXX` that actually exists — checked by `scripts/validate-traceability.mjs`
- [ ] Every `ENT-XXX` has at least one entry in `invariants` (non-empty list) — checked by `scripts/validate-gate.mjs`
- [ ] Every `ENT-XXX` is either `aggregate_root: true` or has a non-null `belongs_to_aggregate` pointing to an existing aggregate root — checked by `scripts/validate-gate.mjs`

## Judgment criteria (AI/human)
- [ ] Every invariant is a genuine business rule, not a restated attribute or a placeholder
- [ ] No entity, attribute, or relationship is described in database terms (tables, columns, foreign keys, indexes) — this phase stays conceptual
- [ ] Entity vs. value object classification is correct (identity vs. no identity)
- [ ] Aggregate boundaries were individually confirmed, regardless of confirmation mode
- [ ] Relationship cardinalities were explicitly confirmed, not assumed as "obvious"

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific entity/relationship, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria — not available for the aggregate-boundary confirmation criterion, which is always-strict.
