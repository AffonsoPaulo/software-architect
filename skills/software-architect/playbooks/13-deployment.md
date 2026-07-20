# Playbook 13 — Deployment

## Objective

Define environments, CI/CD pipeline, infrastructure, rollback strategy, and observability — consistent with the already-approved Architecture and Security, not designed as if either doesn't exist. Every Architecture component with its own infrastructure needs, and every Security secrets decision, must show up here without contradiction.

## When to run

Whenever `docs/project-state.md` marks phase 13 as included — in practice, whenever the project will actually be deployed somewhere (as opposed to a purely local tool).

## When NOT to run

Skippable for projects with no deployment target at all (a local CLI tool, a library with no hosted component). Calibration decides this.

## Inputs

- `docs/08-architecture/architecture.md` — approved, specifically every `ARCH-XXX` component.
- `docs/11-security/security.md` — approved, specifically `secrets_strategy`.

## Outputs

- `docs/13-deployment/deployment.md`.

## Documents produced

- `docs/13-deployment/deployment.md` via `templates/deployment.md`.

## Mandatory questions

- Environments needed (dev, staging, production, others) — `[confirmation individual]`
- Target provider/infrastructure (specific cloud, on-premise, hybrid) — `[confirmation individual]`
- CI/CD strategy (tool, triggers, pipeline quality gates)?
- Rollback strategy and observability (logs, metrics, alerts)?
- Secrets management in production (must be consistent with phase 11)?

*Fully Dressed only* (`rules/documentation-depth.md`):
- What's the expected load, and what are the concrete triggers for scaling?
- What are the Recovery Time Objective and Recovery Point Objective for disaster recovery — and are they consistent with Database Design's backup/recovery expectations?
- What's the rough expected infrastructure cost?
- How does a production change actually get approved before it ships?
- Where does infrastructure-as-code live, and how is it kept in sync with what's deployed?

## Optional questions

- Partitioning/multi-region strategy, only if the project's scale actually warrants it now rather than as a later optimization.

## Interview flow

1. Environments — `[confirmation individual]`.
2. Provider/infrastructure — `[confirmation individual]`.
3. Walk every `ARCH-XXX` component from phase 08 and confirm its infrastructure needs per environment — this is where most of the document's content comes from, not a separate free-form section.
4. CI/CD pipeline.
5. Rollback strategy — never accepted as "we'll figure it out" (see "Common ambiguities").
6. Observability.
7. Secrets management last — explicitly cross-check against phase 11's `secrets_strategy` before accepting an answer; if they don't match, resolve the contradiction with the user rather than recording both.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Environments and provider/infrastructure are always individually confirmed — both are expensive to change once real infrastructure exists.

## How to document answers

Each confirmed infrastructure need becomes an entry under its environment, referencing the `ARCH-XXX` it serves. Secrets management is recorded as confirmed only after being checked against `docs/11-security/security.md` — if the user's answer here diverges from that document, that divergence is flagged and resolved before documenting either. At Fully Dressed depth, the additional answers map to `templates/deployment.md`'s "Fully Dressed additions" section.

## How to validate answers

- Every `ARCH-XXX` component that needs infrastructure has an explicit resource entry, in every environment where it's deployed.
- A rollback strategy exists and is specific enough to actually execute, not just named in the abstract.
- Secrets management here matches phase 11's `secrets_strategy` exactly — checked explicitly, not assumed consistent by virtue of both existing.

## Special cases

- **Architecture component with no real infrastructure need** (e.g. a pure logic module with no separate deployment unit): valid to have no entry — but confirm this explicitly per component rather than silently omitting ones that were simply forgotten.
- **Secrets management contradicts phase 11**: this is a real inconsistency, not a design decision to make fresh here. Resolve which is correct with the user; if phase 11 needs to change as a result, that's a Change Request (`rules/change-management.md`), not a quiet divergence recorded in this document alone.

## Common ambiguities

- "We'll figure out rollback if something breaks" — not an acceptable answer; push for at least a baseline strategy (e.g. "redeploy the last known-good image") even if it's not sophisticated yet.
- Observability described only in terms of tools ("we'll use Datadog") without what's actually being observed — ask what logs/metrics/alerts actually matter for this project's critical flows, not just which vendor.

## Frequent errors

- An Architecture component silently missing from the infrastructure plan.
- Accepting a deployment-time secrets approach that contradicts what Security already decided, without flagging it.
- Treating environments or infrastructure provider as a default/obvious choice instead of individually confirming them.
- Recommending a provider, tier, or configuration as cheaper/better based on an unresearched impression rather than actually checking current pricing/specs (`rules/ai-invariants.md`'s "Verify before framing") — and defaulting to the first tier a provider surfaces (e.g. a "high frequency"/premium instance class) without confirming the project's actual load, from Calibration or the NFRs, justifies it over a cheaper one.

## Examples

> AI: "ARCH-003, the Order Service, needs its own deployment unit per the architecture. What are its resource needs in production — container specs, scaling policy?"
> User: "Containerized, 2 replicas minimum, autoscale up to 6 based on CPU."
> AI: "Recording that under the production environment, tracing to ARCH-003. For secrets — Security specified a vault-based approach (SEC's secrets_strategy). Should the Order Service's database credentials follow that same vault pattern, or does it have different needs?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never record a secrets management approach that contradicts phase 11 without explicitly resolving the contradiction first, and never leave an Architecture component's infrastructure needs unaddressed by omission.

## Checklist

`checklists/13-deployment-checklist.md`

## Quality Gate

`quality-gates/13-deployment-gate.md`. Summary: every Architecture component needing infrastructure has a defined environment/resource; a rollback strategy exists for every production change; secrets management is explicitly verified consistent with phase 11, not assumed.

## Approval criteria

This phase is done when every relevant Architecture component has defined infrastructure, a rollback strategy is recorded, secrets management is confirmed consistent with Security, and the user has explicitly confirmed the full deployment plan.
