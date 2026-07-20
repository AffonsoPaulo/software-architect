#!/usr/bin/env node
// Validates rules/language-policy.md's requirement that a document's
// structural headings AND table column headers follow the project's
// confirmed language, not just its prose — checked mechanically because
// prose guidance alone (however explicit) has empirically failed to be
// followed in practice on real projects: section headings stayed in
// English despite language: "pt" and every paragraph underneath being
// correctly translated (Review Report's own title, Change Requests'
// "What changed"/"Why"), and a translated heading has sat directly
// above an untranslated table header row copied verbatim from a
// template's own example (Vision's "Stakeholder profiles" table).
//
// Scope: the fixed, template-mandated section headings and table
// headers only (a template's own "## Structure" example) — never a
// placeholder example within it ("### <Process name>", "### Milestone
// 1 — MVP") or a project-specific item heading (a real screen's own
// name, a real milestone's own name), since those are supposed to vary
// per project and can coincidentally be English words for legitimate
// reasons.
//
// Usage: node validate-heading-language.mjs [project-root]
// Can also be imported: import { validateHeadingLanguage } from './validate-heading-language.mjs'

import { isMainModule } from './lib/cli.mjs';
import { loadAllDocuments, loadProjectState } from './lib/docs.mjs';

// One entry per phase whose main/index document has fixed section
// headings dictated by its own template (templates/<file>.md's own
// "## Structure" block) — English is always what's shown there; a
// project confirmed in any other language is expected to translate
// every one of these, per rules/language-policy.md.
const TEMPLATE_HEADINGS = [
  { path: 'docs/00-calibration/calibration.md', headings: ['Project Calibration', 'Phase inclusion'] },
  { path: 'docs/01-discovery/vision.md', headings: ['Vision', 'Problem', 'Target audience', 'Current state', 'Business objective', 'Success criteria', 'Constraints', 'Out of scope', 'Stakeholder profiles', 'Business opportunity', 'Success metrics', 'Assumptions and dependencies', 'Business-level risks'] },
  { path: 'docs/02-business-analysis/business-analysis.md', headings: ['Business Analysis', 'Business processes'] },
  { path: 'docs/03-requirements/requirements.md', headings: ['Requirements'] },
  { path: 'docs/04-user-stories/user-stories.md', headings: ['User Stories'] },
  { path: 'docs/05-use-cases/use-cases.md', headings: ['Use Cases'] },
  { path: 'docs/06-domain-model/domain-model.md', headings: ['Domain Model', 'Aggregates', 'Relationships'] },
  { path: 'docs/07-database-design/database.md', headings: ['Database Design', 'Database type', 'Migration strategy'] },
  { path: 'docs/08-architecture/architecture.md', headings: ['Architecture', 'Architectural style', 'Architectural pattern', 'Core technologies', 'Non-functional requirement coverage', 'Interaction style guidance'] },
  { path: 'docs/09-api-design/api.md', headings: ['API Design', 'Interaction style', 'Versioning strategy', 'Failure format'] },
  { path: 'docs/10-frontend-planning/frontend.md', headings: ['Frontend Planning', 'State management', 'Design system', 'Target platforms', 'Screens', 'Navigation'] },
  { path: 'docs/11-security/security.md', headings: ['Security', 'Threat model', 'Authentication and authorization', 'Data classification', 'Compliance', 'Secrets strategy', 'Controls'] },
  { path: 'docs/12-testing/testing.md', headings: ['Testing', 'Test levels', 'Coverage target', 'Test data strategy'] },
  { path: 'docs/13-deployment/deployment.md', headings: ['Deployment', 'Environments', 'Provider/infrastructure', 'CI/CD pipeline'] },
  { path: 'docs/14-roadmap/roadmap.md', headings: ['Roadmap', 'Milestones', 'Deferred'] },
  { path: 'docs/15-backlog/backlog.md', headings: ['Backlog', 'Definition of Ready', 'Items by milestone'] },
  { path: 'docs/16-implementation-plan/implementation-plan.md', headings: ['Implementation Plan', 'Definition of Done', 'Sequence'] },
  // Phase 17 has no separate templates/ file — its document shape is
  // defined directly in playbooks/17-review.md's "Documents produced".
  // Its own H1 ("# Review Report — Cycle 1") carries a per-cycle number
  // no fixed list can enumerate, so it's matched by prefix instead of
  // exact text — the only entry that needs this.
  { path: 'docs/17-review/review-report.md', headings: ['Structural check (scriptable)', 'Semantic conflict scan (judgment)', 'Outstanding items from prior gates', 'Verdict'], headingPrefixes: ['Review Report'] },
];

// Change Requests are one file per CR (docs/change-requests/CR-XXX.md,
// rules/document-locations.md) — checked across every file in that
// directory, not one fixed path, since there's one per CR rather than
// one shared index. The CR's own H1 ("# CR-001 — <short title>") is
// project-specific text, so only the fixed subheadings below it are
// checked (templates/change-request.md).
const CHANGE_REQUEST_DIR_RE = /^docs\/change-requests\/.+\.md$/;
const CHANGE_REQUEST_HEADINGS = ['What changed', 'Why', 'Impact list', 'Business justification', 'Rollback plan'];

