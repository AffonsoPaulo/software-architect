# scripts/lib/

Shared parsers used by `validate-ids.mjs`, `validate-traceability.mjs`, and `validate-gate.mjs`: heading + italic metadata-line extraction for every document under `/docs/<phase>/*.md` (`rules/document-format.md`), a minimal YAML parser reserved for `project-state.md` specifically (the one document that stays YAML), and a document loader/indexer tying both together.

`cli.mjs` is unrelated to document parsing: it's the shared "was this file run directly, not imported?" check every script in `scripts/` uses for its dual import/CLI entry point, resolving symlinks first so the check doesn't silently fail when the script is invoked through one (an `npx skills` install layout, a PATH shim, or even just `/tmp` on macOS, which is itself a symlink to `/private/tmp`).

`doc-tree.mjs` is the phase/category layout `build-doc-site.mjs` and `build-doc-word.mjs` both build from — which files belong to which phase, in what order (mirrors `rules/document-locations.md`) — kept separate from either script's own rendering logic (HTML vs. RTF) since that part is genuinely shared and format-agnostic.

`rtf.mjs` and `markdown-to-rtf.mjs` are `build-doc-word.mjs`'s own rendering layer, the RTF sibling of `markdown-lite.mjs` — a from-scratch, minimal Markdown-to-RTF renderer (headings with outline levels and bookmarks, bold/italic/code, tables, lists, blockquotes, Mermaid fences as labeled source blocks) plus the low-level RTF text/bookmark/field-instruction escaping it's built on. Not merged with `markdown-lite.mjs` — HTML and RTF have different-enough escaping and structural rules that a shared renderer would be more awkward than two focused ones, the same reasoning `validate-traceability.mjs` and `build-doc-site.mjs` already apply elsewhere in this package.
