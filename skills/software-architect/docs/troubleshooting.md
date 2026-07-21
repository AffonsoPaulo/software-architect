# Troubleshooting

## A gate is failing without a clear explanation

Every gate follows `rules/quality-gate-structure.md`'s format: scriptable criteria first, judgment criteria second, and the pass rule requires listing exactly what failed, not just "gate failed." If you're seeing a bare failure with no detail:

1. Run `node scripts/validate-gate.mjs <phase> <project-root>` directly against the project (e.g. `node scripts/validate-gate.mjs 09 /path/to/project`). It prints every scriptable criterion's status plus the raw violations from `validate-ids.mjs`/`validate-traceability.mjs`, and lists every judgment criterion as pending manual review — nothing is hidden.
2. Check the specific `quality-gates/<phase>-gate.md` file for that phase — the criteria list there is the literal checklist being evaluated.
3. If a scriptable criterion fails, the violation message names the specific artifact and document — that's where to look, not the phase in general.

## `project-state.md` looks corrupted or inconsistent

Common causes and what to check:

- **Malformed YAML**: `project-state.md` is the one document under `docs/` that's still YAML (every other document is plain markdown — see `rules/document-format.md`). Its parser (`scripts/lib/yaml-lite.mjs`) is a deliberately minimal subset parser, not a general YAML implementation — see its file header for exactly what it supports. If `docs/project-state.md` uses YAML features outside that subset (multi-line block scalars, anchors), it will parse incorrectly or silently produce unexpected structure. Keep edits to the same shape `templates/project-state.md` uses.
- **Two cycles with the same `id`, or `active_cycle_id` pointing at a nonexistent cycle**: this shouldn't happen if the Skill wrote the file itself, but if it was hand-edited, check `cycles[].id` values are unique and `active_cycle_id` matches one of them.
- **`id_sequences` lower than the highest ID actually used in a document**: this is the specific inconsistency that causes duplicate-ID violations later. Cross-check `id_sequences.<PREFIX>` against the highest number actually seen for that prefix across `docs/`.

## A validation script is reporting a false positive

Before assuming it's wrong, check these first, since they're the most common causes:

- **A phase was skipped but `project-state.md` doesn't reflect it**: `validate-traceability.mjs` reads the skip list from `project-state.md`'s `cycles[].phases[].status` — if a phase was actually skipped but its status wasn't recorded as `"skipped"`, orphans that phase would have produced get reported as real violations. Fix the status in `project-state.md`, not the script.
- **A metadata line key doesn't match the convention**: the scripts extract artifacts and `Traces to` generically by scanning for a heading immediately followed by an italic `*Key: value · Key: value*` line (`rules/document-format.md`) — they only work if a document actually uses the standard key names (`Traces to`, not a differently-worded label) and puts the metadata line directly under the heading with no blank prose in between. This bit the Skill's own construction once, back when the format used YAML front-matter (`templates/requirements.md` briefly used a differently-named field and was invisible to the extractor as a result) — the modern equivalent is a metadata line worded or placed inconsistently with the template it's based on. If a document was hand-written or generated inconsistently with its template, this is the first thing to check.
- **A genuinely non-artifact heading looks like a violation**: only headings whose first token matches an uppercase prefix (e.g. `REQ-001`) are treated as artifacts; a milestone's or environment's plain-name heading (e.g. `### Milestone 1 — MVP`) is correctly excluded from ID checks even though it can still carry a `Traces to`/`Delivers` metadata line and count as a reference (see `scripts/lib/docs.mjs`'s `HEADING_ID_RE`/`prefixOf`). If something that should be excluded is being picked up, check its heading doesn't accidentally start with an uppercase-prefix-shaped token.

If none of these explain it, it's a real script bug — check the relevant script's logic against `rules/traceability-rules.md`'s table directly, since that table is the specification the script is supposed to implement, not the other way around.

## How do I force reopening a specific phase?

There are two legitimate paths, and no illegitimate shortcut:

1. **The phase's own gate hasn't passed yet**: nothing to force — the Skill won't have advanced past it. Just continue answering its questions.
2. **The phase was already approved, but something in it needs to change**: this always goes through a Change Request (`rules/change-management.md`), never a direct edit. Open a CR against the specific artifact that needs to change; the CR computes every downstream document affected (via `rules/traceability-rules.md`) and reopens each one for a scoped re-approval. This is true even during phase 17's Review — a gap found there routes through a CR from the artifact where it originated, not a patch applied in place (see `playbooks/17-review.md`'s "Special cases").

Editing an approved document's file directly, outside of a CR, will desynchronize it from `project-state.md`'s `docs_version`/`changelog[]` (`rules/versioning.md`) and from anything downstream that traces to it — don't do this even if it seems faster.
