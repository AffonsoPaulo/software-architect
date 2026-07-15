# Requirements Engineering Gate

The five criteria below are fixed, not derived generically from `rules/quality-gate-structure.md`'s format the way every other gate's judgment criteria are — Requirements is the one phase where these specific five checks (Complete, Acceptance criteria, Business rules, Edge cases, Ambiguities) are canonical and never reworded per requirement.

## Scriptable criteria
- [ ] Every `REQ-XXX` ID is unique and correctly formatted per `rules/id-conventions.md` — checked by `scripts/validate-ids.mjs`
- [ ] Every `REQ-XXX`'s `traces_to` entry, if set, points to a `BR-XXX` that actually exists — checked by `scripts/validate-traceability.mjs`
- [ ] Every functional `REQ-XXX` has at least one entry in `acceptance_criteria` and at least one entry in `edge_cases` (non-empty lists) — checked by `scripts/validate-gate.mjs`

## Judgment criteria (AI/human) — the five fixed checks, per requirement
- [ ] **Complete**: the requirement is a full, self-contained capability statement, not a fragment
- [ ] **Acceptance criteria**: each listed criterion is genuinely testable (pass/fail determinable), not aspirational
- [ ] **Business rules**: linked to a `BR-XXX` where one applies, or explicitly confirmed as "no applicable rule" — never silently blank
- [ ] **Edge cases**: at least one real scenario where normal behavior doesn't straightforwardly apply, not a token placeholder
- [ ] **Ambiguities**: no reasonable second interpretation of the requirement's wording exists

## Pass rule
The gate is evaluated **per requirement**, not once for the whole document. If any of the five checks fails for a given `REQ-XXX`, the gate fails for that requirement specifically — the Skill reopens that requirement's question, not the whole phase's interview. The phase as a whole only passes once every requirement in `docs/03-requirements/` passes all five. See `rules/quality-gate-structure.md` for the escape valve on a stuck criterion — note that Requirements is not itself an always-strict category, but a business-rule link or non-functional requirement tied to a security/architecture concern may still be, depending on content.
