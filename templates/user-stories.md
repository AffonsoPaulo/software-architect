# User Stories — Template

Saved at `docs/04-user-stories/user-stories.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/04-user-stories.md`. Converts approved functional requirements into User Stories, ready to become Use Cases in phase 05.

## Structure

```yaml
---
user_stories:
  - id: US-001
    traces_to: ["REQ-004"]
    # REQUIRED — every US-XXX must trace to at least one REQ-XXX. No exceptions
    # here (unlike REQ->BR, this link is never optional; see rules/traceability-rules.md).
    persona: "<who — a specific actor, not 'the user' generically if more than one actor exists>"
    action: "<what they want to do>"
    benefit: "<why — the value they get from it>"
    acceptance_criteria:
      - "<inherited from the REQ's acceptance criteria, made more granular if useful — never less specific>"
    invest_notes: "<brief note on how this story satisfies Independent, Negotiable,
      Valuable, Estimable, Small, Testable — only needs detail where it's not obvious>"
---
```

```markdown
# User Stories

## US-001 — <short title>
**As a** <persona>, **I want to** <action>, **so that** <benefit>.

**Traces to**: REQ-004

**Acceptance criteria**:
- [ ] ...

<Gherkin (Given/When/Then) format is also acceptable if confirmed with the
user as their preference — pick one format and stay consistent for the
whole document; do not mix formats across stories.>
```

## Notes for whoever fills this in

- **`traces_to` is mandatory, never blank.** A `REQ-XXX` that generates no natural story (the pure non-functional case, `rules/traceability-rules.md`) simply has no `US-XXX` — it does not get a story with an empty or placeholder link.
- **Splitting**: one `REQ-XXX` may produce multiple `US-XXX` entries when the requirement covers more than one actor, or when a single story would be too large to deliver/test as one unit. Every resulting story still traces back to the same `REQ-XXX`.
- `US-XXX` IDs come from `project-state.md`'s `id_sequences.US`, global to the project.
