# Deployment — Template

Saved at `docs/13-deployment/deployment.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/13-deployment.md`. Defines environments, CI/CD pipeline, infrastructure, rollback strategy, and observability — consistent with the approved Architecture and Security, not designed in isolation from either.

## Structure

```yaml
---
environments:
  - name: "production"
    infrastructure_components:
      - arch_id: "ARCH-003"
        # REQUIRED for every ARCH-XXX component that needs its own
        # infrastructure/resource — traces back to Architecture.
        resource: "<what it needs — e.g. 'containerized service, 2 min
          replicas, autoscaling to 6'>"
provider: "<cloud provider / on-premise / hybrid — `[confirmation individual]`>"
cicd:
  tool: "..."
  triggers: "..."
  pipeline_quality_gates: "<what must pass before deploy — tests, lint, etc.>"
rollback_strategy: "<REQUIRED — how a bad production change gets undone>"
observability:
  logs: "..."
  metrics: "..."
  alerts: "..."
secrets_management: "<must be consistent with docs/11-security/security.md's
  secrets_strategy — never a second, contradicting convention>"
---
```

```markdown
# Deployment

## Environments
<Dev, staging, production, others — `[confirmation individual]` — and
which Architecture components need infrastructure in each.>

## Provider/infrastructure
<Cloud provider, on-premise, hybrid — `[confirmation individual]`.>

## CI/CD pipeline
<Tool, triggers, quality gates in the pipeline.>

```mermaid
flowchart TD
    ...
```

## Rollback strategy
...

## Observability
<Logs, metrics, alerts.>

## Secrets management
<Must match docs/11-security/security.md's secrets_strategy exactly —
if it doesn't, that's a real inconsistency to resolve here, not a
second convention to silently introduce.>
```

## Notes for whoever fills this in

- **Every `ARCH-XXX` component that needs its own infrastructure gets an explicit resource entry** — this is the gate's primary scriptable check.
- **Rollback strategy is required**, not optional — every production change needs a stated way to undo it, even if that way is "redeploy the previous container image."
- **Secrets management must match phase 11's `secrets_strategy`** — a mismatch here is a contradiction to resolve explicitly (likely via `rules/change-management.md` if Security was already approved), never a silent second approach.
