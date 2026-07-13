# Risk Register

### RISK-001 — Undecided SSO providers beyond Google Workspace and Microsoft
*Source: Unknown answer · Category: Business · Traces to: SEC-002 · Probability: Medium · Impact: Low · Status: Accepted*

Which specific SSO providers beyond Google Workspace and Microsoft to support (e.g. Okta) is not yet decided — the design-partner customer uses Google Workspace, which is covered, but this may need revisiting if a future customer requires a different provider.

**Mitigation**: Deferred — Google Workspace and Microsoft cover the known near-term customers; revisit if a specific deal requires another provider. Not a launch blocker.
**Owner**: Engineering lead
**Opened**: 2026-05-14
**Review cadence**: Revisit whenever a new customer's onboarding requirements are gathered — no fixed calendar cadence, since this is deal-driven rather than time-driven.

Arose during Security (phase 11): when asked which SSO providers to support, the user's first answer was "I'm not sure which ones we'll actually need beyond what our design partner uses." Per `rules/confirmation-protocol.md`'s "I don't know" handling, the AI proposed a suggestion (Google Workspace + Microsoft, covering the known customer plus the most common alternative), the user accepted it as good enough for launch, and this entry records the deferred question (other providers) as an explicitly accepted risk rather than leaving it silently unresolved.
