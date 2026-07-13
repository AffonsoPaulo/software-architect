# Deployment — Template

Saved at `docs/13-deployment/deployment.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/13-deployment.md`. Defines environments, CI/CD pipeline, infrastructure, rollback strategy, and observability — consistent with the approved Architecture and Security, not designed in isolation from either.

## Structure (Casual)

```markdown
# Deployment

## Environments
<Dev, staging, production, others — `[confirmation individual]`.>

### Production
<Which Architecture components need infrastructure here, and what each
needs — e.g. "ARCH-003: containerized service, 2 min replicas,
autoscaling to 6.">

## Provider/infrastructure
<Cloud provider, on-premise, hybrid — `[confirmation individual]`.>

## CI/CD pipeline
<Tool, triggers, quality gates in the pipeline — what must pass before
deploy: tests, lint, etc.>

```mermaid
flowchart TD
    ...
```

## Rollback strategy
<REQUIRED — how a bad production change gets undone.>

## Observability
**Logs**: ...
**Metrics**: ...
**Alerts**: ...

## Secrets management
<Must match docs/11-security/security.md's secrets strategy exactly —
if it doesn't, that's a real inconsistency to resolve here, not a
second convention to silently introduce.>
```

## Fully Dressed additions

```markdown
## Capacity planning
<Expected load, and the concrete triggers for scaling — e.g. "autoscale
trigger: CPU > 70% for 5 minutes" — grounded in the frequency-of-
occurrence figures from Use Cases (Fully Dressed) where available.>

## Disaster recovery
**RTO** (Recovery Time Objective): <how long until service is restored
after a disaster>
**RPO** (Recovery Point Objective): <how much data loss is acceptable,
measured in time>
<Both must be consistent with Database Design's backup/recovery
expectations (Fully Dressed) — a schema backed up daily can't support an
RPO of one hour.>

## Cost estimate
<Rough expected infrastructure cost — order of magnitude is fine if a
precise number isn't available yet, but "not estimated" should be an
explicit, confirmed answer, not a silent gap.>

## Change management
<How a production change gets approved before it ships — who signs off,
what's required (this can be as light as "any team member can merge to
main and deploy" for a small team, as long as it's the actual confirmed
process, not an assumed one).>

## Infrastructure as code
<Where IaC definitions live (Terraform, CloudFormation, etc.) and how
they're kept in sync with what's actually deployed — or "(none) —
manually provisioned" if genuinely true, though that itself is worth
flagging as a risk for anything beyond a small project.>
```

## Notes for whoever fills this in

- **Every `ARCH-XXX` component that needs its own infrastructure gets an explicit resource entry** — this is the gate's primary scriptable check.
- **Rollback strategy is required**, not optional — every production change needs a stated way to undo it, even if that way is "redeploy the previous container image."
- **Secrets management must match phase 11's secrets strategy** — a mismatch here is a contradiction to resolve explicitly (likely via `rules/change-management.md` if Security was already approved), never a silent second approach.
