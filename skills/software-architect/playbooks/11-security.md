# Playbook 11 — Security

## Objective

Model threats, define authentication/authorization in detail, classify data, and record compliance requirements. Always mandatory, feeding `docs/11-security/risk-register.md` with anything identified here — and with pending items from other phases too, per `rules/confirmation-protocol.md`'s "I don't know" handling.

## When to run

Always. Security is one of the four always-mandatory phases (`playbooks/00-project-calibration.md`), regardless of project size or cycle.

## When NOT to run

Never skippable.

## Inputs

- `docs/08-architecture/architecture.md` — approved.
- `docs/09-api-design/api.md` — approved, specifically every `API-XXX` interaction unit.
- `docs/10-frontend-planning/frontend.md` — approved, if this phase ran, specifically any role/permission gating noted per screen or action. These are explicit input to the authorization model below, collected up front rather than improvised per screen if one happens to come up in conversation.

## Outputs

- `docs/11-security/security.md`.
- `docs/11-security/risk-register.md` — created or extended.

## Documents produced

- `docs/11-security/security.md` (index: threat model summary, auth/authz, compliance) plus one `docs/11-security/sec-XXX.md` per control, via `templates/security.md` (`rules/document-locations.md`).
- `docs/11-security/risk-register.md` (index) plus one `docs/11-security/risk-XXX.md` per risk, via `templates/risk-register.md` (`rules/document-locations.md`).

## Mandatory questions

All high-impact — most are `[confirmation individual]`:

- Threat modeling per critical component (STRIDE or an equivalent simplified approach) — `[confirmation individual]`
- Authentication mechanism (password, OAuth, SSO, magic link) and authorization model (RBAC, ABAC), in detail — `[confirmation individual]`. Start from every role/permission constraint already noted in phase 10's screens, if that phase ran, and fold each one into this model explicitly rather than letting the model be designed from scratch as if those constraints hadn't already come up.
- Data classification (PII, financial, health) and required treatment — `[confirmation individual]`
- Compliance requirements (LGPD, GDPR, PCI-DSS, HIPAA, none) — `[confirmation individual]`
- Secrets/credentials strategy (vault, env vars, KMS)

**Fully Dressed only** (`rules/documentation-depth.md`), all `[confirmation individual]` given Security's always-strict status:
- For each critical component: a full STRIDE pass — all six threat categories considered explicitly, not just an illustrative example.
- Where does data cross a trust boundary (public internet, third party, internal network)? A data flow diagram marking those boundaries.
- What's the incident response plan — who's notified, what happens, when a security incident is detected?
- How do the controls above actually get verified before release — static analysis, dependency scanning, penetration testing?
- For each compliance regime that applies: which specific articles/controls must be satisfied, and what addresses each?

## Optional questions

- Deeper threat modeling for non-critical components, if the user wants more coverage than the mandatory pass over critical ones.

## Interview flow

1. Data classification first — knowing what's actually sensitive shapes every question that follows, including which components count as "critical" for threat modeling.
2. Authentication mechanism and authorization model — `[confirmation individual]` each.
3. Threat modeling, component by component, starting with whichever ones handle classified-sensitive data or sit at a trust boundary. For each threat: mitigation or explicit accepted risk, never left open.
4. Compliance requirements — `[confirmation individual]`.
5. Secrets strategy last, once the shape of what needs protecting is clear.
6. Walk every `API-XXX` from phase 09 and confirm its auth treatment explicitly — including "public, no auth required" as a valid, but stated, answer.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Nearly everything in this phase is individually confirmed by default — Security is an always-strict category, so treat every consequential decision here as individual even where a question isn't explicitly tagged.

## How to document answers

Each confirmed control becomes its own `docs/11-security/sec-XXX.md` item file, `Traces to` set to the component and/or interaction unit it protects, with a matching row added to `security.md`'s index table. Every threat gets recorded with its mitigation or a cross-reference to a `RISK-XXX` item file in the risk register — never just noted in passing without one of the two. At Fully Dressed depth, the additional answers map to `templates/security.md`'s "Fully Dressed additions" section (full STRIDE pass, data flow diagram, incident response, security testing plan, compliance control mapping).

## How to validate answers

- Every classified-sensitive data category has an associated control.
- Every identified threat has a mitigation or an explicitly accepted, registered risk — never implicit.
- Authentication/authorization covers 100% of `API-XXX` interaction units from phase 09 — including an explicit "no auth" statement where that's the real answer, not silence.
- Every `SEC-XXX` has `traces_to` pointing to something real.

## Special cases

- **A threat with no available mitigation right now**: still gets recorded — as an accepted risk in the risk register, with an owner and status, per `rules/quality-gate-structure.md`'s escape valve. Security itself is always-strict, so this escape valve does not apply to skip the confirmation of the risk — it only means the *mitigation* can be deferred, not that the risk goes unrecorded or unconfirmed.
- **Brownfield project**: if Calibration's subagent research surfaced existing auth mechanisms or secrets handling, present those as the starting point to confirm — new interaction units in this cycle should follow the existing mechanism unless the user consciously decides otherwise.
- **Public interaction unit, genuinely no auth needed**: valid, but must be stated explicitly per unit — never silently assumed by omission.

## Common ambiguities

- "We'll add proper auth later" — this phase doesn't accept deferred security as an answer to the mandatory questions; a genuinely public unit is a valid, explicit answer, but "later" is not.
- Data that seems sensitive but the user says isn't (or vice versa) — if the classification seems off given what the data actually is (e.g. an email address marked "not PII"), ask again rather than accepting a classification that doesn't hold up.

## Frequent errors

- Leaving a threat without a mitigation or an accepted-risk entry — implicit acceptance is not the same as recorded acceptance.
- Skipping individual confirmation for a security decision because the project is running in Agile mode — Security is always-strict as a whole.
- Missing an `API-XXX` in the authentication/authorization coverage pass — every one needs an explicit answer, not just the "obviously sensitive" ones.

## Examples

> AI: "For the refund interaction unit (API-001), what's the required auth? Customer session, support session, or either?"
> User: "Either, but if it's support-initiated, log which support user did it."
> AI: "Recording SEC-004: 'API-001 requires an authenticated session (customer or support role); support-initiated refunds are logged with the acting user's identity,' tracing to API-001. Does that fully capture it, or is there an additional audit requirement beyond logging?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never leave a threat without an explicit mitigation or accepted-risk entry, and never assume an interaction unit is adequately protected without walking through it explicitly — "it's probably fine" is exactly the kind of undocumented assumption this Skill exists to prevent, and doubly so in the one phase whose entire purpose is catching it.

## Checklist

`checklists/11-security-checklist.md`

## Quality Gate

`quality-gates/11-security-gate.md`. Summary: every classified-sensitive data category has a control; every threat has a mitigation or a registered accepted risk; authentication/authorization covers 100% of phase 09's interaction units.

## Approval criteria

This phase is done when every sensitive data category has a control, every threat is resolved (mitigated or explicitly accepted and registered), authentication/authorization is confirmed for every interaction unit, and the user has explicitly confirmed the full security model.
