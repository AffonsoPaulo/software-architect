// Shared "was this file run directly?" check for every script in this
// directory that's both importable (for self-test.mjs and each other)
// and directly runnable (`node scripts/validate-ids.mjs`).
//
// The naive version of this idiom —
//   import.meta.url === `file://${process.argv[1]}`
// — breaks silently whenever the script is invoked through a symlink
// (an `npx skills` install layout, a PATH shim, a project script that
// symlinks into node_modules/.bin-style tooling): Node's ESM loader
// resolves import.meta.url to the real, symlink-resolved path, but
// process.argv[1] stays exactly as typed on the command line. The two
// never match, main() never runs, and the process exits 0 with no
// output and no error — indistinguishable from "ran and found nothing
// wrong" unless you already know to suspect this.
//
// Resolving argv[1] through the filesystem before comparing fixes it
// for both symlinked and direct invocations.

import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function isMainModule(moduleUrl) {
  if (!process.argv[1]) return false;
  try {
    return fileURLToPath(moduleUrl) === realpathSync(process.argv[1]);
  } catch {
    return false;
  }
}
