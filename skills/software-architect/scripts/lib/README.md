# scripts/lib/

Shared parsers used by `validate-ids.mjs`, `validate-traceability.mjs`, and `validate-gate.mjs`: heading + italic metadata-line extraction for every document under `/docs/<phase>/*.md` (`rules/document-format.md`), a minimal YAML parser reserved for `project-state.md` specifically (the one document that stays YAML), and a document loader/indexer tying both together.
