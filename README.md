# software-architect

> Placeholder — this file will be finalized in `plan-26-packaging-and-final-qa.md`.

## What it is

A Skill that acts as a Lead Software Architect for AI coding agents (Claude Code, Codex CLI, Cursor, Windsurf, etc.). It drives a project through a complete, question-by-question planning process — from a raw idea to a fully specified, cross-referenced set of engineering documents — before any production code is written.

## How to install (via `npx skills`)

_To be completed in plan-26._

## How to use

_To be completed in plan-26. Will summarize the phase flow and point to `docs/how-it-works.md`._

## Directory structure

```
software-architect/
  SKILL.md          # orchestrator (entrypoint)
  README.md          # this file
  rules/              # cross-cutting rules referenced by every phase
  playbooks/          # one file per phase (00-project-calibration .. 17-review)
  templates/           # document templates produced by each phase
  quality-gates/       # one gate per phase
  checklists/          # one checklist per phase
  scripts/             # Node.js validation scripts (IDs, traceability, gates)
  examples/            # end-to-end worked walkthroughs
  docs/                # this skill's own usage documentation
```

See `plan-00-overview.md` in the planning repository for the full rationale and phase-to-plan mapping.
