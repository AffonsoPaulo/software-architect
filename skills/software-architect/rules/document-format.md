# Document Format

## Why this exists

Every document this Skill writes into the target project's `docs/` (except `project-state.md` — see below) is written **for a human to read first**, and only usably parseable by tooling second. The acceptance bar: at any point, the user can open the `.md` file, copy the whole thing, paste it into Word (or Google Docs, or Confluence), and hand it to someone else — a stakeholder, a new hire, an auditor — without needing to clean it up first. A YAML block at the top of the file, or any field that only makes sense to a machine, fails that bar. Markdown tables, headings, prose, and ```mermaid``` diagrams (rendered natively by GitHub/GitLab/most modern doc tools, and falling back to a readable code block elsewhere) all pass it.

This means: **no YAML front-matter in any phase document.** The markdown body is not a summary of "the real data" sitting in a front-matter block above it — the markdown body *is* the document. `project-state.md` is the one exception: it is the Skill's own operational state, never meant to be read by a stakeholder, and stays pure YAML (see `templates/project-state.md`).

## Never let the Skill's own process show through

The "written for a human to read first" bar above applies just as much to *how the Skill talks about itself* as to formatting. A stakeholder reading a generated document has no reason to know — and should never be able to tell — that a Skill-driven interview produced it. Four concrete patterns to avoid, each one found in real generated output, not hypothetical:

- **Never reference "Phase NN."** The numbered phase table is this Skill's own internal organization (`SKILL.md`), meaningless to a reader. Say what the content actually is instead — "defined in Architecture" or "see the Deployment document" — not "defined in Phase 08" / "definido na Fase 08."
- **Never leave a `[confirmation individual]` (or its translated form) marker in written text.** That bracketed tag exists only to track, during the interview itself, whether an answer went through the individual or batched confirmation loop (`rules/confirmation-protocol.md`) — it is bookkeeping for the AI mid-conversation, never something a finished document should carry. If a real generated document has one, it leaked.
- **Never cite `rules/`, `playbooks/`, `templates/`, or `scripts/` paths in a document written into the user's project.** Those are this Skill's own internal file structure — a reader has no access to them and no reason to care. If a rule's substance is genuinely worth restating for the reader, restate it in plain language; don't point at the file that defines it.
- **Never echo the Skill's own policy language as if it were this project's own reasoning.** Calibration's phase-inclusion table (`playbooks/00-project-calibration.md`) is the clearest recurring case: "Always mandatory" / "Sempre obrigatória" restates the *Skill's* rule about that phase, not a reason specific to this project. Write the actual, project-specific reason a human would give — even a genuinely always-mandatory phase has a real one ("Security review is required for any product handling user accounts," not "always mandatory").

`scripts/validate-tone.mjs` checks for these four patterns mechanically (`rules/quality-gate-structure.md`) — the check exists because the pattern is easy to fall into unnoticed while writing in the moment, not as a substitute for writing this way from the start.

## The convention

Every artifact this Skill assigns an ID to (`rules/id-conventions.md`) is declared by a **heading**, immediately followed by one **italicized metadata line**. Both are ordinary, readable markdown — the metadata line reads like a subtitle or caption, not a code block.

```markdown
### REQ-001 — Post a recipe
*Type: Functional · Priority: Must have · Traces to: BR-002 · Author: Alice*

Members can post a recipe with a title, an ingredient list, and
step-by-step instructions.
```

- **Heading**: starts with the artifact's ID, then an em dash (`—`), then a short title. Heading level (`#`, `##`, `###`...) follows whatever nesting makes sense for that document — the ID-first rule is what matters, not the level.
- **Metadata line**: the first non-blank line right after the heading, wrapped in a single pair of `*asterisks*`, with `Key: value` pairs separated by ` · `. This is what a script parses — a heading followed immediately by an italic `Key: value · Key: value` line is treated as one artifact's metadata, nothing more exotic.
- Everything after the metadata line — prose, bullet lists, tables, sub-headings for "Acceptance criteria" / "Edge cases" / etc. — is free-form, human-authored content. Scripts never need to parse it.

### Standard keys

