# Project Calibration Checklist

- [ ] `docs/project-state.md` exists and is valid
- [ ] Every phase 01–17 has an explicit status (included or skipped) in the active cycle
- [ ] Requirements (03), Architecture (08), Security (11), and Review (17) are never marked skipped
- [ ] `confirmation_mode` is set
- [ ] `language` is set
- [ ] The full phase-inclusion list was shown to the user and explicitly confirmed, not assumed
- [ ] Every skip reason is specific to this project, not a generic placeholder
- [ ] Brownfield subagent research ran and is recorded, if project type warrants it
- [ ] `docs/00-calibration/calibration.md` matches what was actually confirmed, with no drift from `project-state.md`
- [ ] (Incremental mode only) Project type, size, confirmation mode, and language were not re-asked
