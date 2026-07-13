# Use Cases — Template

Saved at `docs/05-use-cases/` in the target project (see `rules/document-locations.md`). Produced by `playbooks/05-use-cases.md`. Details the interaction flows — main, alternative, exception — behind each User Story or closely related group of stories, ready to inform the Domain Model (phase 06).

This category splits into an **index file** (`use-cases.md`) and one **item file** per use case (`uc-001.md`, `uc-002.md`, ...) — see `rules/document-locations.md`.

## Index file — `use-cases.md`

```markdown
# Use Cases

| ID | Title | Traces to |
|---|---|---|
| [UC-001](uc-001.md) | Post a recipe | US-006 |
```

## Item file — `uc-001.md`

```markdown
# UC-001 — <short title>
*Traces to: US-006*

**Primary actor**: ...
**Secondary actors**: ...

**Preconditions**
- <what must be true before this use case can start>

**Main flow**
1. ...
2. ...

**Alternative/exception flows**
- At step 2, if <condition>: <what happens instead>

**Postconditions**
- <what must be true after successful completion — REQUIRED, at least one>

```mermaid
sequenceDiagram
    ...
```
<Use `sequenceDiagram` for the main flow when it involves multiple actors/
systems; add a `stateDiagram` instead/in addition when the use case
concerns an entity with meaningful states (e.g. order: created → paid →
shipped) — per `rules/diagram-conventions.md`.>
```

## Fully Dressed additions

```markdown
# UC-001 — <short title>
*Traces to: US-006*

**Goal in context**
<The actor's goal in one sentence, in business terms — not "click submit"
but "get a refund issued for a defective item." This is what Cockburn
calls the use case's real purpose; everything else describes how it's
achieved.>

**Scope**
<System under design, or a specific subsystem/component if this project
is large enough that "scope" isn't automatically the whole system.>

**Stakeholders and interests**
| Stakeholder | Interest |
|---|---|
| Customer | Gets a fair, fast refund |
| Finance | Refund matches policy, is auditable |

**Primary actor**: ...
**Secondary actors**: ...

**Trigger**
<The specific event that starts this use case — "customer clicks
'Request refund' on an eligible order," not just "customer wants a
refund.">

**Preconditions**
- ...

**Minimal guarantees**
<What's guaranteed regardless of how the use case ends, success or
failure — e.g. "no double refund is ever issued, even on retry.">

**Success guarantees**
<What's guaranteed specifically on successful completion — same content
as "Postconditions" in Casual mode, named per Cockburn's convention.>

**Main flow**
1. ...

**Alternative/exception flows**
- At step 2, if <condition>: <what happens instead>

**Special requirements**
<NFRs that apply specifically to this use case, beyond the project's
general ones — e.g. "this flow must remain available during scheduled
maintenance windows." "None beyond the project's general NFRs" is valid.>

**Technology and data variations**
<Where this use case's steps vary by channel, device, or data source, if
at all — e.g. "step 3 differs on mobile: biometric confirmation instead
of a typed PIN." "(none)" if the flow is uniform.>

**Frequency of occurrence**
<Roughly how often this happens — "several thousand times a day,"
"a handful of times a year." Informs Architecture and Database Design's
capacity decisions later.>

**Open issues**
<Anything unresolved that doesn't block moving forward but should be
tracked — or "(none).">

```mermaid
sequenceDiagram
    ...
```
```

## What a use case must never be

Just the main "happy path" and nothing else. Every use case needs: at least one postcondition/success guarantee (what success looks like), and — for every step in the main flow that carries a real risk of failure (payment, external calls, validation, anything touching sensitive data) — a corresponding alternative/exception flow. A use case that's just a numbered list of steps with no postcondition or exception handling is incomplete, not minimal.

## Notes for whoever fills this in

- Alternative/exception flows that touch payment or sensitive data handling are always individually confirmed (`[confirmation individual]`), regardless of the project's confirmation mode.
- `UC-XXX` IDs come from `project-state.md`'s `id_sequences.UC`, global to the project.
- One `UC-XXX` may consolidate more than one closely related `US-XXX` when they describe the same interaction from different angles — list every story it traces to.
