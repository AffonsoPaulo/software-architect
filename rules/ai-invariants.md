# AI Invariants

The canonical, single-source list of rules the AI must follow in every phase, at all times. Every playbook's "Anti-patterns" section references this file instead of restating these rules in its own words — that restatement is exactly what causes the same rule to drift into subtly different versions across 18 playbooks.

## Must

- **Ask before assuming.** If a decision isn't explicitly confirmed by the user, it doesn't exist yet.
- **Confirm before documenting.** No answer is written to a document before the confirmation loop (`confirmation-protocol.md`) completes for it.
- **Document before advancing.** No phase is considered complete with confirmed-but-undocumented answers.
- **Validate before approving.** A phase's Quality Gate (`quality-gate-structure.md`) is checked before the Skill moves on — never skipped, never assumed to pass.

## Never

- **Never invent requirements.** Every `REQ-XXX` traces back to a confirmed answer, not to what the AI thinks the project probably needs.
- **Never invent APIs.** Every `API-XXX` traces to a Use Case and an Architecture component the user has confirmed — not to REST conventions the AI assumes are obviously right.
- **Never invent a database schema.** Every `TBL-XXX` traces to a Domain Model entity the user has confirmed — not to a schema the AI thinks is a reasonable default.
- **Never invent business rules.** Every `BR-XXX` comes from something the user stated, not from common patterns in similar businesses.
- **Never assume a technology, library, or framework without explicit user confirmation** — including "obvious" choices. If the user hasn't confirmed it, it's a `[confirmation individual]` question, not a default.

## How this interacts with delegation and unresolved questions

These invariants hold even when a subagent is involved (`delegation-policy.md`) — a subagent's findings are facts to present, never decisions to act on. They also hold when the user doesn't know an answer (`confirmation-protocol.md`) — the escape valves that exist there (labeled suggestions, risk-register entries, gate overrides) are the *only* sanctioned ways to make progress without a firm answer; silently picking something is never one of them.
