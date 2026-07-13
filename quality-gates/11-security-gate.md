# Security Gate

## Scriptable criteria
- [ ] Every `SEC-XXX` ID is unique and correctly formatted per `rules/id-conventions.md` — checked by `scripts/validate-ids.mjs`
- [ ] Every `SEC-XXX` has a non-empty `traces_to` pointing to an existing `ARCH-XXX` and/or `API-XXX` — checked by `scripts/validate-traceability.mjs`
- [ ] Every `API-XXX` from `docs/09-api-design/api.md` has an explicit authentication/authorization statement recorded (including "public, no auth") — checked by `scripts/validate-gate.mjs`

## Judgment criteria (AI/human)
- [ ] Every data category classified as sensitive has an associated control
- [ ] Every threat identified in the threat model has a mitigation (`SEC-XXX`) or an explicitly accepted, registered risk (`RISK-XXX`) — never implicit
- [ ] Authentication mechanism and authorization model were individually confirmed
- [ ] Data classification was individually confirmed, and holds up against what the data actually is
- [ ] Compliance requirements were individually confirmed, including an explicit "none" if that's the real answer
- [ ] In brownfield mode, new interaction units follow the existing auth mechanism unless the user consciously decided otherwise

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific control, threat, or interaction unit, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve — it can defer a *mitigation* (recorded as an accepted risk) but never the *recording and confirmation* of the risk itself, since Security is an always-strict category throughout.