// Known fixed table header rows across every template — a named-column
// table (rules/document-format.md's "Two shapes of table") or a
// `Field`/`Value` shell table. Checked project-wide rather than scoped
// to one path per entry, since several of these live inside item files
// (uc-XXX.md's Alternative/exception flows, CR-XXX.md's Impact list),
// not a phase's single index file. Matched as a full row (every cell,
// in order) rather than by individual word, to keep false positives
// near zero — a project-specific table that happens to reuse one
// column name (e.g. "Status") never matches unless every cell in that
// row matches too.
const TABLE_HEADER_ROWS = [
  ['ID', 'Trigger', 'Traces to'],
  ['Field', 'Value'],
  ['Condition', 'Response'],
  ['ID', 'Component', 'Traces to', 'ADR'],
  ['REQ-XXX (NFR)', 'Addressed by'],
  ['Step', 'Responsible', 'Accountable', 'Consulted', 'Informed'],
  ['Phase', 'Status', 'Reason'],
  ['Document', 'Artifacts affected', 'Status'],
  ['Version', 'Author', 'Date', 'Description'],
  ['ID', 'Table', 'Traces to'],
  ['Column', 'Type', 'Constraints'],
  ['Table.Column', 'Business meaning'],
  ['ID', 'Name', 'Kind', 'Belongs to aggregate', 'Traces to'],
  ['Attribute', 'Meaning'],
  ['Term', 'Meaning'],
  ['State', 'What the user sees'],
  ['Task', 'Depends on', 'Parallelizable with'],
  ['Task', 'Depends on', 'Parallelizable with', 'Owner', 'Estimate'],
  ['ID', 'Title', 'Type', 'Priority', 'Traces to'],
  ['ID', 'Title', 'Source', 'Status', 'Traces to'],
  ['Threat', 'Category', 'Mitigation'],
  ['Data', 'Classification', 'Handling'],
  ['ID', 'Title', 'Traces to'],
  ['Threat', 'STRIDE category', 'Mitigation'],
  ['Regime', 'Article/control', 'Addressed by'],
  ['ID', 'Title', 'Level', 'Kind', 'Traces to'],
  ['Step', 'Condition', 'Result'],
  ['Stakeholder', 'Interest'],
  ['Stakeholder group', 'Cares about', 'Success looks like'],
  ['Metric', 'Baseline', 'Target', 'Measured'],
];

const HEADING_RE = /^#{1,6}\s+(.*)$/gm;
// A table header row followed immediately by its separator row
// (`|---|---|`) — the separator is what distinguishes a real header
// from an ordinary line of prose that happens to contain pipes.
const TABLE_ROW_RE = /^\|(.+)\|\s*$\n^\|(?:\s*:?-+:?\s*\|)+\s*$/gm;

function checkHeadings(path, content, bannedSet, bannedPrefixes, violations, language) {
  let m;
  HEADING_RE.lastIndex = 0;
  while ((m = HEADING_RE.exec(content))) {
    const text = m[1].trim();
    const isBanned = bannedSet.has(text)
      || (bannedPrefixes && bannedPrefixes.some((p) => text === p || text.startsWith(`${p} `)));
    if (isBanned) {
      violations.push({
        type: 'untranslated-heading',
        path,
        message: `heading "${text}" is still the template's literal English text — project language is "${language}", so this section heading should be translated (rules/language-policy.md)`,
      });
    }
  }
}

function checkTableHeaders(path, content, violations, language) {
  let m;
  TABLE_ROW_RE.lastIndex = 0;
  while ((m = TABLE_ROW_RE.exec(content))) {
    const cells = m[1].split('|').map((c) => c.trim());
    for (const row of TABLE_HEADER_ROWS) {
      if (cells.length === row.length && cells.every((c, idx) => c === row[idx])) {
        violations.push({
          type: 'untranslated-table-header',
          path,
          message: `table header "| ${cells.join(' | ')} |" is still the template's literal English text — project language is "${language}", so these column headers should be translated (rules/language-policy.md, rules/document-format.md)`,
        });
        break;
      }
    }
  }
}

export function validateHeadingLanguage(projectRoot) {
  const projectState = loadProjectState(projectRoot);
  if (!projectState) return [];

  const language = projectState.language;
  if (!language || language === 'en') return []; // nothing to check — English is the template's own language

  const violations = [];
  const docs = loadAllDocuments(projectRoot);
  const docByPath = new Map(docs.map((d) => [d.path.replace(/\\/g, '/'), d.content]));

  for (const { path, headings, headingPrefixes } of TEMPLATE_HEADINGS) {
    const content = docByPath.get(path);
    if (content === undefined) continue; // phase not reached / skipped yet
    checkHeadings(path, content, new Set(headings), headingPrefixes, violations, language);
  }

  const crBannedSet = new Set(CHANGE_REQUEST_HEADINGS);
  for (const d of docs) {
    const path = d.path.replace(/\\/g, '/');
    if (CHANGE_REQUEST_DIR_RE.test(path)) {
      checkHeadings(path, d.content, crBannedSet, null, violations, language);
    }
  }

  for (const d of docs) {
    const path = d.path.replace(/\\/g, '/');
    if (d.isProjectState) continue; // English regardless of language, rules/document-format.md
    checkTableHeaders(path, d.content, violations, language);
  }

  return violations;
}

function main() {
  const projectRoot = process.argv[2] || process.cwd();
  const violations = validateHeadingLanguage(projectRoot);
  if (violations.length === 0) {
    console.log('validate-heading-language: OK — no violations found');
    process.exit(0);
  }
  console.log(`validate-heading-language: ${violations.length} violation(s) found\n`);
  for (const v of violations) {
    console.log(`  [${v.type}] ${v.path}: ${v.message}`);
  }
  process.exit(1);
}

if (isMainModule(import.meta.url)) {
  main();
}
