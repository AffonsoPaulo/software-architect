# Deployment Gate

## Scriptable criteria
- [ ] Every `ARCH-XXX` (`docs/08-architecture/`) that needs its own infrastructure has at least one corresponding resource entry in `docs/13-deployment/deployment.md` — checked by `scripts/validate-traceability.mjs`

## Judgment criteria (AI/human)
- [ ] A rollback strategy is recorded and is specific enough to actually execute, not just named in the abstract
- [ ] Environments and provider/infrastructure were individually confirmed
- [ ] **Secrets management here was explicitly checked against `docs/11-security/security.md`'s `secrets_strategy` and found consistent** — not assumed consistent by default, and any divergence found was resolved with the user before this gate can pass
- [ ] Observability (logs, metrics, alerts) is tied to this project's actual critical flows, not a generic tooling mention
- [ ] Every infrastructure decision was explicitly confirmed by the user, per `rules/confirmation-protocol.md`

## Pass rule
The gate passes only when every scriptable criterion returns clean AND every judgment criterion is explicitly confirmed by the user. If any criterion fails, the Skill does not advance — it lists exactly what failed and reopens the specific component or decision, not the whole phase. The secrets-management consistency check in particular must show its work (state explicitly what was compared and that it matched) rather than being marked passed by assumption. See `rules/quality-gate-structure.md` for the escape valve on stuck criteria.
