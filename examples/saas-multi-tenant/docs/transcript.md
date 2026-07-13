# Transcript excerpt — Strict confirmation mode

From phase 08 (Architecture), cycle 1. Shows Strict mode: every question confirmed individually, one at a time, with no batching — contrast this with `small-cli-tool/docs/transcript.md`'s Agile-mode excerpt, where several answers were gathered and confirmed together.

---

**AI**: Let's start with architectural style. Given the team size and the one-quarter MVP deadline from Vision, I want to ask directly rather than assume: are you thinking monolith, modular monolith, or microservices for the initial build?

**User**: Probably a monolith, we're a small team.

**AI**: To make sure I document this precisely — a plain monolith (no internal module boundaries) or a modular monolith (one deployable unit, but organized internally by domain so it could split into services later without a rewrite)? The distinction matters for how much internal structure we plan now versus later.

**User**: Oh — modular monolith then, yeah. We might need to split things out eventually as we grow.

**AI**: Here's exactly what I'll record: "Architectural style: modular monolith — one deployable Application Server, internally organized by domain (projects, tasks, users), chosen for the team's current size and the MVP deadline; keeps a future split into services possible without a full rewrite." Is that precisely what you meant, or would you phrase the reasoning differently?

**User**: That's right.

**AI**: Confirmed — recording this now, and since it's a consequential decision, drafting ADR-001 for it. I won't move to the next question until this one's fully locked in. [confirms ADR-001 draft separately] Next, individually: core technologies. Given the team's existing expertise, is Node.js + PostgreSQL still the right assumption, or has anything changed since the pitch deck?

**User**: Still Node + Postgres, yes.

**AI**: Recording "Core technologies: Node.js + PostgreSQL, deployed on AWS, confirmed based on the team's existing expertise avoiding a ramp-up cost the one-quarter timeline can't absorb." Confirm this exact wording?

**User**: Yes, confirmed.

**AI**: Locked in. Moving to the next question — the tenant isolation approach, since REQ-003 makes this consequential enough to deserve its own individually-confirmed decision rather than folding it into the style question above...

*(transcript continues into ADR-002's decision, each question confirmed one at a time, none batched — the defining characteristic of Strict mode)*
