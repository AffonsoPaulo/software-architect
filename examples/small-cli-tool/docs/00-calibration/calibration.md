# Project Calibration

| Field | Value |
|---|---|
| Project type | New product — a small, standalone command-line utility. |
| Size | Small: one developer, no persistence layer, no multi-user concerns. |
| Stakeholders | None beyond the requesting developer — this is a personal/team utility, not a product with external stakeholders. |
| Prior artifacts | None. Greenfield. |
| Confirmation mode | Agile — batched confirmation, except for a short list of categories that always get confirmed one at a time regardless of mode (architecture, security, core technology choices). Chosen because the project is small and low-risk; the user preferred fewer interruptions. |
| Documentation depth | Casual — chosen because this is a small, low-stakes utility with no external stakeholders; the lighter field set is enough to build and maintain it confidently. |
| Language | English. |

## Phase inclusion

| Phase | Status | Reason |
|---|---|---|
| 01 — Discovery | included | Still worth a short Vision to ground scope, even for a small tool. |
| 02 — Business Analysis | skipped | No distinct business process or actors — just "a developer wants to convert files." |
| 03 — Requirements | included | Even a small tool needs its core conversion behavior stated as an explicit, verifiable requirement rather than left implicit. |
| 04 — User Stories | included | |
| 05 — Use Cases | included | |
| 06 — Domain Model | skipped | Pure input→transform→output tool; no persistent domain entities to model. |
| 07 — Database Design | skipped | No persistence layer at all. |
| 08 — Architecture | included | Even a single-file CLI benefits from an explicit decision on internal structure (parser/adapter boundaries), recorded once so it doesn't drift as formats are added. |
| 09 — API Design | included | The CLI's command surface is designed here, using the interaction-style-agnostic version of this phase — not an HTTP API. |
| 10 — Frontend Planning | skipped | No UI — CLI-only, no screens to plan. |
| 11 — Security | included | Even a small tool needs a stated position on trust boundaries around file handling. |
| 12 — Testing | included | |
| 13 — Deployment | included | Reduced scope — no traditional environments, but publishing/versioning still needs a plan. |
| 14 — Roadmap | included | Small, one milestone. |
| 15 — Backlog | included | |
| 16 — Implementation Plan | included | |
| 17 — Review | included | Every cycle ends with a final consistency check before implementation, regardless of size. |

## Cycle 2 (incremental) — see project-state.md

After cycle 1 reached `ready_for_implementation: true` and shipped, the user asked to add YAML as a supported format. See the "Project Calibration — Cycle 2" section below.

---

# Project Calibration — Cycle 2 (incremental)

## Increment scope
Add YAML as a third supported format (alongside CSV and JSON), converting to/from the same internal representation the tool already uses for CSV↔JSON.

## Phases touched

| Phase | Status | Reason |
|---|---|---|
| 03 — Requirements | included | One new functional requirement (YAML support). |
| 04 — User Stories | included | One new story. |
| 05 — Use Cases | included | One new use case (parallel structure to the existing CSV/JSON one). |
| 08 — Architecture | included | Minor addition — a new parser adapter component, no style change. |
| 09 — API Design | included | Extends the existing `convert` command with a new format option. |
| 11 — Security | included | Confirms the new format doesn't introduce a new trust boundary (it doesn't; same local-file model). |
| 12 — Testing | included | One new test plan. |
| 14 — Roadmap | included | New small milestone. |
| 15 — Backlog | included | |
| 16 — Implementation Plan | included | |
| 17 — Review | included | Every cycle, including a small incremental one, ends with a final consistency check before implementation. |

All other phases (01, 02, 06, 07, 10, 13) are not touched this cycle — nothing about Vision, Business Analysis, Domain Model, Database, Frontend, or Deployment changes for this increment.

## Existing documents affected
None requiring a Change Request — this is purely additive (new REQ, US, UC, ARCH component, API command option), no existing approved content changes meaning.
