#!/usr/bin/env node
// Regression test for the Skill package itself: runs validate-ids,
// validate-traceability, and validate-versioning against the two worked
// examples in examples/ and fails (non-zero exit) if any isn't clean.
// Lets an edit to any playbook/template be checked quickly without
// re-running the whole Skill by hand.
//
// Usage: node self-test.mjs

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validateIds } from './validate-ids.mjs';
import { validateTraceability } from './validate-traceability.mjs';
import { validateAuthorPresence, validateVersioning } from './validate-versioning.mjs';
import { buildProjectIndex } from './lib/docs.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = dirname(SCRIPT_DIR);
// examples/ lives at the repo root (sibling to skills/), not inside
// skills/software-architect/ — this branch keeps it out of what
// `npx skills add` installs (see root README.md's "Worked examples").
const REPO_ROOT = dirname(dirname(SKILL_ROOT));

const EXAMPLES = ['small-cli-tool', 'saas-multi-tenant'];

function testExample(name) {
  const projectRoot = join(REPO_ROOT, 'examples', name);
  // Check for project-state.md specifically, not just the docs/
  // directory — the directory tree is scaffolded ahead of content
  // during construction, and an empty docs/ tree would otherwise
  // "pass" trivially (zero artifacts, zero violations), which is false
  // confidence, not a real clean bill of health.
  if (!existsSync(join(projectRoot, 'docs', 'project-state.md'))) {
    return { name, skipped: true, reason: `${projectRoot}/docs/project-state.md not found — example not populated yet (see plan-24)` };
  }
  // Zero artifacts found is the same false-positive-clean risk as an
  // empty docs/ tree — most commonly means the example's documents
  // still use the retired YAML-front-matter format (rules/document-format.md)
  // and haven't been rewritten to the current heading+metadata-line
  // convention yet, not that the project genuinely has nothing to check.
  const { artifacts } = buildProjectIndex(projectRoot);
  if (artifacts.length === 0) {
    return { name, skipped: true, reason: `${projectRoot} has project-state.md but zero artifacts were found — likely still in the old document format (rules/document-format.md)` };
  }
  const idViolations = validateIds(projectRoot);
  const { violations: traceViolations } = validateTraceability(projectRoot);
  const versioningViolations = [...validateAuthorPresence(projectRoot), ...validateVersioning(projectRoot)];
  return { name, skipped: false, idViolations, traceViolations, versioningViolations };
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
    if (result.idViolations.length === 0 && result.traceViolations.length === 0 && result.versioningViolations.length === 0) {
      console.log('  OK — clean');
    } else {
      anyFailed = true;
      for (const v of result.idViolations) console.log(`  [id] ${v.message}`);
      for (const v of result.traceViolations) console.log(`  [traceability] ${v.message}`);
      for (const v of result.versioningViolations) console.log(`  [versioning] ${v.message}`);
    }
    console.log('');
  }

  if (anyFailed) {
    console.log('self-test: FAILED — one or more examples are not clean.');
    process.exit(1);
  }
  if (anySkipped) {
    console.log('self-test: INCOMPLETE — one or more examples not yet populated. Not a failure by itself, but self-test cannot fully vouch for the package until plan-24 is done.');
    process.exit(0);
  }
  console.log('self-test: OK — both examples clean.');
  process.exit(0);
}

main();
