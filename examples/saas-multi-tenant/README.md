# examples/saas-multi-tenant/

A larger worked example: TaskFlow, a multi-tenant SaaS for project/task management, built by running all 18 phases of this Skill.

Demonstrates:

- **Strict confirmation mode** (`docs/transcript.md` has an excerpt) — every question confirmed individually, one at a time, contrasted with `small-cli-tool/docs/transcript.md`'s Agile-mode excerpt.
- **Fully Dressed documentation depth** — every template's deeper field set (rationale/source/verification on requirements, a full STRIDE pass in Security, context/runtime views in Architecture, and so on), appropriate for a product with external stakeholders and multi-tenant/PII data.
- **No skipped phases** — the project's size and stakeholder count mean all 18 phases genuinely apply, unlike `small-cli-tool`'s heavy skip list.
- **A real accepted risk** (`docs/11-security/risk-register.md`'s RISK-001) — an "I don't know" answer that became an explicitly accepted, owned, tracked risk rather than a silent gap.

Start at `docs/project-state.md` to see the project's current state, or `docs/01-discovery/vision.md` to read the documentation set from the top.