Any key may appear in a metadata line; these are the ones the validation scripts (`scripts/lib/docs.mjs`) actually read, so every template uses this exact wording — in every project regardless of its confirmed language (`rules/language-policy.md`'s exemption list). Unlike the heading above it, or any other key, these specific key names never translate; only the value after the colon does.

| Key | Meaning | Parsed as |
|---|---|---|
| `Traces to` | The traceability graph edge (`rules/traceability-rules.md`) | comma-separated list of IDs |
| `Delivers` | Roadmap milestone → US/UC it ships | comma-separated list of IDs |
| `Depends on` | Implementation Plan / Roadmap dependency | comma-separated list of IDs |

Any other key (`Type`, `Priority`, `Status`, `Kind`, `Source`, `Probability`, `Impact`, `Owner`, `ADR`, `Date`, `Target date`, and so on — each template defines which ones it uses) is captured too, but read as a plain scalar string, used only by that template's own phase-specific checks (if any) — not by the generic traceability engine.

**`Author` is the one key every ID'd artifact's metadata line carries, regardless of category or template** — not asked per-artifact, not shown in every individual template's own worked example (it would mean repeating the same statement in a dozen files); populated automatically from `project-state.md`'s active `cycles[].author` at the moment the artifact is created (`rules/versioning.md`). `scripts/validate-versioning.mjs` checks it's never blank.

An empty relationship is written explicitly, never omitted: `Traces to: (none)` for a requirement with no business rule behind it, not a missing key. A missing `Traces to` key means "not yet declared," which validators treat as zero targets — the same as `(none)` — but writing it explicitly is still preferred so a reader never wonders whether it was forgotten. Accepted "empty" tokens: `(none)`, `none`, `—`, `-`, `n/a` (case-insensitive) — all parse to an empty list.

### Items without a formal ID

Some artifacts intentionally have no reserved ID prefix (`rules/id-conventions.md`) — Frontend Planning's screens, Roadmap's milestones. These still use a heading + metadata line, just without an ID token in the heading:

```markdown
### Recipe List / Home
*Traces to: UC-001, UC-002*

The entry point, listing every recipe with its average rating.
```

A heading followed by a metadata line with a `Traces to` (or `Delivers`) key is registered as a **reference** even with no ID of its own — this is what lets a screen or milestone participate in coverage checks (e.g. "every Use Case has something covering it") the same way a formally-ID'd artifact does.

### An artifact is declared once, referenced elsewhere without a heading

An ID is declared as a heading in exactly one document — its "home" (`rules/id-conventions.md`). A different document that needs to sequence or group already-declared IDs (Implementation Plan sequencing Backlog's `TASK-XXX` items, for instance) never repeats them as a heading — that would register as a second declaration of the same ID and fail `scripts/validate-ids.mjs`'s uniqueness check. It references them in a plain markdown table or list instead. `scripts/validate-gate.mjs` has a couple of small, phase-specific parsers for exactly this (Implementation Plan's `## Sequence` table, Roadmap's `## Deferred` list) — documented in `templates/implementation-plan.md` and `templates/roadmap.md` respectively, not part of the generic heading+metadata-line convention above.

### Index files and item files

Some categories split into an index file plus one file per item instead of one file holding everything — `rules/document-locations.md` has the definitive list of which categories split and the filename convention. Two format specifics for a split category:

- **An item file's heading is `#` (H1)**, not nested under a category grouping — the file *is* the artifact now, not a subsection of a bigger document. `# REQ-001 — Post a recipe` at the top of `req-001.md`, metadata line immediately after, exactly as in any other artifact declaration.
- **The index file's summary table links to each item file** with a relative markdown link (`[REQ-001](req-001.md)`), plus enough inline context (title, and whatever dimension the category is naturally organized by — type, priority, milestone) to browse the whole category without opening every file. The index file carries no `Traces to` metadata line of its own — it's not an artifact, just a table of contents plus whatever category-wide narrative genuinely spans every item (an intro paragraph, a diagram, a coverage table).

### Tables for structured, non-traceability data

Data that's inherently tabular and never participates in the traceability graph — database columns, a coverage matrix — is a plain markdown table, not a metadata line. Nothing parses these; they exist purely for the reader.

```markdown
## TBL-001 — recipes
*Traces to: ENT-001*

| Column | Type | Constraints |
|---|---|---|
| id | integer | primary key |
| title | text | not null |
```

Two shapes of table are used across templates, and the choice between them (and between a table and a `**Bold label**` block) follows the content, not a fixed rule per category:

- **A `| Field | Value |` shell table**, when an artifact has several single-value facts worth consolidating into one spec-sheet block (`templates/requirements.md`'s Rationale/Source/Risk if not met/Verification method/Dependencies; `templates/use-cases.md`'s Goal in context/Scope/actors/Trigger/etc.; `templates/api.md`'s Trigger/Input/Effect-output/etc.) — the standard Volere-shell/IEEE-830 convention for a requirement or use-case record. A field with genuinely list-shaped content (`Acceptance criteria`, `Main flow`) never goes in this table, even if it would technically fit in a cell — it stays its own `**Label**` + list.
- **A named-column table**, when a list's entries already share a consistent multi-part structure across every instance — `templates/api.md`'s `Failure modes` (`| Condition | Response |`), `templates/use-cases.md`'s `Alternative/exception flows` (`| Step | Condition | Result |`), `templates/domain-model.md`'s `Attributes` (`| Attribute | Meaning |`). If the entries don't actually share a clean split (checked against real content, not assumed), it stays a bullet list — `templates/requirements.md`'s `Edge cases` is a bullet list for exactly this reason.

Either way, a table row for an inapplicable field is written as `(none)` / `n/a`, the same convention as an empty metadata-line key (above) — never omitted. An omitted row reads as a malformed table; an explicit `(none)` reads as confirmed-and-empty.

A table's own column headers (`Field`/`Value`, `Step`/`Condition`/`Result`, and so on) translate along with the rest of the document, the same as a section heading — see `rules/language-policy.md`. Only the fixed enum values a cell might contain (a `Status` column's `Open`/`Closed`) stay untranslated, not the header naming that column.

## A document still carrying a YAML front-matter block is out of date

A YAML front-matter block (`---`/`---` delimiters) at the top of a phase document, with the markdown body underneath restating the same data in prose, belongs only in `project-state.md`. A phase document that still carries one needs to be rewritten into this heading-plus-metadata-line convention to work with current validation scripts — there is no automatic migration; treat it like any other Skill-version drift (`SKILL.md`'s `skill_version` check).

`project-state.md` itself never needs the `---`/`---` delimiters — it's pure YAML end to end (see below), and `scripts/lib/docs.mjs`'s parser reads it the same way with or without them. A real project's `project-state.md` written without delimiters (the form `templates/project-state.md` actually shows) and one still carrying them are both fully valid; nothing needs migrating on this specific point.

## `project-state.md` is exempt

`project-state.md` is never read by a stakeholder as documentation — it is the Skill's own working state, read and written on every turn. It keeps its YAML structure (`templates/project-state.md`) so it stays unambiguous and easy for the Skill itself to edit precisely. This file is the only one under `docs/` that works this way.
