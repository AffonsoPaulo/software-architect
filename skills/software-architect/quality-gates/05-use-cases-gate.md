# Use Cases Gate

## Scriptable criteria
- [ ] Every `UC-XXX` ID is unique and correctly formatted per `rules/id-conventions.md` — checked by `scripts/validate-ids.mjs`
- [ ] Every `UC-XXX` has a non-empty `traces_to` pointing to a `US-XXX` that actually exists — checked by `scripts/validate-traceability.mjs`
- [ ] Every `UC-XXX` has at least one entry in `postconditions` — checked by `scripts/validate-gate.mjs`

## Judgment criteria (AI/human)
- [ ] Every main-flow step carrying real risk of failure has a corresponding alternative/exception flow
- [ ] Preconditions and postconditions are genuinely distinct from main-flow steps, not restated steps
- [ ] Diagrams follow `rules/diagram-conventions.md` (`sequenceDiagram` for multi-actor flows, `stateDiagram` added where the use case is stateful)
- [ ] Any alternative/exception flow touching payment or sensitive data was individually confirmed, regardless of confirmation mode
- [ ] Every use case was explicitly confirmed by the user, per `rules/confirmation-protocol.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific use case (or step within it), not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria — not available for the payment/sensitive-data confirmation criterion, which is always-strict.
