# TEST-004 — Load test at 500 concurrent users
*Traces to: REQ-004 · Level: Load · Kind: Automated · Author: Priya*

k6 script simulating 500 concurrent users hitting API-001 and API-002 across multiple tenants, asserting p95 latency stays under 300ms and no tenant's latency degrades disproportionately (the REQ-004 noisy-neighbor edge case).

**Non-functional test detail**
Threshold: p95 < 300ms sustained over a 10-minute run at 500 concurrent simulated users; per-tenant p95 must not exceed the aggregate p95 by more than 20%, to catch noisy-neighbor effects.
