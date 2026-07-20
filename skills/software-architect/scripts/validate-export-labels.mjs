#!/usr/bin/env node
// Validates rules/skill-drift.md's export_labels backfill requirement:
// for a non-English project, every export_labels key this Skill
// currently knows about (templates/project-state.md) must be both
// present and actually translated — not silently missing, and not
// left equal to the English default.
//
// This exists because export_labels is populated once, mechanically,
// during Calibration (playbooks/00-project-calibration.md) — a project
// calibrated before a given key existed never revisits phase 00 to
// backfill it when the Skill later adds one. Nothing crashes either
// way: build-doc-site.mjs/build-doc-word.mjs both fall back to the
// English default for a missing key, so the gap is silent rather than
// an error — exactly the failure mode this check exists to surface
// instead. Confirmed against a real project: it predates export_labels
// entirely, so every key here would be flagged if that project's
// language weren't already "en" in this repo's own worked examples.
//
// Usage: node validate-export-labels.mjs [project-root]
// Can also be imported: import { validateExportLabels } from './validate-export-labels.mjs'

import { loadProjectState } from './lib/docs.mjs';
import { isMainModule } from './lib/cli.mjs';

// Mirrors templates/project-state.md's own export_labels block exactly
// — the single source of truth for which keys exist and what their
// English default is. A key added there and not here (or vice versa)
// is itself a drift bug this file's own comment warns against
// (CLAUDE.md's "Things that silently drift if you don't update them
// together").
const KNOWN_EXPORT_LABELS = {
  table_of_contents: 'Table of Contents',
  change_requests: 'Change Requests',
  mermaid_fallback: 'Diagram source below — paste it into mermaid.live to view it rendered.',
  project_documentation: 'Project Documentation',
  copy_markdown: 'Copy markdown',
  toc_instructions: 'Right-click here and choose "Update Field" (or press F9) to generate the table of contents.',
  shell_table_field: 'Field',
  shell_table_value: 'Value',
};

export function validateExportLabels(projectRoot) {
  const projectState = loadProjectState(projectRoot);
  if (!projectState) return [];

  const language = projectState.language;
  if (!language || language === 'en') return []; // nothing to check — English is already correct

  const labels = projectState.export_labels || {};
  const violations = [];
  for (const [key, englishDefault] of Object.entries(KNOWN_EXPORT_LABELS)) {
    const value = labels[key];
    if (!value) {
      violations.push({
        type: 'missing-export-label',
        message: `export_labels.${key} is not set — every export falls back to the English default ("${englishDefault}") until this is backfilled (rules/skill-drift.md)`,
      });
    } else if (value === englishDefault) {
      violations.push({
        type: 'untranslated-export-label',
        message: `export_labels.${key} is still the English default ("${englishDefault}") — project language is "${language}", so this should be translated (rules/skill-drift.md)`,
      });
    }
  }
  return violations;
}

function main() {
  const projectRoot = process.argv[2] || process.cwd();
  const violations = validateExportLabels(projectRoot);
  if (violations.length === 0) {
    console.log('validate-export-labels: OK — no violations found');
    process.exit(0);
  }
  console.log(`validate-export-labels: ${violations.length} violation(s) found\n`);
  for (const v of violations) {
    console.log(`  [${v.type}] ${v.message}`);
  }
  process.exit(1);
}

if (isMainModule(import.meta.url)) {
  main();
}
