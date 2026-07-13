# software-architect

A Skill that acts as a Lead Software Architect for AI coding agents (Claude Code, Codex CLI, Cursor, Windsurf, and similar). It drives a project through a complete, question-by-question planning process — from a raw idea to a fully specified, cross-referenced set of engineering documents — before any production code is written.

## What it is

18 phases, from Project Calibration through Architecture Review, each producing a real document in the target project's `docs/` folder: Vision, Requirements, User Stories, Use Cases, Domain Model, Database Design, Architecture, API Design, Frontend Planning, Security, Testing, Deployment, Roadmap, Backlog, and an Implementation Plan — all cross-referenced by ID, validated by script, and never advanced past a phase whose confirmation with the user isn't actually done.

Four phases are always mandatory regardless of project size: Requirements Engineering, Architecture, Security, and Architecture Review. Every other phase can be skipped, but only with an explicit, recorded reason — never silently, and never decided by the AI alone.

The Skill works for any system in any language — a REST API, a server-rendered MVC monolith, a CLI tool, an event-driven service, or a library with no network surface at all. Nothing in it is REST/JSON-specific.

## How to install

Via `npx skills`, pointing at wherever this package is published/hosted. Once installed, invoke it by asking your AI agent to plan, specify, or architect a project — the Skill activates automatically based on intent, it doesn't require a special command.

## How to use

Just start describing what you want to build. The Skill begins at Project Calibration, asking about project type, size, how you want to be asked questions going forward (Strict — one question at a time, individually confirmed — or Agile — batched, except for consequential decisions like architecture or security, which are always confirmed individually regardless of mode), and how much documentation depth you want (Casual — the baseline field set — or Fully Dressed — the deeper, industry-standard field set: rationale and verification method on requirements, a full STRIDE pass in Security, and similar depth throughout). From there it walks the phases in order, confirming every answer before documenting it and every document before moving on.

Every document it writes (except its own internal `project-state.md`) is plain markdown, meant to be opened and read as a real document — no YAML block holding "the real data" above a thin prose restatement. Open any generated file, select all, and paste it into Word; that's the bar it's held to. For categories that are really a list of artifacts (Requirements, Use Cases, Architecture components, and similar), that means a short index file plus one file per item, so a single requirement or endpoint is its own reviewable, linkable document — see `rules/document-locations.md`.

If you come back to a project later, it resumes exactly where it left off — see `docs/project-state.md` in your project (created by the Skill, not part of this package). If a project is already fully planned and implemented and you want to add something new, just ask — the Skill recognizes this and opens a new incremental cycle rather than starting over.

Read `docs/how-it-works.md` for the full mechanics: the orchestrator, the confirmation loop, the traceability graph, and the final gate. `docs/faq.md` and `docs/troubleshooting.md` cover common questions and failure scenarios.

## Directory structure

```
software-architect/
  SKILL.md             # orchestrator (entrypoint, only file always loaded)
  README.md             # this file
  rules/                 # 12 cross-cutting rules referenced by every phase
  playbooks/             # one file per phase (00-project-calibration .. 17-review)
  templates/              # document templates produced by each phase
  quality-gates/          # one gate per phase
  checklists/             # one checklist per phase
  scripts/                # Node.js validation scripts (IDs, traceability, gates) — zero npm dependencies
  examples/               # two fully worked, validated example projects
  docs/                   # this skill's own usage documentation
```

See `docs/how-it-works.md` for how these pieces fit together, and `examples/` for two complete worked projects — a small CLI tool (Casual depth, Agile confirmation, an incremental second cycle) and a larger multi-tenant SaaS (Fully Dressed depth, Strict confirmation, all 18 phases).
