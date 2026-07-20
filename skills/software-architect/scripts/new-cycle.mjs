#!/usr/bin/env node
// Safely appends a new incremental cycle to a target project's
// docs/project-state.md and repoints active_cycle_id at it — the
// mechanical part of playbooks/00-project-calibration.md's incremental
// mode, factored out because it's the single most error-prone
// hand-edit of this file: computing the next cycle id correctly, never
// touching id_sequences, initializing ready_for_implementation/
// ready_for_implementation_at/phases consistently, and keeping
// active_cycle_id in sync — all easy to get subtly wrong typing YAML
// by hand, a silent-failure class this script exists to prevent.
//
// Deliberately a targeted text insertion, not a parse-mutate-serialize
// round trip: project-state.md's inline comments (its main affordance
// for a future session reading it) would not survive being rebuilt
// from a parsed object, since parseYamlLite discards comments on read.
// This only touches the two things that actually need to change —
// everything else in the file is untouched, byte for byte.
//
// This does not ask or decide anything — scope and author are already
// confirmed conversationally, per confirmation-protocol.md, before this
// runs; this only applies what was already confirmed, mechanically.
//
// Usage:
//   node new-cycle.mjs <project-root> --scope "<scope>" --author "<author>"
// Can also be imported: `import { createNewCycle } from './new-cycle.mjs'`

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseYamlLite } from './lib/yaml-lite.mjs';
import { isMainModule } from './lib/cli.mjs';

function parseArgs(argv) {
  const args = { projectRoot: undefined, scope: undefined, author: undefined };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--scope') { args.scope = argv[++i]; continue; }
    if (a === '--author') { args.author = argv[++i]; continue; }
    positional.push(a);
  }
  args.projectRoot = positional[0] || process.cwd();
  return args;
}

// Finds [startLine, endLine) of the `cycles:` block (the list itself,
// not including the `cycles:` key line) — endLine is either the next
// zero-indent key or end of file.
function findCyclesBlock(lines) {
  const startIdx = lines.findIndex((l) => /^cycles:\s*$/.test(l));
  if (startIdx === -1) return null;
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (/^\S/.test(lines[i])) { endIdx = i; break; }
  }
  return { startIdx, endIdx };
}

function buildCycleBlock(id, scope, author, startedAt) {
  const escapedScope = scope.replace(/"/g, '\\"');
  const escapedAuthor = author.replace(/"/g, '\\"');
  return [
    `  - id: ${id}`,
    `    scope: "${escapedScope}"`,
    `    author: "${escapedAuthor}"`,
    `    started_at: "${startedAt}"`,
    `    ready_for_implementation: false`,
    `    ready_for_implementation_at: null`,
    `    phases: []`,
    `    # Filled in as this cycle's phases are reached, exactly like any other`,
    `    # cycle — this script only creates the cycle itself, not phase entries.`,
  ];
}

export function createNewCycle(projectRoot, scope, author) {
  if (!scope || !scope.trim()) throw new Error('--scope is required and must be non-empty');
  if (!author || !author.trim()) throw new Error('--author is required and must be non-empty');

  const path = join(projectRoot, 'docs', 'project-state.md');
  if (!existsSync(path)) throw new Error(`${path} not found`);

  const content = readFileSync(path, 'utf8');
  const data = parseYamlLite(content);

  const cycles = Array.isArray(data.cycles) ? data.cycles : [];
  if (cycles.length === 0) throw new Error('project-state.md has no existing cycles[] — this script only appends an incremental cycle to an already-initialized project');

  const activeCycle = cycles.find((c) => c && c.id === data.active_cycle_id);
  if (!activeCycle) throw new Error(`active_cycle_id (${data.active_cycle_id}) does not match any cycle in cycles[] — refusing to guess which cycle is actually active`);
  if (activeCycle.ready_for_implementation !== true) {
    throw new Error(
      `Active cycle ${data.active_cycle_id} has not reached ready_for_implementation: true yet — a new cycle is only opened once the current one is actually done (SKILL.md's state 3). If this cycle is genuinely finished, its own ready_for_implementation flag needs setting first, via phase 17, not by this script.`
    );
  }

  const maxId = Math.max(...cycles.map((c) => (c && typeof c.id === 'number' ? c.id : -Infinity)));
  const newId = maxId + 1;
  const startedAt = new Date().toISOString();

  const lines = content.split('\n');
  const block = findCyclesBlock(lines);
  if (!block) throw new Error('Could not find a `cycles:` key in project-state.md — file may not match the expected template shape');

  const newCycleLines = buildCycleBlock(newId, scope.trim(), author.trim(), startedAt);
  const updatedLines = [
    ...lines.slice(0, block.endIdx),
    ...newCycleLines,
    ...lines.slice(block.endIdx),
  ];

  let newContent = updatedLines.join('\n');
  // [ \t]*, never \s* — \s matches newlines too, and a greedy \s* right
  // before `$` here would swallow the blank line that conventionally
  // follows this field in the template, collapsing it into the next
  // line instead of just replacing the number in place.
  const activeCycleRe = /^active_cycle_id:[ \t]*\d+[ \t]*$/m;
  if (!activeCycleRe.test(newContent)) {
    throw new Error('Could not find a top-level `active_cycle_id: <number>` line to update — file may not match the expected template shape');
  }
  newContent = newContent.replace(activeCycleRe, `active_cycle_id: ${newId}`);

  writeFileSync(path, newContent, 'utf8');

  return { newId, scope: scope.trim(), author: author.trim(), startedAt, cycleBlock: newCycleLines.join('\n') };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  try {
    const result = createNewCycle(args.projectRoot, args.scope, args.author);
    console.log(`new-cycle: appended cycle ${result.newId} and set active_cycle_id to ${result.newId}.\n`);
    console.log('Inserted block:');
    console.log(result.cycleBlock);
    console.log('\nRun scripts/validate-ids.mjs and scripts/validate-versioning.mjs against this project next, to confirm the file is still well-formed.');
  } catch (err) {
    console.error(`new-cycle: ${err.message}`);
    process.exit(1);
  }
}

if (isMainModule(import.meta.url)) {
  main();
}
