# Discovery Gate

## Scriptable criteria
- [ ] `docs/01-discovery/vision.md` exists — checked by `scripts/validate-gate.mjs`
- [ ] Every section of `templates/vision.md`'s structure is present (Problem, Target audience, Current state, Business objective, Success criteria, Constraints, Out of scope) — checked by `scripts/validate-gate.mjs`

## Judgment criteria (AI/human)
- [ ] The problem is stated without ambiguity, and is genuinely a problem, not a disguised solution
- [ ] The target audience/stakeholders are identified specifically, not generically
- [ ] At least one success criterion is genuinely measurable, not aspirational
- [ ] "Out of scope" was explicitly addressed with the user, not left empty by omission
- [ ] No functional-requirement-level content (specific features, flows, screens) leaked into the Vision document, including inside "User journey" (Fully Dressed)
- [ ] "Guiding principles" (Fully Dressed), if present, are concrete enough to actually inform a future decision, not generic platitudes
- [ ] Every section was explicitly confirmed by the user, per `rules/confirmation-protocol.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific question that produced it, not the whole phase. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria.
