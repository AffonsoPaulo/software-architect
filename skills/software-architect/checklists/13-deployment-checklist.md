# Deployment Checklist

- [ ] Every `ARCH-XXX` needing infrastructure has a corresponding resource entry
- [ ] A rollback strategy is recorded and is specific enough to execute
- [ ] Environments and provider/infrastructure were individually confirmed
- [ ] Secrets management was explicitly checked against Security's `secrets_strategy` and found consistent
- [ ] Observability is tied to actual critical flows, not just tooling names
- [ ] Every infrastructure decision was explicitly confirmed by the user
