---
skill_version: "0.1.0"

language: "en"
language_history:
  - language: "en"
    changed_at: "2026-05-05T09:00:00Z"
    reason: "initial calibration"

confirmation_mode: "strict"
confirmation_mode_history:
  - mode: "strict"
    changed_at: "2026-05-05T09:00:00Z"

documentation_depth: "fully_dressed"
documentation_depth_history:
  - depth: "fully_dressed"
    changed_at: "2026-05-05T09:00:00Z"

id_sequences:
  BR: 2
  REQ: 4
  US: 2
  UC: 2
  ENT: 4
  TBL: 4
  ARCH: 3
  API: 2
  SEC: 2
  TEST: 4
  TASK: 5
  ADR: 2
  RISK: 1
  CR: 0

active_cycle_id: 1

cycles:
  - id: 1
    scope: "Initial full build — TaskFlow MVP (task creation, listing/filtering, multi-tenant isolation)"
    started_at: "2026-05-05T09:00:00Z"
    ready_for_implementation: true
    ready_for_implementation_at: "2026-05-20T15:00:00Z"
    phases:
      - phase_id: "00"
        name: "project-calibration"
        status: "completed"
        approved_at: "2026-05-05T09:20:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "01"
        name: "discovery"
        status: "completed"
        approved_at: "2026-05-05T10:30:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "02"
        name: "business-analysis"
        status: "completed"
        approved_at: "2026-05-06T11:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "03"
        name: "requirements-engineering"
        status: "completed"
        approved_at: "2026-05-07T16:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "04"
        name: "user-stories"
        status: "completed"
        approved_at: "2026-05-08T10:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "05"
        name: "use-cases"
        status: "completed"
        approved_at: "2026-05-08T15:30:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "06"
        name: "domain-model"
        status: "completed"
        approved_at: "2026-05-09T14:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "07"
        name: "database-design"
        status: "completed"
        approved_at: "2026-05-10T09:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "08"
        name: "architecture"
        status: "completed"
        approved_at: "2026-05-12T17:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "09"
        name: "api-design"
        status: "completed"
        approved_at: "2026-05-13T13:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "10"
        name: "frontend-planning"
        status: "completed"
        approved_at: "2026-05-13T17:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "11"
        name: "security"
        status: "completed"
        approved_at: "2026-05-14T16:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "12"
        name: "testing"
        status: "completed"
        approved_at: "2026-05-15T11:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "13"
        name: "deployment"
        status: "completed"
        approved_at: "2026-05-16T10:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "14"
        name: "roadmap"
        status: "completed"
        approved_at: "2026-05-18T09:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "15"
        name: "backlog"
        status: "completed"
        approved_at: "2026-05-18T14:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "16"
        name: "implementation-plan"
        status: "completed"
        approved_at: "2026-05-19T11:00:00Z"
        skip_reason: null
        next_pending_question: null
      - phase_id: "17"
        name: "review"
        status: "completed"
        approved_at: "2026-05-20T15:00:00Z"
        skip_reason: null
        next_pending_question: null

documents:
  - path: "docs/01-discovery/vision.md"
    template: "templates/vision.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/02-business-analysis/business-analysis.md"
    template: "templates/business-analysis.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/03-requirements/requirements.md"
    template: "templates/requirements.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/04-user-stories/user-stories.md"
    template: "templates/user-stories.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/05-use-cases/use-cases.md"
    template: "templates/use-cases.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/06-domain-model/domain-model.md"
    template: "templates/domain-model.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/07-database-design/database.md"
    template: "templates/database.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/08-architecture/architecture.md"
    template: "templates/architecture.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/09-api-design/api.md"
    template: "templates/api.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/10-frontend-planning/frontend.md"
    template: "templates/frontend.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/11-security/security.md"
    template: "templates/security.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/12-testing/testing.md"
    template: "templates/testing.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/13-deployment/deployment.md"
    template: "templates/deployment.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/14-roadmap/roadmap.md"
    template: "templates/roadmap.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/15-backlog/backlog.md"
    template: "templates/backlog.md"
    status: "approved"
    version: 1
    cycle_id: 1
  - path: "docs/16-implementation-plan/implementation-plan.md"
    template: "templates/implementation-plan.md"
    status: "approved"
    version: 1
    cycle_id: 1

change_requests: []
---
