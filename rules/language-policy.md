# Language Policy

Two independent decisions — never conflate them.

## 1. The Skill's own content: always English

Every file inside `software-architect/` — `SKILL.md`, every `playbooks/`, `rules/`, `templates/`, `checklists/`, `quality-gates/`, `scripts/`, and `docs/` file — is written in English, fixed, regardless of who uses the Skill or what language they converse in. This keeps the Skill compatible with the broader `npx skills` ecosystem and usable/contributable-to by anyone, not only the original author.

## 2. Documents the Skill generates: the target project's language

Documents the Skill writes into the *user's* project (Vision, Requirements, Architecture, and so on — see `document-locations.md`) follow whatever language the user is conversing in during the interview. This is:

- **Detected**, not assumed, during `playbooks/00-project-calibration.md` — the AI notices the language the user is writing in and proposes it, but confirms explicitly before locking it in (`[confirmation individual]`).
- **Stored once**, in `project-state.md`'s `language` field, and reused for every subsequent phase — never re-asked per phase, never silently re-inferred.
- **Project-wide**, not per-cycle — a language set in cycle 1 applies to cycle 2 unless explicitly changed (see below).

## Changing language mid-project

If the user switches language mid-project, this is treated as a normal correction via `confirmation-protocol.md` — not a formal Change Request (`change-management.md`). It does not retroactively translate or affect the content of already-approved documents; it only applies to documents written from that point forward.

## Why these two decisions are independent

A team could run the Skill entirely in Portuguese for their project's documents while the Skill's own instructional files stay in English — the two never need to match, and nothing in the Skill's logic assumes they do.
