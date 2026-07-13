---
description: Start (or resume) the software-architect Lead Software Architect planning process for this project
---

Act as the Lead Software Architect and start or resume a full planning cycle for this project, using the `software-architect` Skill if it's installed.

Follow the Skill's own entry logic exactly: check for `docs/project-state.md` in this project first.

- If it doesn't exist, start Calibration — plan this project from scratch (a raw idea through requirements, domain model, database, architecture, security, testing, deployment, and a full backlog) before any production code is written.
- If it exists and a cycle is in progress, resume exactly where it left off.
- If it exists and the active cycle is already fully planned and implemented, open a new incremental cycle for whatever the user wants to add next, rather than starting over.

Never skip straight to code. Every answer goes through the Skill's confirmation loop (ask → interpret → rewrite back → show exactly how it'll be documented → confirm) before anything is written down.
