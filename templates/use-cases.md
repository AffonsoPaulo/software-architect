# Use Cases — Template

Saved at `docs/05-use-cases/use-cases.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/05-use-cases.md`. Details the interaction flows — main, alternative, exception — behind each User Story or closely related group of stories, ready to inform the Domain Model (phase 06).

## Structure

```yaml
---
use_cases:
  - id: UC-001
    traces_to: ["US-006"]
    # REQUIRED — at least one US-XXX. Never blank.
    primary_actor: "<who initiates this use case>"
    secondary_actors: []
    # other systems/actors involved, if any
    preconditions:
      - "<what must be true before this use case can start>"
    postconditions:
      - "<what must be true after successful completion — REQUIRED, at least one>"
    main_flow:
      - "<step 1>"
      - "<step 2>"
    alternative_flows:
      - trigger: "<at which step, and what condition>"
        steps:
          - "<what happens instead>"
    # REQUIRED for any step in main_flow that carries real risk of failure —
    # not just a nice-to-have. See "What this document must never contain
    # only" below.
---
```

```markdown
# Use Cases

## UC-001 — <short title>
**Traces to**: US-006
**Primary actor**: ...
**Secondary actors**: ...

**Preconditions**:
- ...

**Main flow**:
1. ...
2. ...

**Alternative/exception flows**:
- At step 2, if <condition>: <what happens instead>

**Postconditions**:
- ...

```mermaid
sequenceDiagram
    ...
```
<Use `sequenceDiagram` for the main flow when it involves multiple actors/
systems; add a `stateDiagram` instead/in addition when the use case
concerns an entity with meaningful states (e.g. order: created → paid →
shipped) — per `rules/diagram-conventions.md`.>
```

## What a use case must never be

Just the main "happy path" and nothing else. Every use case needs: at least one postcondition (what success looks like), and — for every step in the main flow that carries a real risk of failure (payment, external calls, validation, anything touching sensitive data) — a corresponding alternative/exception flow. A use case that's just a numbered list of steps with no postcondition or exception handling is incomplete, not minimal.

## Notes for whoever fills this in

- Alternative/exception flows that touch payment or sensitive data handling are always individually confirmed (`[confirmation individual]`), regardless of the project's confirmation mode.
- `UC-XXX` IDs come from `project-state.md`'s `id_sequences.UC`, global to the project.
- One `UC-XXX` may consolidate more than one closely related `US-XXX` when they describe the same interaction from different angles — list every story it traces to.
