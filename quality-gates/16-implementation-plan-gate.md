# Implementation Plan Gate

## Scriptable criteria
- [ ] Every `task` referenced in `sequence` exists as a `TASK-XXX` in `docs/15-backlog/` — checked by `scripts/validate-traceability.mjs`
- [ ] Every `depends_on` entry references a task that exists in this same `sequence` — checked by `scripts/validate-gate.mjs`
- [ ] **No dependency cycle exists in the `sequence` graph, direct or transitive** — checked by `scripts/validate-gate.mjs`
- [ ] Every task has a `definition_of_done` (inherited from the top-level standard, or an explicit task-specific addition) — checked by `scripts/validate-gate.mjs`

## Judgment criteria (AI/human)
- [ ] Every recorded dependency is a real technical constraint (grounded in Database/Architecture/API Design), not a stated preference
- [ ] Definition of Done is concrete and checkable, not a vague formality
- [ ] The full sequence was explicitly confirmed by the user, per `rules/confirmation-protocol.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails — especially a detected cycle — the Skill does not advance: it names the exact cycle or missing task and resolves it with the user before this phase can close, since an unresolved cycle makes the plan literally unexecutable, not just incomplete. See `rules/quality-gate-structure.md` for the escape valve on other stuck criteria.
