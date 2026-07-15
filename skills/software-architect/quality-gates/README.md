# quality-gates/

One gate file per phase (`00-calibration-gate.md` … `17-review-gate.md`, 18 total). Each gate defines the pass/fail criteria a phase must satisfy before the Skill allows moving to the next phase — some criteria are scriptable (delegated to `scripts/`), some require AI/human judgment.

Format standardized in `rules/quality-gate-structure.md`.
