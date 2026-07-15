# API Design Gate

## Scriptable criteria
- [ ] Every `API-XXX` ID is unique and correctly formatted per `rules/id-conventions.md` — checked by `scripts/validate-ids.mjs`
- [ ] Every `API-XXX` has `traces_to` pointing to both an existing `UC-XXX` and an existing `ARCH-XXX` — checked by `scripts/validate-traceability.mjs`
- [ ] Every `UC-XXX` (`docs/05-use-cases/`) with a real interaction surface is referenced by at least one `API-XXX`, unless explicitly documented as frontend-only — checked by `scripts/validate-traceability.mjs`

## Judgment criteria (AI/human)
- [ ] `failure_format` is used consistently across every interaction unit, no ad hoc exceptions
- [ ] `interaction_style` matches phase 08's `interaction_style_guidance`, or any divergence is explicitly justified and individually confirmed
- [ ] Interaction units are shaped consistently with phase 08's confirmed architectural pattern (e.g. command/query separation under CQRS, event producers/consumers under event-driven), or any divergence is explicitly justified and individually confirmed
- [ ] The vocabulary used actually fits the confirmed interaction style — no JSON-request/response framing forced onto a server-rendered, CLI, or event-driven project
- [ ] Authentication/authorization mechanism was individually confirmed
- [ ] In brownfield mode, style/versioning/failure format reflect what's actually in production
- [ ] Every interaction unit was explicitly confirmed by the user, per `rules/confirmation-protocol.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific interaction unit or Use Case, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria — not available for the authentication/authorization criterion, which is always-strict.
