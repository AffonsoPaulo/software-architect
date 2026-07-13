---
risks:
  - id: RISK-001
    description: "Which specific SSO providers beyond Google Workspace and Microsoft to support (e.g. Okta) is not yet decided — the design-partner customer uses Google Workspace, which is covered, but this may need revisiting if a future customer requires a different provider."
    source: "unknown_answer"
    traces_to: ["SEC-002"]
    probability: "medium"
    impact: "low"
    mitigation: "Deferred — Google Workspace and Microsoft cover the known near-term customers; revisit if a specific deal requires another provider. Not a launch blocker."
    owner: "Engineering lead"
    status: "accepted"
    opened_at: "2026-05-14T10:00:00Z"
    resolved_at: null
---

## RISK-001
Arose during Security (phase 11): when asked which SSO providers to support, the user's first answer was "I'm not sure which ones we'll actually need beyond what our design partner uses." Per `rules/confirmation-protocol.md`'s "I don't know" handling, the AI proposed a suggestion (Google Workspace + Microsoft, covering the known customer plus the most common alternative), the user accepted it as good enough for launch, and this entry records the deferred question (other providers) as an explicitly accepted risk rather than leaving it silently unresolved.
