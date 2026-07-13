# examples/small-cli-tool/

A small, realistic worked example: a CSV/JSON/YAML file-conversion CLI, built entirely by walking through this Skill.

Demonstrates:

- **Agile confirmation mode** (`docs/transcript.md` has an excerpt) — batched confirmation except for `[confirmation individual]` questions.
- **Casual documentation depth** — the baseline field set is enough for a small, low-stakes utility with no external stakeholders.
- **Heavy phase-skipping** — Business Analysis, Domain Model, Database Design, and Frontend Planning are all skipped, with reasons recorded in `docs/00-calibration/calibration.md`, since this is a stateless, UI-less tool.
- **A second, incremental cycle** — cycle 1 ships CSV/JSON conversion; cycle 2 (`docs/project-state.md`'s `cycles[1]`) adds YAML support without re-asking project-wide settings or resetting any ID sequence.

Start at `docs/project-state.md` to see the project's current state, or `docs/01-discovery/vision.md` to read the documentation set from the top.
