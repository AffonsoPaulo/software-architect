# Documentation Depth

## Why this exists

Every template in `templates/` defines a baseline set of fields — enough to run a small, fast-moving project well. Some projects need more: a "fully dressed" requirement (Cockburn's term, borrowed deliberately) with rationale and verification method spelled out, a use case with preconditions/postconditions/guarantees/frequency, a security document with a full STRIDE pass per component. Forcing every project through the heavier set is exactly the kind of over-specification this Skill is meant to avoid for a two-week side project; never offering it is under-specification for a team that needs documentation an auditor or a new hire can actually rely on. So it's a choice, made once, the same way `confirmation_mode` is.

## The two levels

- **Casual**: the baseline field set defined in each template's `## Structure` section. Enough for a small or fast-moving project — every field still traces, still has acceptance criteria, still passes the Quality Gates. Nothing about Casual is sloppy; it's simply the leaner professional set.
- **Fully Dressed**: Casual, plus every field listed in that template's `## Fully Dressed additions` section. These add the depth of industry-standard documentation — Cockburn-style fully-dressed use cases, IEEE-830-style requirements attributes, arc42/C4-style architecture views, a full STRIDE security pass — for projects where that rigor is worth the extra interview time.

Depth is a **format-independent** choice: both levels use the exact same convention (`rules/document-format.md`) and the exact same Quality Gate structural checks (IDs, traceability). Fully Dressed only adds fields and sections; it never changes how an ID or a `Traces to` line is written.

## Where it's chosen

Once, project-wide, during `playbooks/00-project-calibration.md` — asked and confirmed the same way `confirmation_mode` is, right after that question. Stored in `project-state.md`'s `documentation_depth` field. Applies to the whole project, not per-cycle: every phase in every cycle uses the same depth, so two documents produced months apart never disagree on how much rigor they carry.

- The AI explains the difference (in the terms above, at whatever length fits the confirmation mode already chosen) before asking.
- The user's answer goes through the normal confirmation loop (`rules/confirmation-protocol.md`) like any other Calibration answer.
- **Can change at any point**, via explicit user request only — never switched by the AI on its own initiative. Logged in `project-state.md`'s `documentation_depth_history` with a timestamp, mirroring `confirmation_mode_history`.
- A depth change is **not retroactive**: documents already approved keep the fields they were written with. Only phases reached *after* the change use the new depth. If the user wants an already-approved document upgraded to Fully Dressed, that's a Change Request (`rules/change-management.md`), not an automatic rewrite.

## How a playbook uses this

Each playbook's "Mandatory questions" section marks any question that only applies at Fully Dressed with `[fully dressed only]`. At Casual depth, the AI skips those questions entirely — it does not ask them and then discard the answer, and it does not ask a thinner version "just in case." At Fully Dressed, they're mandatory like any other question in that section, subject to the same confirmation rules (including `[confirmation individual]` where both tags appear together).

## Quality Gates

A Quality Gate never requires a Fully-Dressed-only field when the project is running Casual — `scripts/validate-gate.mjs`'s structural checks (IDs, traceability) are identical at both levels, since traceability is about the graph, not about depth. The extra rigor Fully Dressed buys is caught by judgment criteria and the phase's own "How to validate answers" section, not by a script.

## Incremental cycles

An incremental cycle (`playbooks/00-project-calibration.md`, incremental mode) inherits the project's existing `documentation_depth` — it is not re-asked, same as `confirmation_mode`. If the user wants a different depth for the new cycle specifically, that's an explicit request, confirmed and logged like any other mid-project depth change.
