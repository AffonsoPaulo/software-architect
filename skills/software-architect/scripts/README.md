# scripts/

Plain Node.js (built-in modules only, no npm dependencies — `npx skills` already requires Node, so this avoids a second runtime dependency). Validation scripts plus one presentation tool.

- `validate-ids.mjs` — checks artifact ID format and uniqueness against `rules/id-conventions.md`
- `validate-traceability.mjs` — builds the traceability graph from `rules/traceability-rules.md` and reports orphans/broken references, respecting phases marked as skipped in the target project's `project-state.md`
- `validate-gate.mjs` — generic runner that loads a phase's `quality-gates/` + `checklists/` pair and reports which scriptable criteria pass
- `self-test.mjs` — regression test: runs the validators above against both projects in `examples/` and fails if either isn't clean
- `build-doc-site.mjs` — not a validator: builds a single, self-contained HTML page from a target project's `docs/` — a clickable table of contents plus every document in reading order, offline (Mermaid is vendored, not loaded from a CDN). Read-only, never runs automatically; run it yourself with `node scripts/build-doc-site.mjs [project-root] [output-path]` whenever you want a browsable view instead of reading file by file.
- `lib/` — shared parsers (markdown heading+metadata-line extraction, YAML for `project-state.md`, document indexing) and `lib/vendor/` (the vendored Mermaid.js build)

Implemented in `plan-23-validation-scripts.md`.
