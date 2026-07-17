# Quality Gate Structure

Format every file in `quality-gates/` must follow. A Quality Gate is the formal checkpoint a phase must pass before the Skill allows moving to the next phase — distinct from a `checklists/` file, which is for continuous self-assessment during the phase (see `checklist-structure.md`).

## Required structure of a gate file

```markdown
# <Phase Name> Gate

## Scriptable criteria
- [ ] <criterion> — validated by `scripts/<script>.mjs`
...

## Judgment criteria (AI/human)
- [ ] <criterion — requires semantic judgment, not mechanically checkable>
...

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific question that produced it (not the whole phase).
```

## Scriptable vs. judgment criteria

- **Scriptable**: anything `scripts/validate-ids.mjs`, `scripts/validate-traceability.mjs`, or `scripts/validate-gate.mjs` can check mechanically — ID format, uniqueness, orphan/broken references in the traceability graph.
- **Judgment**: anything requiring understanding of meaning — "does this business rule make sense," "is this requirement actually testable," semantic conflicts between documents. No script can validate these; the AI (and ultimately the user, via confirmation) must.

A gate file must clearly separate the two lists — never mix them into one, since scriptable failures can be re-checked automatically after a fix, while judgment failures need a fresh confirmation round.

## "Scriptable" means actually run, in full

A criterion marked scriptable is checked by actually executing the named script (`node scripts/validate-ids.mjs`, `scripts/validate-traceability.mjs`, `scripts/validate-gate.mjs <phase>`, or `scripts/audit-compatibility.mjs`) and reading its real output — never by mentally approximating what it would probably say. This matters most for `validate-gate.mjs` and `validate-versioning.mjs`, which each report several independent categories of violation (IDs, traceability, and — easy to forget because it's not the first thing either script prints — Author presence and `docs_version`/changelog consistency): reading only part of a script's output and treating the gate as scriptable-clean is the same failure as not running it at all. If a script was actually run, say so and show what it reported; if its output wasn't fully checked, the gate has not actually passed that criterion yet, regardless of how confident the assessment feels.

## On failure

The Skill never advances past a failed gate. It reports precisely which criteria failed and, for each, which question/document needs to be revisited. This reopens the specific question — not a full restart of the phase's interview.

## The escape valve (stuck criteria)

If a specific criterion doesn't converge after reasonable attempts — the user and the AI can't reach a satisfactory answer — the user may explicitly **override that one criterion** (never the whole gate):

1. The override is never silent. It is logged as an accepted risk in `templates/risk-register.md`, with the exact text of what was left unresolved.
2. The override is scoped to the single criterion, not the phase — every other criterion still must pass normally.
3. **This escape valve is never available for always-strict categories** (architecture, security, sensitive data — see `confirmation-protocol.md`). Those criteria block the phase until genuinely resolved, with no override path.

This mirrors — but is distinct from — the "I don't know" handling in `confirmation-protocol.md`: that's for a question during the interview; this is for a gate criterion that remains unsatisfied after the interview.
