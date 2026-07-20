# Project Calibration Gate

## Scriptable criteria
- [ ] `docs/project-state.md` exists, is valid YAML, and its `active_cycle_id` matches a real entry in `cycles[]` — checked by `scripts/validate-gate.mjs`
- [ ] Every phase `01` through `17` has a row in `calibration.md`'s own "Phase inclusion" table with a decided status — checked by `scripts/validate-gate.mjs` (not `project-state.md`'s `cycles[].phases[]`, which only gains an entry once a phase is actually reached, per `templates/project-state.md` — normal to be incomplete there this early, not a gap)
- [ ] Phases `03`, `08`, `11`, and `17` are not marked `skipped` in `calibration.md`'s table — checked by `scripts/validate-gate.mjs`
- [ ] `confirmation_mode`, `documentation_depth`, and `language` are all set (non-null) in `project-state.md` — checked by `scripts/validate-gate.mjs`
- [ ] The active cycle's `author` is set (non-blank) in `project-state.md` — checked by `scripts/validate-versioning.mjs`

## Judgment criteria (AI/human)
- [ ] The phase-inclusion list was proposed by the AI and explicitly confirmed by the user as a whole, not silently finalized
- [ ] Every `skip_reason` is a real, specific reason tied to this project — not a generic placeholder
- [ ] If project type is "feature on existing product" or "legacy migration," brownfield subagent research ran and its findings are recorded in `calibration.md`, clearly labeled as findings rather than decisions
- [ ] If prior artifacts named another project this Skill already planned, sibling-project subagent research ran and its findings are recorded in `calibration.md`'s own separate section, clearly labeled as facts about that other project, not this one's decisions
- [ ] `docs/00-calibration/calibration.md` accurately reflects everything confirmed in this phase — no drift between the two documents
- [ ] In incremental mode, project type, size, confirmation mode, documentation depth, and language were not re-asked — they were read from the existing `project-state.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific question that produced it, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria (not available here for the four always-mandatory phases — see `rules/confirmation-protocol.md`'s always-strict categories).
