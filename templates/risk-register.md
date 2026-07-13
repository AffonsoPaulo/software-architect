# Risk Register — Template

A single, growing document at `docs/11-security/risk-register.md` in the target project (see `rules/document-locations.md`). Any phase may append to it — not only Security — most commonly for:

- An "I don't know" answer left as an open pending item (`rules/confirmation-protocol.md`).
- A Quality Gate criterion that was explicitly overridden via the escape valve (`rules/quality-gate-structure.md`).
- An actual project/technical risk surfaced during Security (phase 11) or any other phase.

## Structure

```yaml
---
risks:
  - id: RISK-001
    description: "<the risk or open item, stated concretely — not 'performance might be an issue' but 'no answer confirmed for expected concurrent user count, used to size the database'>"
    source: "gate_override"
    # "gate_override" | "unknown_answer" | "security_review" | "other"
    traces_to: []
    # The REQ-XXX, ARCH-XXX, or gate criterion this risk relates to, if applicable
    probability: "medium"
    # "low" | "medium" | "high" — only meaningful for source: "security_review" or "other";
    # a gate_override or unknown_answer risk doesn't need a probability estimate, it needs resolution
    impact: "medium"
    # "low" | "medium" | "high"
    mitigation: "<what reduces this risk, or 'none — accepted as-is' if the user explicitly accepted it>"
    owner: "<who is responsible for resolving or monitoring this — usually the user/team, never 'the AI'>"
    status: "open"
    # "open" | "mitigated" | "accepted" | "resolved"
    opened_at: "2026-07-13T10:00:00Z"
    resolved_at: null
---
```

## Notes for whoever fills this in

- Every entry with `status: open` and `source: gate_override` on a category that is **not** always-strict (see `rules/confirmation-protocol.md`) is what keeps that phase's gate at "conditionally approved" instead of fully passed — resolving the risk (changing its status) is what lets the gate close for good.
- An entry is never silently removed. If it stops being relevant, its `status` moves to `resolved` with a `resolved_at` timestamp — the record stays.
- This file is read by `playbooks/17-review.md` as part of the final audit — an unresolved `open` risk on an always-strict category blocks final sign-off; on other categories it's surfaced to the user for an explicit "still fine to ship with this open?" confirmation.
