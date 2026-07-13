# Architecture Review Checklist

- [ ] `validate-ids.mjs` clean across all documents
- [ ] `validate-traceability.mjs` clean across the full graph, respecting documented exceptions
- [ ] `validate-versioning.mjs` clean — every cycle/artifact has an Author, `docs_version` matches `CHANGELOG.md`'s newest entry, `changelog[]` and `CHANGELOG.md` haven't drifted apart
- [ ] All 18 phase gates show passed for the active cycle
- [ ] **Semantic conflict scan performed by the main thread and found zero unresolved contradictions** — a separate, non-delegable check from structural traceability, not implied by the two items above
- [ ] Every gap/conflict found was routed through a Change Request, not patched in isolation
- [ ] Every outstanding risk-register entry or escape-valve override is resolved or freshly re-confirmed as acceptable
- [ ] `docs/17-review/review-report.md` accurately reflects what was found and resolved
- [ ] Every significant documentation event since the last `CHANGELOG.md` entry has a corresponding row (completeness — not mechanically checkable, requires the reviewer's judgment)
- [ ] Explicit final approval was given by the user, individually confirmed, with a timestamp
