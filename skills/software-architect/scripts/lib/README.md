# scripts/lib/

Shared parsers used by `validate-ids.mjs`, `validate-traceability.mjs`, and `validate-gate.mjs`: heading + italic metadata-line extraction for every document under `/docs/<phase>/*.md` (`rules/document-format.md`), a minimal YAML parser reserved for `project-state.md` specifically (the one document that stays YAML), and a document loader/indexer tying both together.

`cli.mjs` is unrelated to document parsing: it's the shared "was this file run directly, not imported?" check every script in `scripts/` uses for its dual import/CLI entry point, resolving symlinks first so the check doesn't silently fail when the script is invoked through one (an `npx skills` install layout, a PATH shim, or even just `/tmp` on macOS, which is itself a symlink to `/private/tmp`).
