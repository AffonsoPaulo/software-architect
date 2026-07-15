# project-state.md — Template

This is the single file the Skill reads and writes on every interaction. It lives at `docs/project-state.md` in the target project (see `rules/document-locations.md`). Copy the YAML structure below into that path when a new project starts (`playbooks/00-project-calibration.md`), and update it after every confirmed answer — never let it fall behind what's actually been confirmed. The file is exactly this YAML, starting on line 1 — no `---`/`---` delimiters wrapping it, no markdown heading above it; `rules/document-format.md`'s "pure YAML" means the whole file, not a block inside a larger markdown document.

Field names and structure stay in English (they're part of the Skill's schema, per `rules/language-policy.md`). Free-text values (`scope`, `reason`, question text, etc.) follow the project's confirmed `language` field.

## Structure

```yaml
skill_version: "1.0.0"
# Version from SKILL.md's frontmatter at the time this project was initialized.
# On resume, SKILL.md compares this to its own current version and warns
# the user if they differ instead of silently assuming compatibility.

docs_version: "1.1.0"
# Single semantic version for the WHOLE documentation set — Major.Minor.Patch,
# rules/versioning.md. Bumped once per docs/CHANGELOG.md entry; always matches
# that file's newest row exactly (see `changelog` below — "1.1.0" here matches
# its last entry). Not the same field as skill_version above (that's this
# Skill package's own version; this is the target project's docs).

language: "en"
# The language confirmed with the user during phase 00 (Calibration).
# Set once, reused for every phase and every cycle. Never re-asked.
language_history:
  - language: "en"
    changed_at: "2026-07-13T10:00:00Z"
    reason: "initial calibration"
  # Append an entry every time the user explicitly changes language mid-project.
  # A language change never retroactively affects already-approved documents.

confirmation_mode: "strict"
# "strict" | "agile" — chosen during phase 00, explained to the user before asking.
# Can change at any point via explicit user request only — never changed by the AI on its own.
confirmation_mode_history:
  - mode: "strict"
    changed_at: "2026-07-13T10:00:00Z"

documentation_depth: "casual"
# "casual" | "fully_dressed" — chosen during phase 00, right after confirmation_mode,
# explained to the user before asking (rules/documentation-depth.md). Applies to every
# phase in every cycle. Can change at any point via explicit user request only — never
# changed by the AI on its own, and never retroactive to already-approved documents.
documentation_depth_history:
  - depth: "casual"
    changed_at: "2026-07-13T10:00:00Z"

id_sequences:
  # Last-used number per ID prefix (rules/id-conventions.md), GLOBAL to the whole
  # project — never per cycle, never reset. The next REQ, for example, is always
  # id_sequences.REQ + 1, regardless of which cycle is active. This is the field
  # that makes "IDs never restart between cycles" mechanically true, not just a
  # convention someone has to remember.
  BR: 0
  REQ: 0
  US: 0
  UC: 0
  ENT: 0
  TBL: 0
  ARCH: 0
  API: 0
  SEC: 0
  TEST: 0
  TASK: 0
  ADR: 0
  RISK: 0
  CR: 0

active_cycle_id: 1
# Which entry in `cycles` below is currently being worked on. Exactly one
# active cycle at a time — see SKILL.md's three entry states.

cycles:
  - id: 1
    scope: "Initial full build"
    # Cycle 1 is always the original end-to-end flow (phases 00-17).
    # Cycle 2+ are incremental additions opened by playbooks/00-project-calibration.md
    # in incremental mode, only once the prior cycle reached ready_for_implementation: true.
    author: "Alice"
    # Who confirmed this cycle's answers — asked once per cycle (initial AND every
    # incremental cycle, never re-inherited from a prior cycle) in
    # playbooks/00-project-calibration.md. Different cycles may have different
    # authors when more than one person uses the Skill on the same project over
    # time. Populates every artifact created during this cycle's Author metadata-
    # line key automatically (rules/document-format.md, rules/versioning.md).
    started_at: "2026-07-13T10:00:00Z"
    ready_for_implementation: false
    ready_for_implementation_at: null
    # Set to true, with a timestamp, only after phase 17 (Review) gets explicit
    # final sign-off from the user. This is what SKILL.md checks before allowing
    # any code generation, and what triggers the "new cycle?" prompt on a later run.
    phases:
      - phase_id: "00"
        name: "project-calibration"
        status: "completed"
        # "pending" | "in_progress" | "completed" | "skipped"
        approved_at: "2026-07-13T10:05:00Z"
        skip_reason: null
        # Required (non-null) whenever status is "skipped" — a phase is never
        # skipped without a recorded reason confirmed by the user.
        next_pending_question: null
        # Only meaningful when status is "in_progress". Must be specific enough
        # to resume the exact question, mid-phase, without re-asking anything
        # already confirmed — including partial progress within an Agile-mode batch.
      # One entry per phase the Skill has reached so far, in order. A phase not
      # yet reached simply has no entry yet — it is not pre-listed as "pending".

documents:
  - path: "docs/01-discovery/vision.md"
    template: "templates/vision.md"
    status: "draft"
    # "draft" | "approved"
    cycle_id: 1
  - path: "docs/03-requirements/requirements.md"
    template: "templates/requirements.md"
    status: "approved"
    cycle_id: 1
    # For a category that splits into an index + item files (rules/document-
    # locations.md — Requirements, User Stories, Use Cases, Domain Model,
    # Database Design, Architecture, API Design, Security, Testing, Backlog),
    # this one entry represents the WHOLE category, tracked at the index
    # file's path. There is no separate documents[] entry per req-XXX.md.
    # No per-document version counter — see `changelog` below; the whole
    # documentation set shares one docs_version.

change_requests:
  - id: "CR-001"
    artifact_ids: ["REQ-014"]
    reason: "..."
    impact_list:
      - document: "docs/04-user-stories/user-stories.md"
        status: "pending_reapproval"
        # "pending_reapproval" | "reapproved"
    opened_at: "..."
    closed_at: null
    # A CR closes only once every item on its impact_list is reapproved.
    # See rules/change-management.md.

changelog:
  - version: "1.0.0"
    author: "Alice"
    date: "2026-07-13"
    description: "Initial calibration confirmed"
    cycle_id: 1
    cr_id: null
  - version: "1.1.0"
    author: "Alice"
    date: "2026-07-14"
    description: "Added REQ-001, REQ-002, REQ-003"
    cycle_id: 1
    cr_id: null
  # Mirrors docs/CHANGELOG.md 1:1, same reason change_requests above mirrors
  # docs/change-requests/CR-XXX.md — the Skill needs a machine-readable copy
  # to resume correctly without re-parsing a markdown table. Write both
  # together, in the same step, every time (rules/versioning.md). Exactly
  # one of cycle_id/cr_id is set per entry — cycle_id for a phase-completion
  # entry (Minor), cr_id for a Change-Request-closure entry (Major/Patch).
  # scripts/validate-versioning.mjs checks this array and the markdown file
  # never drift apart.
```

## Notes for whoever fills this in

- **Resuming a project**: read `active_cycle_id`, find that cycle's last phase entry with `status: in_progress`, and go straight to `next_pending_question`. Nothing before that point should be re-asked.
- **A fully implemented project, new request**: if the active cycle's `ready_for_implementation` is `true` and the user wants something new, do not edit that cycle — open a new one (see `playbooks/00-project-calibration.md`, incremental mode) and set `active_cycle_id` to the new cycle's `id`.
- **Never hand-edit `id_sequences` backward.** It only increases. If an artifact is deprecated, its ID stays reserved (`rules/id-conventions.md`) — the sequence number is not reclaimed.
