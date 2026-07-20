#!/usr/bin/env node
// Regression test for the Skill package itself: runs validate-ids,
// validate-traceability, validate-versioning, validate-tone,
// validate-heading-language, and validate-export-labels against the
// two worked examples in examples/ and fails (non-zero exit) if any
// isn't clean. Lets an edit to any playbook/template be checked
// quickly without re-running the whole Skill by hand.
//
// examples/ is intentionally absent from the main branch — it lives on
// the `with-examples` branch only, so `npx skills add` (which installs
// whatever's on main) never pulls two full worked projects onto a
// user's disk just to use the Skill. Run this script against the
// `with-examples` branch to actually exercise it; on main, every
// example reports SKIPPED by design, not as a bug.
//
// Usage: node self-test.mjs

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validateIds } from './validate-ids.mjs';
import { validateTraceability } from './validate-traceability.mjs';
import { validateAuthorPresence, validateVersioning } from './validate-versioning.mjs';
import { validateTone } from './validate-tone.mjs';
import { validateHeadingLanguage } from './validate-heading-language.mjs';
import { validateExportLabels } from './validate-export-labels.mjs';
import { buildProjectIndex } from './lib/docs.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = dirname(SCRIPT_DIR);

const EXAMPLES = ['small-cli-tool', 'saas-multi-tenant'];

function testExample(name) {
  const projectRoot = join(SKILL_ROOT, 'examples', name);
  // Check for project-state.md specifically, not just the docs/
  // directory — the directory tree is scaffolded ahead of content
  // during construction, and an empty docs/ tree would otherwise
  // "pass" trivially (zero artifacts, zero violations), which is false
  // confidence, not a real clean bill of health.
  if (!existsSync(join(projectRoot, 'docs', 'project-state.md'))) {
    return { name, skipped: true, reason: `${projectRoot}/docs/project-state.md not found — examples/ lives on the 'with-examples' branch only; switch branches to actually run this check` };
  }
  // Zero artifacts found is the same false-positive-clean risk as an
  // empty docs/ tree — most commonly means the example's documents
  // still carry a YAML front-matter block instead of the current
  // heading+metadata-line convention (rules/document-format.md), not
  // that the project genuinely has nothing to check.
  const { artifacts } = buildProjectIndex(projectRoot);
  if (artifacts.length === 0) {
    return { name, skipped: true, reason: `${projectRoot} has project-state.md but zero artifacts were found — check whether its documents still carry a YAML front-matter block instead of the current heading+metadata-line convention (rules/document-format.md)` };
  }
  const idViolations = validateIds(projectRoot);
  const { violations: traceViolations } = validateTraceability(projectRoot);
  const versioningViolations = [...validateAuthorPresence(projectRoot), ...validateVersioning(projectRoot)];
  const toneViolations = validateTone(projectRoot);
  const headingLanguageViolations = validateHeadingLanguage(projectRoot);
  const exportLabelsViolations = validateExportLabels(projectRoot);
  return { name, skipped: false, idViolations, traceViolations, versioningViolations, toneViolations, headingLanguageViolations, exportLabelsViolations };
}

function main() {
  let anyFailed = false;
  let anySkipped = false;

  for (const name of EXAMPLES) {
    const result = testExample(name);
    console.log(`=== ${name} ===`);
    if (result.skipped) {
      console.log(`  SKIPPED: ${result.reason}`);
      anySkipped = true;
      continue;
    }
    if (result.idViolations.length === 0 && result.traceViolations.length === 0 && result.versioningViolations.length === 0 && result.toneViolations.length === 0 && result.headingLanguageViolations.length === 0 && result.exportLabelsViolations.length === 0) {
      console.log('  OK — clean');
    } else {
      anyFailed = true;
      for (const v of result.idViolations) console.log(`  [id] ${v.message}`);
      for (const v of result.traceViolations) console.log(`  [traceability] ${v.message}`);
      for (const v of result.versioningViolations) console.log(`  [versioning] ${v.message}`);
      for (const v of result.toneViolations) console.log(`  [tone] ${v.path}: ${v.message}`);
      for (const v of result.headingLanguageViolations) console.log(`  [heading-language] ${v.path}: ${v.message}`);
      for (const v of result.exportLabelsViolations) console.log(`  [export-labels] ${v.message}`);
    }
    console.log('');
  }

  if (anyFailed) {
    console.log('self-test: FAILED — one or more examples are not clean.');
    process.exit(1);
  }
  if (anySkipped) {
    console.log("self-test: INCOMPLETE on this branch — examples/ isn't here (by design; see the 'with-examples' branch). Not a failure.");
    process.exit(0);
  }
  console.log('self-test: OK — both examples clean.');
  process.exit(0);
}

main();
