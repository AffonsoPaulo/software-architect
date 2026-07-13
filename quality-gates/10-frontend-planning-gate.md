# Frontend Planning Gate

## Scriptable criteria
- [ ] Every screen entry has a non-empty `traces_to` pointing to a `UC-XXX` that actually exists — checked by `scripts/validate-traceability.mjs`
- [ ] Every `UC-XXX` (`docs/05-use-cases/`) with a real user-facing interaction is referenced by at least one screen, unless explicitly documented as backend-only — checked by `scripts/validate-traceability.mjs`

## Judgment criteria (AI/human)
- [ ] State management approach was individually confirmed, not defaulted
- [ ] Design system/UI kit was individually confirmed — existing kit named, or "to be created" explicitly recorded
- [ ] Target platforms and responsiveness expectations are explicit, not assumed
- [ ] Screen-to-Use-Case mapping reflects what was actually confirmed (including many-to-many cases), not a forced 1:1 assumption
- [ ] Every screen was explicitly confirmed by the user, per `rules/confirmation-protocol.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific screen or Use Case, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria — not available for state management or design system, both always-strict here.
