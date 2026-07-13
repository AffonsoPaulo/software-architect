---
description: Generate a browsable HTML view of this project's docs/ (software-architect skill) and open it
argument-hint: "[project-root] [output-path]"
---

Generate and open a single, self-contained, browsable HTML page for this project's `docs/`, using the `software-architect` Skill's doc-site generator.

1. Locate `build-doc-site.mjs`: check `.claude/skills/software-architect/scripts/build-doc-site.mjs` (project-local install) and `~/.claude/skills/software-architect/scripts/build-doc-site.mjs` (global install) first. If neither exists, search for it (e.g. `find . ~/.claude -name build-doc-site.mjs 2>/dev/null`). If it still can't be found, tell the user the Skill doesn't appear to be installed and stop.
2. Run `node <path-to-build-doc-site.mjs> $ARGUMENTS` — with no arguments this defaults to the current directory as the project root and writes `docs/project-overview.html`.
3. Open the generated file in the default browser for the current OS (`open` on macOS, `xdg-open` on Linux, `start` on Windows).
4. Report the path of the file you generated.
