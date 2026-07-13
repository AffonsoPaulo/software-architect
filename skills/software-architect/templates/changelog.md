# Changelog — Template

Saved at `docs/CHANGELOG.md` in the target project (see `rules/document-locations.md`) — project-wide, root of `docs/`, not phase-numbered, alongside `project-state.md`. A running, human-readable log of every significant documentation event: new content added during normal phase progress, and every Change Request that closes. Not a place for cosmetic fixes — a typo correction or a reword with no meaning change never gets an entry (`rules/versioning.md`).

## Structure

```markdown
# Changelog

| Version | Author | Date | Description |
|---|---|---|---|
| 1.1.0 | Alice | 2026-07-14 | Added REQ-001, REQ-002, REQ-003 |
| 1.0.0 | Alice | 2026-07-13 | Initial calibration confirmed |
```

Newest entry first. One row per entry, never edited or removed once written — a correction to an entry's own description is itself a new entry, not a rewrite of the old one.

- `Version` — semantic version (`Major.Minor.Patch`), decided per `rules/versioning.md`. Matches `project-state.md`'s top-level `docs_version` exactly at all times; the two are never out of sync.
- `Author` — whoever drove the triggering event (the active cycle's author, or the closing CR's author) — never left blank (`rules/versioning.md`).
- `Date` — the date the entry was logged, `YYYY-MM-DD`.
- `Description` — one line, plain language, naming what actually changed (artifact IDs where relevant) — not a restatement of the version number or a generic "updated documentation."

## Notes for whoever fills this in

- Every entry here has a matching entry in `project-state.md`'s `changelog[]` array — written together, in the same step, never one without the other. `scripts/validate-versioning.mjs` checks the two stay in sync.
- This file is never hand-edited to "fix" history — if a past entry's description turns out to be wrong or incomplete, that's itself worth a note in a new entry, not a silent edit to an old one.
