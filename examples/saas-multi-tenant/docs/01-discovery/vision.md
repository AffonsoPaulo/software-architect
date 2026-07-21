# Vision

## Problem
Small teams managing projects across email, spreadsheets, and chat lose track of who's doing what. Existing tools are either too simple (a shared spreadsheet) or too heavyweight (enterprise project-management suites with a steep learning curve).

## Target audience
Small-to-mid-size teams (5-50 people) at multiple customer organizations (tenants) — the product is multi-tenant SaaS, not a single-team internal tool.

## Stakeholder profiles
| Stakeholder group | Cares about | Success looks like |
|---|---|---|
| Design-partner customer (early adopter) | Replacing their spreadsheet+Slack workflow without losing anything they rely on today | Their ~30-person team is fully onboarded and using it daily by the target date |
| Product lead | Market fit signal before committing further roadmap investment | 10 paying tenants and 80% WAU within 6 months, as stated in Business objective |
| Engineering lead | A codebase that doesn't require a rewrite to reach the next 10x of tenants | Modular monolith holds up through the MVP and the next 2 milestones without a forced architectural pivot |

## User journey
A team lead at the design-partner organization signs up, creates their organization's workspace, and invites their ~30-person team. As invites are accepted, each member lands on a project board showing the tasks assigned to them — no spreadsheet tab-hunting, no scrolling through a Slack channel for the latest status. A member picks up a task, changes its status as they work, and the team lead sees the board update in real time without asking anyone for a status report. Nothing any member does is ever visible to, or reachable by, a different customer organization on the same product — that boundary is invisible by default, not something a user has to think about or configure.

## Current state
The design-partner customer currently uses a shared spreadsheet plus a Slack channel — no dedicated tool.

## Business objective
Reach 10 paying customer organizations with at least 80% weekly-active-user rate among their team members within 6 months of GA launch.

## Business opportunity
Beyond solving the immediate coordination problem, a well-executed multi-tenant task tool positions the product to expand into adjacent workflows (time tracking, reporting) once the core is proven — each paying tenant is a foothold for future upsell, not just a one-time sale. The design-partner relationship itself is an asset: a successful launch with them is a reference case for the next 9 target customers.

## Guiding principles
- **Tenant isolation is non-negotiable, and never relies on a single layer** — every decision that touches data access defaults to "how could this leak across tenants," not just "does this work for one tenant."
- **Ship the narrow MVP over a broader one** — task creation, assignment, and status tracking, done well and fast enough for the one-quarter deadline, beats a wider feature set that risks the design-partner's onboarding date.
- **The design-partner's real workflow is the spec, not a generic "small team" persona** — when a decision is ambiguous, resolve it against what actually gets this specific ~30-person team off their spreadsheet, not a hypothetical average customer.

## Success criteria
A team can create a project, add tasks, assign them to members, and track status changes, with each organization's data fully isolated from every other organization's.

## Success metrics
| Metric | Baseline | Target | Measured |
|---|---|---|---|
| Paying customer organizations | 0 | 10 | Billing system count, monthly |
| Weekly-active-user rate (team members per tenant) | Not currently measured (no product exists yet) | 80% | Product analytics, weekly, starting at GA |
| Design-partner team fully migrated off spreadsheet | 0% | 100% | Manual confirmation with the design-partner's team lead, at MVP launch |

## Constraints
Must launch a usable MVP within one quarter. Must support the design-partner customer's existing team size (~30 people) from day one.

## Assumptions and dependencies
- Assumes the design-partner customer's ~30 users are willing to fully switch off their spreadsheet during the pilot, not run both in parallel indefinitely.
- Assumes Google Workspace and Microsoft SSO cover the identity providers of the first 10 target customers — unverified beyond the design partner (see [RISK-001](../11-security/risk-001.md)).
- Depends on the design-partner customer providing timely feedback during the MVP build — a delay on their side directly threatens the one-quarter deadline.

## Business-level risks
- **A competitor with more funding ships equivalent multi-tenant task management first**: mitigation is speed to the design-partner's onboarding date, not feature breadth — ship the narrow MVP, not a broader one.
- **The design-partner customer churns during the pilot**: would remove the primary reference case for the other 9 target customers; mitigated by treating their feedback as a leading indicator throughout the build, not just at launch.

## Out of scope
Not building time tracking, invoicing, or Gantt-chart-style scheduling in the first release — task creation, assignment, and status tracking only.
