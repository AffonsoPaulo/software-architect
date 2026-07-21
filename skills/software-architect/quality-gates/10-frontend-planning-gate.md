# Frontend Planning Gate

## Scriptable criteria
- [ ] Every `SCR-XXX` ID is unique and correctly formatted per `rules/id-conventions.md` — checked by `scripts/validate-ids.mjs`
- [ ] Every `SCR-XXX` has a non-empty `traces_to` pointing to a `UC-XXX` that actually exists — checked by `scripts/validate-traceability.mjs`
- [ ] Every `UC-XXX` (`docs/05-use-cases/`) with a real user-facing interaction is referenced by at least one `SCR-XXX`, unless explicitly documented as backend-only — checked by `scripts/validate-traceability.mjs`
- [ ] Every `SCR-XXX` referenced in `frontend.md` (including the component inventory's "Used by" column) actually exists — checked by `scripts/validate-gate.mjs`'s phase-specific check

## Judgment criteria (AI/human)
- [ ] State management approach was individually confirmed, not defaulted
- [ ] Design system/UI kit was individually confirmed — existing kit named, or "to be created" explicitly recorded
- [ ] Frontend topology matches Architecture's confirmed decision, or a divergence was individually confirmed and reflected back via a Change Request if Architecture was already approved
- [ ] Target platforms and responsiveness expectations are explicit, not assumed
- [ ] Screen-to-Use-Case mapping reflects what was actually confirmed (including many-to-many cases), not a forced 1:1 assumption
- [ ] Every screen has a `Description` that states its own role, not a restatement of its Use Case's title, and a `Composition` naming components without specifying props, variants, or internal state
- [ ] The component inventory's entries actually reflect names used across more than one screen's Composition — not invented, not missing a genuine repeat (the existence of each referenced `SCR-XXX` is scriptable, above; whether the reuse itself is real is still a reading-comprehension call)
- [ ] Every screen states its States/Responsive behavior/Analytics events fields explicitly — "Same as General conventions" or the actual divergence — never silently omitted
- [ ] Every screen was explicitly confirmed by the user, per `rules/confirmation-protocol.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific screen or Use Case, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria — not available for state management or design system, both always-strict here.
