# examples/

End-to-end worked walkthroughs proving the Skill works in practice, not just in theory.

- `small-cli-tool/` — small project that skips several phases via Calibration (e.g. Frontend Planning), demonstrates scope calibration, Agile confirmation mode, and Casual documentation depth, and includes a second `cycle` (incremental feature added after `ready_for_implementation: true`) to demonstrate the reentry mechanism
- `saas-multi-tenant/` — larger project running all 18 phases, demonstrates Strict confirmation mode, Fully Dressed documentation depth, and real `[confirmation individual]` decisions

Each example includes its final `project-state.md`, every document produced (plain markdown, per `rules/document-format.md` — no YAML front-matter except `project-state.md` itself, and split into an index file + one file per item for categories like Requirements/Use Cases/Architecture per `rules/document-locations.md`), a `transcript.md` with real dialogue excerpts, and a clean run of `scripts/self-test.mjs`.
