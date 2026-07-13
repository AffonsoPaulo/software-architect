# Risk Register — Template

A single, growing category at `docs/11-security/` in the target project (see `rules/document-locations.md`). Any phase may append to it — not only Security — most commonly for:

- An "I don't know" answer left as an open pending item (`rules/confirmation-protocol.md`).
- A Quality Gate criterion that was explicitly overridden via the escape valve (`rules/quality-gate-structure.md`).
- An actual project/technical risk surfaced during Security (phase 11) or any other phase.

This category splits into an **index file** (`risk-register.md`) and one **item file** per risk (`risk-001.md`, `risk-002.md`, ...) — see `rules/document-locations.md`.

## Index file — `risk-register.md`

```markdown
# Risk Register

| ID | Title | Source | Status | Traces to |
|---|---|---|---|---|
| [RISK-001](risk-001.md) | <short title> | Gate override | Open | (none) |
```

## Item file — `risk-001.md`

```markdown
# RISK-001 — <short title>
*Source: Gate override · Traces to: (none) · Impact: Medium · Status: Open*

<The risk or open item, stated concretely — not "performance might be an
issue" but "no answer confirmed for expected concurrent user count, used
to size the database.">

**Mitigation**: <what reduces this risk, or "none — accepted as-is" if
the user explicitly accepted it>
**Owner**: <who is responsible for resolving or monitoring this — usually
the user/team, never "the AI">
**Opened**: 2026-07-13
```

`Source` is `Gate override` / `Unknown answer` / `Security review` / `Other`. `Status` is `Open` / `Mitigated` / `Accepted` / `Resolved`. `Traces to` holds the `REQ-XXX`, `ARCH-XXX`, or gate criterion this risk relates to, if applicable — `(none)` otherwise. A `Probability` key (`Low`/`Medium`/`High`) is only meaningful for `Source: Security review` or `Other` — a gate-override or unknown-answer risk doesn't need a probability estimate, it needs resolution, so omit the key for those.

## Fully Dressed additions

```markdown
# RISK-001 — <short title>
*Source: Security review · Category: Technical · Probability: Medium · Impact: Medium · Traces to: ARCH-003 · Status: Open*

<description, as in Casual>

**Mitigation**: ...
**Owner**: ...
**Opened**: 2026-07-13
**Review cadence**: <how often this risk is revisited while open — e.g.
"monthly," "at each milestone" — required for anything with Status: Open
past a single phase, so an open risk doesn't just sit forgotten>
```

`Category` classifies the risk itself (e.g. `Technical` / `Schedule` / `Compliance` / `Business` / `Organizational`), distinct from `Source` (which records how it was discovered).

## Notes for whoever fills this in

- Every entry with `Status: Open` and `Source: Gate override` on a category that is **not** always-strict (see `rules/confirmation-protocol.md`) is what keeps that phase's gate at "conditionally approved" instead of fully passed — resolving the risk (changing its status) is what lets the gate close for good.
- An entry is never silently removed. If it stops being relevant, its `Status` moves to `Resolved` with a resolved date noted in the body — the record stays.
- This file is read by `playbooks/17-review.md` as part of the final audit — an unresolved `Open` risk on an always-strict category blocks final sign-off; on other categories it's surfaced to the user for an explicit "still fine to ship with this open?" confirmation.
