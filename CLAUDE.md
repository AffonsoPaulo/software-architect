# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A Claude Code Skill (`skills/software-architect/`) that turns Claude into a Lead Software Architect: it plans a software project — Discovery through Architecture Review, 18 phases — before any production code is written. This repo is the Skill's *source*; the Skill itself is consumed by a completely separate, unrelated project's Claude Code session (via `npx skills add` or manual install), never run from inside this repo.

Everything under `skills/software-architect/` (`SKILL.md`, `rules/`, `playbooks/`, `templates/`, `quality-gates/`, `checklists/`, `scripts/`, `docs/`) is the product. `examples/` (two fully worked, validated projects — `small-cli-tool` Casual depth, `saas-multi-tenant` Fully Dressed depth) is dev/test fixture data, not shipped to end users.

## The two-branch workflow — read this before committing anything

- **`with-examples`**: the branch to develop and test on. Has `examples/`.
- **`main`**: what `npx skills add` actually installs. Has no `examples/`.

Always make edits on `with-examples` first, run `self-test.mjs`, then cherry-pick the same commit(s) onto `main`. Never edit `main` directly, and never push either branch until the user explicitly says to (this repo's owner tends to batch several fixes locally before pushing — don't assume a fix should go out immediately just because it's finished and tested).

## Commands

All scripts are dependency-free Node.js (`.mjs`, built-in modules only), run from the repo root.

```bash
# Full regression suite — runs every validator against both examples/ projects, must be clean before any push
node skills/software-architect/scripts/self-test.mjs

# Individual validators against a target project (an examples/ project, or any other planned project)
node skills/software-architect/scripts/validate-ids.mjs <project-root>
node skills/software-architect/scripts/validate-traceability.mjs <project-root>
node skills/software-architect/scripts/validate-versioning.mjs <project-root>
node skills/software-architect/scripts/validate-tone.mjs <project-root>
node skills/software-architect/scripts/validate-heading-language.mjs <project-root>

# Quality-gate runner for one phase (00-17) — generic ID/traceability checks plus that phase's own mechanical check
node skills/software-architect/scripts/validate-gate.mjs <phase> [project-root]

# Re-run gate checks for every already-completed phase against the *currently installed* rules — surfaces drift after a version bump
node skills/software-architect/scripts/audit-compatibility.mjs [project-root]

# Open a new incremental cycle on an already-implemented project (used by playbooks/00-project-calibration.md, not typically run by hand)
node skills/software-architect/scripts/new-cycle.mjs <project-root> --scope "<scope>" --author "<author>"

# Export a target project's docs/ as a single browsable HTML page or a Word-openable .rtf
node skills/software-architect/scripts/build-doc-site.mjs [project-root] [output-path]
node skills/software-architect/scripts/build-doc-word.mjs [project-root] [output-path]
```

There is no build step, lint config, or package.json — this is intentional (`scripts/README.md`: avoids a second runtime dependency beyond what `npx skills` already requires). "Running a single test" means running one `validate-*.mjs` or `validate-gate.mjs <phase>` against one example directory and reading its stdout; there is no test framework/test IDs to target individually.

Whenever you change a `rules/`, `playbooks/`, `templates/`, or `quality-gates/` file in a way that could make a previously-approved document now incomplete, bump `SKILL.md`'s `version:` frontmatter per `rules/skill-drift.md`'s Patch/Minor/Major policy before running `self-test.mjs` and committing.

## Architecture

### `SKILL.md` is the only always-loaded file

It contains no phase-specific logic. It decides which of three entry states applies to the user's project (new / in-progress / already-implemented-asking-for-something-new), points at the phase table, and enforces that a phase only advances once its `quality-gates/<phase>-gate.md` passes. *How* a phase actually runs lives entirely in that phase's own `playbooks/<phase>.md`, loaded on demand. When editing behavior, the fix almost always belongs in a `rules/*.md` (cross-cutting, referenced by multiple playbooks) or a specific playbook — rarely in `SKILL.md` itself.

### The phase table and per-phase file quartet

18 phases (00 Calibration → 17 Architecture Review); 03 Requirements, 08 Architecture, 11 Security, and 17 Review are always mandatory, every other phase can be skipped but only via an explicit, recorded decision in phase 00. Architecture (08) deliberately runs before API Design (09) — the architectural style shapes the API contracts, not the reverse.

Each phase with real per-item payload (Requirements, User Stories, Use Cases, Domain Model, Database Design, Architecture, API Design, Security, Risk Register, Testing, Backlog) has: a `playbooks/NN-name.md` (the interview flow), a `templates/name.md` (index-file + item-file shape), a `quality-gates/NN-name-gate.md` (Scriptable criteria vs. Judgment criteria — see below), and usually a `checklists/` counterpart. Phases with no real per-item payload or no reserved ID prefix (Vision, Business Analysis, Frontend Planning, Deployment, Roadmap, Implementation Plan) stay single-file — see `rules/document-locations.md` for the definitive table. Don't assume every phase follows the index+item split; check `document-locations.md` first.

### `project-state.md` — resumability

Lives in the *target* project's own `docs/`, never inside this Skill package. Holds `cycles[]` (an array, not a flat phase list — a project already marked `ready_for_implementation: true` gets a *new* cycle for its next feature, in incremental mode, reusing all existing IDs/documents as a confirmed baseline), a single flat `id_sequences` map (so IDs never reset across cycles), `confirmation_mode`/`documentation_depth`/`language` (set once in phase 00, never re-asked), and per-phase status plus `next_pending_question` for exact mid-phase resume. It's the one document in the whole Skill that stays YAML rather than prose — it's operational state, never meant for a stakeholder to read.

### The confirmation loop (`rules/confirmation-protocol.md`)

Every question in every phase: ask → interpret → rewrite the understanding back → show exactly how it'll be documented → confirm → document → next question. Strict mode runs this individually per question; Agile mode allows batched confirmation except for questions tagged `[confirmation individual]` in a playbook (architecture decisions, auth mechanisms, database type, anything costly to reverse), which always run the full individual loop regardless of mode.

### Document format (`rules/document-format.md`)

Every document the Skill writes into the target project (except `project-state.md`) is plain markdown meant to be read top-to-bottom or pasted into Word/Confluence with no cleanup — no YAML front-matter restating the "real" data. An artifact is a heading (`### REQ-001 — Post a recipe`) immediately followed by one italicized metadata line (`*Type: Functional · Priority: Must have · Traces to: BR-002*`) that scripts parse. **Metadata-line keys never translate; only values do.** Documents follow the target project's confirmed `language` (`project-state.md`), including headings — this is why every validator that needs to find a specific section matches by structural *shape* (a numeric-first-cell table row, a checkbox-vs-plain-bullet distinction, a fixed metadata-line key) rather than by literal English label text, which would silently break on a translated project.

`rules/document-format.md` also bans the Skill's own process leaking into generated prose: no internal phase-number references, no stray `[confirmation individual]` markers, no citations of internal `rules/`/`playbooks/`/`scripts/` paths, no echoing internal policy language ("always mandatory") as if it were the project's own business reasoning. `scripts/validate-tone.mjs` checks this mechanically; it and `project-state.md`/`docs/transcript.md` are exempt (the transcript is deliberately a log of the Skill's own conversation, unlike everything else).

### Traceability (`rules/traceability-rules.md`)

Every artifact gets a permanent ID with a `traces_to` field. The full specification is an artifact-by-artifact *graph*, not the intuitive straight requirement→story→use-case→...→task chain — e.g. a database table traces to a domain entity, not to "the database phase," and a test traces directly to a requirement. `scripts/validate-ids.mjs` and `scripts/validate-traceability.mjs` implement this, respecting phases marked `skipped` and documented exceptions (a purely non-functional requirement never gets a User Story). `REQUIRED_TRACES` in `validate-traceability.mjs` is the authoritative, generic implementation of the rule file's table — check it before assuming a trace requirement is or isn't enforced.

### Quality gates (`rules/quality-gate-structure.md`)

Each `quality-gates/<phase>-gate.md` splits into **Scriptable criteria** (claims to be mechanically checked — verify this is actually true in `validate-gate.mjs`'s `phaseSpecificChecks()` before trusting a gate file's own attribution comment; several were historically aspirational rather than implemented) and **Judgment criteria (AI/human)** (never delegated to a script, ever). `validate-gate.mjs` is a generic runner (loads a phase's gate + checklist, runs the shared ID/traceability checks) plus a `phaseSpecificChecks()` dispatch for checks that don't fit the generic model — one function per phase that has one, each returning `{ label, status }` with `status` either `skipped (...)`, `PASS — ...`, or a `FAIL — ...` listing specific gaps.

### Export pipeline (`build-doc-site.mjs` / `build-doc-word.mjs`)

Both read a target project's `docs/` tree read-only and share `scripts/lib/doc-tree.mjs`'s `PHASES` table, `EXPORTABLE_PHASES` (same minus Calibration, which is internal scaffolding and never belongs in a stakeholder-facing export), and `prefixChapterHeading()` (consistent chapter numbering baked into the assembled document's own headings, not just a sidebar). `build-doc-word.mjs` emits RTF (no ZIP/OOXML container to hand-build), with real Word heading styles/outline levels and clickable cross-reference hyperlinks resolved against known artifact IDs; a link it can't resolve renders as plain text rather than a broken jump. Mermaid fences render as labeled source blocks pointing at mermaid.live in the RTF path (RTF can't execute the vendored Mermaid.js the HTML path uses). Both read `project-state.md`'s `export_labels` (translated section labels like "Table of Contents"/"Change Requests", populated once during phase 00 for non-English projects) rather than hardcoding English chrome around the exported content.

### Delegation (`rules/delegation-policy.md`)

Subagents are used only for read-only research (an existing codebase, or a sibling project this Skill already planned) and phase 17's mechanical audit (`validate-ids.mjs`/`validate-traceability.mjs`, executed and reported by a subagent while the semantic conflict scan — do any two approved documents actually contradict each other? — stays with the main thread, since that needs the full history of confirmed decisions a subagent doesn't have). A subagent never runs the confirmation loop and never decides anything.

### Versioning and drift (`rules/skill-drift.md`, `rules/versioning.md`)

`SKILL.md`'s `version:` frontmatter follows Patch (wording/tooling fixes only) / Minor (new mandatory question, gate criterion, or template field that could make an approved doc incomplete) / Major (reserved, unused). A target project's `project-state.md` records the `skill_version` it was last touched with; on resume, a Patch-only gap is a brief mention, a Minor-or-above gap is an explicit blocking question (continue vs. run `audit-compatibility.mjs` first) — never a silent, automatic rewrite of an approved document.
