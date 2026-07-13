# Database Design Gate

## Scriptable criteria
- [ ] Every `TBL-XXX` ID is unique and correctly formatted per `rules/id-conventions.md` — checked by `scripts/validate-ids.mjs`
- [ ] Every `TBL-XXX` has a non-empty `traces_to` pointing to an `ENT-XXX` that actually exists — checked by `scripts/validate-traceability.mjs`
- [ ] Every `ENT-XXX` (`docs/06-domain-model/`) is referenced by at least one `TBL-XXX`, unless explicitly documented as embedded/exception — checked by `scripts/validate-traceability.mjs`

## Judgment criteria (AI/human)
- [ ] `database_type` was explicitly confirmed by the user, never defaulted — `[confirmation individual]`
- [ ] In brownfield mode, `database_type` reflects what's actually in production, gathered as fact rather than chosen fresh
- [ ] Foreign keys are consistent with the Domain Model's relationships — no FK implying an undocumented relationship
- [ ] Every index is tied to a stated access pattern, not added speculatively
- [ ] Migration strategy was explicitly confirmed — `[confirmation individual]`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific table/entity, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria — not available for `database_type` or migration strategy, both always-strict.
