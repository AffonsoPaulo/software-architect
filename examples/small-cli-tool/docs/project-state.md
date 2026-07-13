---
skill_version: "0.1.0"

language: "en"
language_history:
  - language: "en"
    changed_at: "2026-06-01T09:00:00Z"
    reason: "initial calibration"

confirmation_mode: "agile"
confirmation_mode_history:
  - mode: "agile"
    changed_at: "2026-06-01T09:00:00Z"

id_sequences:
  BR: 0
  REQ: 3
  US: 2
  UC: 2
  ENT: 0
  TBL: 0
  ARCH: 2
  API: 2
  SEC: 1
  TEST: 3
  TASK: 3
  ADR: 1
  RISK: 0
  CR: 0

active_cycle_id: 2

cycles:
  - id: 1
    scope: "Initial full build — CSV/JSON conversion CLI"
    started_at: "2026-06-01T09:00:00Z"
    ready_for_implementation: true
    ready_for_implementation_at: "2026-06-02T16:00:00Z"
    phases:
      - phase_id: "00"
        name: "project-calibration"
        status: "completed"
        approved_at: "2026-06-01T09:10:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "01"
        name: "discovery"
        status: "completed"
        approved_at: "2026-06-01T09:30:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "02"
        name: "business-analysis"
        status: "skipped"
        approved_at: null
        skip_reason: "No distinct business process or actors — just a developer wanting to convert files."
        next_pending_question: null
      - phase_id: "03"
        name: "requirements-engineering"
        status: "completed"
        approved_at: "2026-06-01T10:15:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "04"
        name: "user-stories"
        status: "completed"
        approved_at: "2026-06-01T10:30:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "05"
        name: "use-cases"
        status: "completed"
        approved_at: "2026-06-01T11:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "06"
        name: "domain-model"
        status: "skipped"
        approved_at: null
        skip_reason: "Pure input-to-output transformation tool; no persistent domain entities."
        next_pending_question: null
      - phase_id: "07"
        name: "database-design"
        status: "skipped"
        approved_at: null
        skip_reason: "No persistence layer at all."
        next_pending_question: null
      - phase_id: "08"
        name: "architecture"
        status: "completed"
        approved_at: "2026-06-01T13:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "09"
        name: "api-design"
        status: "completed"
        approved_at: "2026-06-01T13:30:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "10"
        name: "frontend-planning"
        status: "skipped"
        approved_at: null
        skip_reason: "No UI — CLI-only, no screens to plan."
        next_pending_question: null
      - phase_id: "11"
        name: "security"
        status: "completed"
        approved_at: "2026-06-01T14:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "12"
        name: "testing"
        status: "completed"
        approved_at: "2026-06-01T14:30:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "13"
        name: "deployment"
        status: "completed"
        approved_at: "2026-06-01T15:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "14"
        name: "roadmap"
        status: "completed"
        approved_at: "2026-06-01T15:20:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "15"
        name: "backlog"
        status: "completed"
        approved_at: "2026-06-01T15:35:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "16"
        name: "implementation-plan"
        status: "completed"
        approved_at: "2026-06-01T15:50:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "17"
        name: "review"
        status: "completed"
        approved_at: "2026-06-02T16:00:00Z"
        skip_reason: null
        next_pending_question: null
  - id: 2
    scope: "Incremental: add YAML as a supported format"
    started_at: "2026-06-10T09:00:00Z"
    ready_for_implementation: true
    ready_for_implementation_at: "2026-06-10T11:45:00Z"
    phases:
      - phase_id: "00"
        name: "project-calibration"
        status: "completed"
        approved_at: "2026-06-10T09:05:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "03"
        name: "requirements-engineering"
        status: "completed"
        approved_at: "2026-06-10T09:20:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "04"
        name: "user-stories"
        status: "completed"
        approved_at: "2026-06-10T09:30:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "05"
        name: "use-cases"
        status: "completed"
        approved_at: "2026-06-10T09:45:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "08"
        name: "architecture"
        status: "completed"
        approved_at: "2026-06-10T10:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "09"
        name: "api-design"
        status: "completed"
        approved_at: "2026-06-10T10:15:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "11"
        name: "security"
        status: "completed"
        approved_at: "2026-06-10T10:25:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "12"
        name: "testing"
        status: "completed"
        approved_at: "2026-06-10T10:35:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "14"
        name: "roadmap"
        status: "completed"
        approved_at: "2026-06-10T10:45:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "15"
        name: "backlog"
        status: "completed"
        approved_at: "2026-06-10T10:55:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "16"
        name: "implementation-plan"
        status: "completed"
        approved_at: "2026-06-10T11:05:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "17"
        name: "review"
        status: "completed"
        approved_at: "2026-06-10T11:45:00Z"
        skip_reason: null
        next_pending_question: null

documents:
  - path: "docs/01-discovery/vision.md"
    template: "templates/vision.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/03-requirements/requirements.md"
    template: "templates/requirements.md"
    status: "approved"
    version: 2
    cycle_id: 2
  - path: "docs/04-user-stories/user-stories.md"
    template: "templates/user-stories.md"
    status: "approved"
    version: 2
    cycle_id: 2
  - path: "docs/05-use-cases/use-cases.md"
    template: "templates/use-cases.md"
    status: "approved"
    version: 2
    cycle_id: 2
  - path: "docs/08-architecture/architecture.md"
    template: "templates/architecture.md"
    status: "approved"
    version: 2
    cycle_id: 2
  - path: "docs/09-api-design/api.md"
    template: "templates/api.md"
    status: "approved"
    version: 2
    cycle_id: 2
  - path: "docs/11-security/security.md"
    template: "templates/security.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/12-testing/testing.md"
    template: "templates/testing.md"
    status: "approved"
    version: 2
    cycle_id: 2
  - path: "docs/13-deployment/deployment.md"
    template: "templates/deployment.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/14-roadmap/roadmap.md"
    template: "templates/roadmap.md"
    status: "approved"
    version: 2
    cycle_id: 2
  - path: "docs/15-backlog/backlog.md"
    template: "templates/backlog.md"
    status: "approved"
    version: 2
    cycle_id: 2
  - path: "docs/16-implementation-plan/implementation-plan.md"
    template: "templates/implementation-plan.md"
    status: "approved"
    version: 2
    cycle_id: 2

change_requests: []
---
