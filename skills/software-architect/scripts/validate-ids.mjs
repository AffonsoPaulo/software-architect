#!/usr/bin/env node
// Validates artifact ID format and uniqueness across a target project's
// docs/ tree, per rules/id-conventions.md. Usage:
//   node validate-ids.mjs [project-root]
// project-root defaults to the current working directory.
//
// Can also be imported: `import { validateIds } from './validate-ids.mjs'`.

import { buildProjectIndex, prefixOf } from './lib/docs.mjs';
import { isMainModule } from './lib/cli.mjs';

// Must stay in sync with rules/id-conventions.md's prefix table.
const VALID_PREFIXES = new Set([
  'BR', 'REQ', 'US', 'UC', 'ENT', 'TBL', 'ARCH', 'API',
  'SEC', 'TEST', 'TASK', 'ADR', 'RISK', 'CR',
]);

function isWellFormed(id) {
  const m = id.match(/^([A-Z]+)-(\d+)$/);
  if (!m) return false;
  const [, prefix, digits] = m;
  if (!VALID_PREFIXES.has(prefix)) return false;
  if (digits.length < 3) return false; // zero-padded to at least 3 digits
  return true;
}

export function validateIds(projectRoot) {
  const { artifacts, byId } = buildProjectIndex(projectRoot);
  const violations = [];

  for (const a of artifacts) {
    if (!isWellFormed(a.id)) {
      const prefix = prefixOf(a.id);
      const reason = prefix && !VALID_PREFIXES.has(prefix)
        ? `unknown prefix "${prefix}" — not in rules/id-conventions.md`
        : 'not zero-padded to at least 3 digits, or malformed';
      violations.push({ type: 'malformed-id', id: a.id, path: a.path, message: `${a.id}: ${reason}` });
    }
  }

  for (const [id, occurrences] of byId.entries()) {
    if (occurrences.length > 1) {
      const paths = occurrences.map((o) => o.path).join(', ');
      violations.push({
        type: 'duplicate-id',
        id,
        path: paths,
        message: `${id}: declared ${occurrences.length} times (${paths}) — IDs must be unique project-wide, even across cycles`,
      });
    }
  }

  return violations;
}

function main() {
  const projectRoot = process.argv[2] || process.cwd();
  const violations = validateIds(projectRoot);
  if (violations.length === 0) {
    console.log('validate-ids: OK — no violations found');
    process.exit(0);
  }
  console.log(`validate-ids: ${violations.length} violation(s) found\n`);
  for (const v of violations) {
    console.log(`  [${v.type}] ${v.path}: ${v.message}`);
  }
  process.exit(1);
}

if (isMainModule(import.meta.url)) {
  main();
}
