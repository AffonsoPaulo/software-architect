# Project Calibration Gate

## Scriptable criteria
- [ ] `docs/project-state.md` exists and is valid YAML — checked by `scripts/validate-gate.mjs`
- [ ] Every phase `01` through `17` has an entry with a non-empty `status` field in the active cycle — checked by `scripts/validate-gate.mjs`
- [ ] Phases `03`, `08`, `11`, and `17` do not have `status: skipped` in the active cycle — checked by `scripts/validate-gate.mjs`
- [ ] `confirmation_mode` and `language` are both set (non-null) in `project-state.md` — checked by `scripts/validate-gate.mjs`

## Judgment criteria (AI/human)
- [ ] The phase-inclusion list was proposed by the AI and explicitly confirmed by the user as a whole, not silently finalized
- [ ] Every `skip_reason` is a real, specific reason tied to this project — not a generic placeholder
- [ ] If project type is "feature on existing product" or "legacy migration," brownfield subagent research ran and its findings are recorded in `calibration.md`, clearly labeled as findings rather than decisions
- [ ] `docs/00-calibration/calibration.md` accurately reflects everything confirmed in this phase — no drift between the two documents
- [ ] In incremental mode, project type, size, confirmation mode, and language were not re-asked — they were read from the existing `project-state.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific question that produced it, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria (not available here for the four always-mandatory phases — see `rules/confirmation-protocol.md`'s always-strict categories).
