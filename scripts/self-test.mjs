#!/usr/bin/env node
// Regression test for the Skill package itself: runs validate-ids and
// validate-traceability against the two worked examples in examples/
// and fails (non-zero exit) if either isn't clean. Lets an edit to any
// playbook/template be checked quickly without re-running the whole
// Skill by hand.
//
// Usage: node self-test.mjs

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validateIds } from './validate-ids.mjs';
import { validateTraceability } from './validate-traceability.mjs';

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
    return { name, skipped: true, reason: `${projectRoot}/docs/project-state.md not found — example not populated yet (see plan-24)` };
  }
  const idViolations = validateIds(projectRoot);
  const { violations: traceViolations } = validateTraceability(projectRoot);
  return { name, skipped: false, idViolations, traceViolations };
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
    if (result.idViolations.length === 0 && result.traceViolations.length === 0) {
      console.log('  OK — clean');
    } else {
      anyFailed = true;
      for (const v of result.idViolations) console.log(`  [id] ${v.message}`);
      for (const v of result.traceViolations) console.log(`  [traceability] ${v.message}`);
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
