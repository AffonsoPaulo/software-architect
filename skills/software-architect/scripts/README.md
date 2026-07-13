# scripts/

Deterministic validation scripts, plain Node.js (built-in modules only, no npm dependencies — `npx skills` already requires Node, so this avoids a second runtime dependency).

- `validate-ids.mjs` — checks artifact ID format and uniqueness against `rules/id-conventions.md`
- `validate-traceability.mjs` — builds the traceability graph from `rules/traceability-rules.md` and reports orphans/broken references, respecting phases marked as skipped in the target project's `project-state.md`
- `validate-gate.mjs` — generic runner that loads a phase's `quality-gates/` + `checklists/` pair and reports which scriptable criteria pass
- `self-test.mjs` — regression test: runs the validators above against both projects in `examples/` and fails if either isn't clean. `examples/` only exists on the `with-examples` branch (see root `README.md`) — on `main` this script reports both as intentionally skipped.
- `lib/` — shared parsers (markdown heading+metadata-line extraction, YAML for `project-state.md`, document indexing)

Implemented in `plan-23-validation-scripts.md`.
