# TEST-003 — Cross-tenant access rejection
*Traces to: REQ-003 · Level: E2e · Kind: Automated · Author: Priya*

Authenticates as a user in Tenant A, attempts to access/create tasks under a Tenant B project ID (both direct guesses and IDs harvested from Tenant A's own valid responses), asserts every attempt returns 404 with no distinguishable difference from a genuinely nonexistent project.

**Non-functional test detail**
Threshold: zero successful cross-tenant reads or writes across the full attack matrix tested (direct ID guess, ID reuse, parameter tampering). Any single success fails the build.
