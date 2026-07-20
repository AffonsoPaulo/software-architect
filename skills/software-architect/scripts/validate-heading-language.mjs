#!/usr/bin/env node
// Validates rules/language-policy.md's requirement that a document's
// structural headings follow the project's confirmed language, not
// just its prose — checked mechanically because prose guidance alone
// (however explicit) has empirically failed to be followed in practice
// on at least one real project: every heading stayed in English despite
// language: "pt" and every paragraph underneath being correctly
// translated.
//
// Scope: the fixed, template-mandated section headings only (a
// template's own "## Structure" example) — never a placeholder example
// within it ("### <Process name>", "### Milestone 1 — MVP") or a
// project-specific item heading (a real screen's own name, a real
// milestone's own name), since those are supposed to vary per project
// and can coincidentally be English words for legitimate reasons.
//
// Usage: node validate-heading-language.mjs [project-root]
// Can also be imported: import { validateHeadingLanguage } from './validate-heading-language.mjs'

import { join } from 'node:path';
import { readIfExists } from './lib/doc-tree.mjs';
import { loadProjectState } from './lib/docs.mjs';
import { isMainModule } from './lib/cli.mjs';

// One entry per phase whose main/index document has fixed section
// headings dictated by its own template (templates/<file>.md's own
// "## Structure" block) — English is always what's shown there; a
// project confirmed in any other language is expected to translate
// every one of these, per rules/language-policy.md.
const TEMPLATE_HEADINGS = [
  { path: '00-calibration/calibration.md', headings: ['Project Calibration', 'Phase inclusion'] },
  { path: '01-discovery/vision.md', headings: ['Vision', 'Problem', 'Target audience', 'Current state', 'Business objective', 'Success criteria', 'Constraints', 'Out of scope'] },
  { path: '02-business-analysis/business-analysis.md', headings: ['Business Analysis', 'Business processes'] },
  { path: '03-requirements/requirements.md', headings: ['Requirements'] },
  { path: '04-user-stories/user-stories.md', headings: ['User Stories'] },
  { path: '05-use-cases/use-cases.md', headings: ['Use Cases'] },
  { path: '06-domain-model/domain-model.md', headings: ['Domain Model', 'Aggregates', 'Relationships'] },
  { path: '07-database-design/database.md', headings: ['Database Design', 'Database type', 'Migration strategy'] },
  { path: '08-architecture/architecture.md', headings: ['Architecture', 'Architectural style', 'Architectural pattern', 'Core technologies', 'Non-functional requirement coverage', 'Interaction style guidance'] },
  { path: '09-api-design/api.md', headings: ['API Design', 'Interaction style', 'Versioning strategy', 'Failure format'] },
  { path: '10-frontend-planning/frontend.md', headings: ['Frontend Planning', 'State management', 'Design system', 'Target platforms', 'Screens', 'Navigation'] },
  { path: '11-security/security.md', headings: ['Security', 'Threat model', 'Authentication and authorization', 'Data classification', 'Compliance', 'Secrets strategy', 'Controls'] },
  { path: '12-testing/testing.md', headings: ['Testing', 'Test levels', 'Coverage target', 'Test data strategy'] },
  { path: '13-deployment/deployment.md', headings: ['Deployment', 'Environments', 'Provider/infrastructure', 'CI/CD pipeline'] },
  { path: '14-roadmap/roadmap.md', headings: ['Roadmap', 'Milestones', 'Deferred'] },
  { path: '15-backlog/backlog.md', headings: ['Backlog', 'Definition of Ready', 'Items by milestone'] },
  { path: '16-implementation-plan/implementation-plan.md', headings: ['Implementation Plan', 'Definition of Done', 'Sequence'] },
];

const HEADING_RE = /^#{1,6}\s+(.*)$/gm;

export function validateHeadingLanguage(projectRoot) {
  const projectState = loadProjectState(projectRoot);
  if (!projectState) return [];

  const language = projectState.language;
  if (!language || language === 'en') return []; // nothing to check — English is the template's own language

  const violations = [];
  for (const { path, headings } of TEMPLATE_HEADINGS) {
    const content = readIfExists(join(projectRoot, 'docs', path));
    if (content === null) continue; // phase not reached / skipped yet

    const bannedSet = new Set(headings);
    let m;
    HEADING_RE.lastIndex = 0;
    while ((m = HEADING_RE.exec(content))) {
      const text = m[1].trim();
      if (bannedSet.has(text)) {
        violations.push({
          type: 'untranslated-heading',
          path: `docs/${path}`,
          message: `heading "${text}" is still the template's literal English text — project language is "${language}", so this section heading should be translated (rules/language-policy.md)`,
        });
      }
    }
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
