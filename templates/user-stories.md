# User Stories — Template

Saved at `docs/04-user-stories/` in the target project (see `rules/document-locations.md`). Produced by `playbooks/04-user-stories.md`. Converts approved functional requirements into User Stories, ready to become Use Cases in phase 05.

This category splits into an **index file** (`user-stories.md`) and one **item file** per story (`us-001.md`, `us-002.md`, ...) — see `rules/document-locations.md`.

## Index file — `user-stories.md`

```markdown
# User Stories

| ID | Title | Traces to |
|---|---|---|
| [US-001](us-001.md) | Post a recipe | REQ-004 |

Note: REQ-XXX entries that are purely non-functional have no User Story —
they trace directly to ARCH-XXX/SEC-XXX instead, per
rules/traceability-rules.md's documented exception.
```

## Item file — `us-001.md`

```markdown
# US-001 — <short title>
*Traces to: REQ-004*

**As a** <persona>, **I want to** <action>, **so that** <benefit>.

**Acceptance criteria**
- [ ] ...

**INVEST notes**
<Brief note on how this story satisfies Independent, Negotiable,
Valuable, Estimable, Small, Testable — only needs detail where it's not
obvious.>
```

<Gherkin (Given/When/Then) format is also acceptable instead of As a/I want to/so that, if confirmed with the user as their preference — pick one format and stay consistent across every item file.>

- `persona` is a specific actor, not "the user" generically if more than one actor exists.
- `Traces to` is mandatory — every `US-XXX` must trace to at least one `REQ-XXX` (`rules/traceability-rules.md`, never optional, unlike REQ→BR).

## Fully Dressed additions

```markdown
# US-001 — <short title>
*Traces to: REQ-004 · Priority: Must have*

**As a** <persona>, **I want to** <action>, **so that** <benefit>.

**Business value**
<Why this ranks where it does relative to other stories — not a repeat
of "so that," but the reasoning behind the Priority above (revenue
impact, blocks other work, regulatory deadline, etc.).>

**Acceptance criteria**
- [ ] ...

**Non-functional considerations**
<Anything this specific story needs beyond the general NFRs already in
Requirements — e.g. "this action must complete in under 2s even on a
throttled connection, since it's used in-store on tablets." "None beyond
the project's general NFRs" is a valid answer.>

**Out of scope for this story**
<What a reader might assume this story covers but doesn't — prevents
scope creep during implementation. "(none)" if the story is already
narrow enough that nothing needs excluding.>

**Open questions**
<Anything not yet resolved that doesn't block moving forward but should
be tracked — or "(none).">

**INVEST notes**
...
```

## Notes for whoever fills this in

- **`Traces to` is mandatory, never blank.** A `REQ-XXX` that generates no natural story (the pure non-functional case, `rules/traceability-rules.md`) simply has no `US-XXX` — it does not get a story with an empty or placeholder link.
- **Splitting**: one `REQ-XXX` may produce multiple `US-XXX` entries when the requirement covers more than one actor, or when a single story would be too large to deliver/test as one unit. Every resulting story still traces back to the same `REQ-XXX`.
- `US-XXX` IDs come from `project-state.md`'s `id_sequences.US`, global to the project.
