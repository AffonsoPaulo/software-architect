# API Design Gate

## Scriptable criteria
- [ ] Every `API-XXX` ID is unique and correctly formatted per `rules/id-conventions.md` — checked by `scripts/validate-ids.mjs`
- [ ] Every `API-XXX` has `traces_to` pointing to both an existing `UC-XXX` and an existing `ARCH-XXX` — checked by `scripts/validate-traceability.mjs`
- [ ] Every `UC-XXX` from `docs/05-use-cases/use-cases.md` with a real API surface is referenced by at least one `API-XXX`, unless explicitly documented as frontend-only — checked by `scripts/validate-traceability.mjs`

## Judgment criteria (AI/human)
- [ ] `error_format` is used consistently across every endpoint, no ad hoc exceptions
- [ ] `api_style` matches phase 08's `api_style_guidance`, or any divergence is explicitly justified and individually confirmed
- [ ] Authentication/authorization mechanism was individually confirmed
- [ ] In brownfield mode, style/versioning/error format reflect what's actually in production
- [ ] Every endpoint was explicitly confirmed by the user, per `rules/confirmation-protocol.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific endpoint or Use Case, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria — not available for the authentication/authorization criterion, which is always-strict.
