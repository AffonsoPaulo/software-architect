# software-architect

A Skill that acts as a Lead Software Architect for AI coding agents (Claude Code, Codex CLI, Cursor, Windsurf, and similar). It drives a project through a complete, question-by-question planning process — from a raw idea to a fully specified, cross-referenced set of engineering documents — before any production code is written.

```mermaid
flowchart LR
    Idea(["Idea"]) --> Calibration["00\nCalibration"]
    Calibration --> Discovery["01\nDiscovery"]
    Discovery --> Requirements["02-05\nRequirements"]
    Requirements --> Design["06-10\nDesign"]
    Design --> Hardening["11-13\nHardening"]
    Hardening --> Delivery["14-16\nDelivery plan"]
    Delivery --> Review["17\nReview"]
    Review --> Ready{{"Ready to build"}}
```

*(Simplified — see the phase table below for all 18. Nothing after Review is this Skill's job: it plans, it never writes production code itself.)*

## What it is

18 phases, each producing a real document in the target project's `docs/` folder — all cross-referenced by ID, validated by script, and never advanced past a phase whose confirmation with the user isn't actually done.

| # | Phase | Status |
|---|---|---|
| 00 | Calibration | Always runs first (entry point) |
| 01 | Discovery | Optional |
| 02 | Business Analysis | Optional |
| 03 | Requirements Engineering | **Mandatory** |
| 04 | User Stories | Optional |
| 05 | Use Cases | Optional |
| 06 | Domain Model | Optional |
| 07 | Database Design | Optional |
| 08 | Architecture | **Mandatory** |
| 09 | API Design | Optional |
| 10 | Frontend Planning | Optional |
| 11 | Security | **Mandatory** |
| 12 | Testing | Optional |
| 13 | Deployment | Optional |
| 14 | Roadmap | Optional |
| 15 | Backlog | Optional |
| 16 | Implementation Plan | Optional |
| 17 | Architecture Review | **Mandatory** |

"Optional" doesn't mean arbitrary or silent, though. Calibration (00) is where the AI proposes which of these phases actually apply to this project — by project type, size, and (for brownfield work) a read-only research pass over the existing codebase — and the user confirms or edits that list before anything else happens. No phase is ever skipped without that explicit, recorded reason (`rules/document-locations.md`, `playbooks/00-project-calibration.md`).

The Skill works for any system in any language — a REST API, a server-rendered MVC monolith, a CLI tool, an event-driven service, or a library with no network surface at all. Nothing in it is REST/JSON-specific.

## What keeps it honest

A few cross-cutting rules apply in every phase, not just some:

- **It never assumes.** Every answer goes through ask → interpret → rewrite back → show exactly how it'll be documented → confirm, before anything is written down. If the AI doesn't have enough confirmed information to proceed, it says so explicitly instead of guessing — see `rules/ai-invariants.md` and `rules/confirmation-protocol.md`.
- **Not every question gets the same weight.** Strict mode confirms everything one at a time; Agile mode batches — except architecture, security, core technology choices, and anything else with a high cost of reversal, which are always confirmed individually regardless of mode (`rules/confirmation-protocol.md`'s always-strict categories).
- **Consequential decisions get a permanent record.** Any decision with real reversal cost — not just architectural style — produces its own ADR (`templates/adr.md`), referenced rather than restated everywhere it matters.
- **Every artifact is cross-referenced and checked.** Requirements, stories, use cases, entities, tables, components, endpoints, controls, tests, and tasks all get a permanent ID and a traceability link, validated by script for orphans, broken references, and format — not just spot-checked (`rules/id-conventions.md`, `rules/traceability-rules.md`, `scripts/`).
- **An unconfirmed decision from an earlier phase never gets silently edited.** Changing something already approved always goes through a formal Change Request that recomputes and reopens everything downstream that depends on it (`rules/change-management.md`).

## How to install

```
npx skills add AffonsoPaulo/software-architect
```

Once installed, invoke it by asking your AI agent to plan, specify, or architect a project — the Skill activates automatically based on intent, it doesn't require a special command.

## How to use

Just start describing what you want to build. Calibration asks how you want to be asked questions going forward (Strict or Agile) and how much documentation depth you want (Casual — the baseline field set — or Fully Dressed — the deeper, industry-standard field set: rationale and verification method on requirements, a full STRIDE pass in Security, and similar depth throughout). From there it walks the phases confirmed in Calibration, in order, confirming every answer before documenting it and every document before moving on.

Every document it writes (except its own internal `project-state.md`) is plain markdown, meant to be opened and read as a real document — no YAML block holding "the real data" above a thin prose restatement. Open any generated file, select all, and paste it into Word; that's the bar it's held to. For categories that are really a list of artifacts (Requirements, Use Cases, Architecture components, and similar), that means a short index file plus one file per item, so a single requirement or endpoint is its own reviewable, linkable document — see `rules/document-locations.md`.

To review the whole thing at once instead of file by file, `node skills/software-architect/scripts/build-doc-site.mjs` builds a single, self-contained HTML page from any project's `docs/` — a clickable table of contents plus every document in reading order, offline, no server required.

If you come back to a project later, it resumes exactly where it left off — see `docs/project-state.md` in your project (created by the Skill, not part of this package). If a project is already fully planned and implemented and you want to add something new, just ask — the Skill recognizes this and opens a new incremental cycle rather than starting over.

Read `docs/how-it-works.md` for the full mechanics: the orchestrator, the confirmation loop, the traceability graph, and the final gate. `docs/faq.md` and `docs/troubleshooting.md` cover common questions and failure scenarios.

## Directory structure

```
software-architect/            (repo root)
  README.md                    # this file
  LICENSE
  examples/                    # this branch only — see "Worked examples" below
  skills/
    software-architect/        # everything npx skills add actually installs
      SKILL.md                 # orchestrator (entrypoint, only file always loaded)
      rules/                    # 12 cross-cutting rules referenced by every phase
      playbooks/                 # one file per phase (00-project-calibration .. 17-review)
      templates/                  # document templates produced by each phase
      quality-gates/               # one gate per phase
      checklists/                  # one checklist per phase
      scripts/                     # Node.js validation scripts (IDs, traceability, gates) — zero npm dependencies
      docs/                       # this skill's own usage documentation
```

`SKILL.md` lives under `skills/software-architect/`, not at the repo root — `npx skills add` treats a root-level `SKILL.md` as a single-file skill and installs only that file, discarding everything it references. Nesting it under `skills/<name>/` is what makes the tool install the whole directory. See `docs/how-it-works.md` for how these pieces fit together.

## Worked examples

You're on the `with-examples` branch, so `examples/` is right here at the repo root: a small CLI tool (Casual depth, Agile confirmation, an incremental second cycle) and a larger multi-tenant SaaS (Fully Dressed depth, Strict confirmation, all 18 phases). This branch exists separately from `main` because `npx skills add` installs whatever's on `main` — keeping these two full example projects off it means using the Skill never drags them onto an installer's disk. Run `skills/software-architect/scripts/self-test.mjs` to validate both.

## License

MIT — see `LICENSE`.
