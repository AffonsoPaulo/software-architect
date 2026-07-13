# Architecture Gate

## Scriptable criteria
- [ ] Every `ARCH-XXX` ID is unique and correctly formatted per `rules/id-conventions.md` — checked by `scripts/validate-ids.mjs`
- [ ] Every non-functional `REQ-XXX` (`docs/03-requirements/`) is referenced by at least one `ARCH-XXX`'s `traces_to` — checked by `scripts/validate-traceability.mjs`
- [ ] Every `ARCH-XXX` with an `adr` field points to an `ADR-XXX` that actually exists under `docs/08-architecture/adr/` — checked by `scripts/validate-traceability.mjs`

## Judgment criteria (AI/human)
- [ ] Every consequential decision (style, core technology, any high-reversal-cost choice) has an associated ADR
- [ ] Every component has a single, clear responsibility — not overlapping or vague
- [ ] Architectural style and core technologies were individually confirmed, regardless of confirmation mode
- [ ] In brownfield mode, the architecture described reflects the actual existing system, not an assumed one
- [ ] `interaction_style_guidance` is specific enough for phase 09 to consume without re-asking the high-level question, and names what the project actually is rather than defaulting to REST

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific decision, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria — not available here, since Architecture is itself an always-strict category.
