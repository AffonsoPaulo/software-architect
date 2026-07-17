# AI Invariants

The canonical, single-source list of rules the AI must follow in every phase, at all times. Every playbook's "Anti-patterns" section references this file instead of restating these rules in its own words — that restatement is exactly what causes the same rule to drift into subtly different versions across 18 playbooks.

## Must

- **Ask before assuming.** If a decision isn't explicitly confirmed by the user, it doesn't exist yet.
- **Verify before framing.** When a question or recommendation depends on the state of something already confirmed (does this entity already support X? which of two related artifacts actually has a given capability?) or on an externally verifiable fact (current pricing, a vendor's actual specs), check it first — re-read the relevant document, or actually research the external fact — before presenting it as a settled premise, an option the user has to choose between, or a recommendation. "Probably cheaper" or "the obvious tier" stated without having checked is the same failure as assuming a technology choice: an unconfirmed guess dressed as an answer. If checking isn't practical in the moment, say explicitly that it's an unverified estimate, not a researched fact.
- **Confirm before documenting.** No answer is written to a document before the confirmation loop (`confirmation-protocol.md`) completes for it. This applies identically to a document being reopened by a Change Request (`change-management.md`) — the user saying "yes, fix it" authorizes reopening the question, it is not itself confirmation of the resulting text; the rewrite still has to be shown and confirmed before the file changes, exactly like any other answer.
- **Document before advancing.** No phase is considered complete with confirmed-but-undocumented answers.
- **Log before advancing.** A phase's gate passing with genuinely new content, or a Change Request closing, produces a `docs/CHANGELOG.md` entry (and a `docs_version` bump) before that phase/CR is considered done — never batched up for "later," never skipped because the change felt small (`rules/versioning.md`).
- **Validate before approving.** A phase's Quality Gate (`quality-gate-structure.md`) is checked before the Skill moves on — never skipped, never assumed to pass. A scriptable criterion means the named script was actually executed and its full output read, every category it reports — not just whichever part came to mind (`quality-gate-structure.md`'s "'Scriptable' means actually run, in full").
- **Check upstream before editing downstream.** Before documenting any confirmed answer, check whether it implies a change to a document already marked `approved` in `project-state.md` (per the graph in `traceability-rules.md`) — not just at the phase 17 Review gate, but in any phase, at any point. If it does, never edit that earlier document directly: route it through `change-management.md` as a Change Request, with its own impact list, even when the discovery happens several phases downstream from where the affected document lives. Noticing the conflict and saying so out loud is not, by itself, compliance — the CR must actually be opened in the same turn, before the current answer is treated as confirmed (`change-management.md`'s "Flagging the conflict out loud is not the same as opening the CR"). A conflict mentioned and left for the user to bring up again later has the same outcome as never having noticed it.

## Never

- **Never invent requirements.** Every `REQ-XXX` traces back to a confirmed answer, not to what the AI thinks the project probably needs.
- **Never invent APIs.** Every `API-XXX` traces to a Use Case and an Architecture component the user has confirmed — not to REST conventions the AI assumes are obviously right.
- **Never invent a database schema.** Every `TBL-XXX` traces to a Domain Model entity the user has confirmed — not to a schema the AI thinks is a reasonable default.
- **Never invent business rules.** Every `BR-XXX` comes from something the user stated, not from common patterns in similar businesses.
- **Never assume a technology, library, or framework without explicit user confirmation** — including "obvious" choices. If the user hasn't confirmed it, it's a `[confirmation individual]` question, not a default.

## How this interacts with delegation and unresolved questions

These invariants hold even when a subagent is involved (`delegation-policy.md`) — a subagent's findings are facts to present, never decisions to act on. They also hold when the user doesn't know an answer (`confirmation-protocol.md`) — the escape valves that exist there (labeled suggestions, risk-register entries, gate overrides) are the *only* sanctioned ways to make progress without a firm answer; silently picking something is never one of them.
