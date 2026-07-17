#!/usr/bin/env node
// Validates the docs_version/CHANGELOG.md/Author mechanism defined in
// rules/versioning.md: every cycle and every artifact has a non-blank
// Author, docs_version is well-formed and matches the changelog's
// newest entry, changelog[] and docs/CHANGELOG.md never drift apart,
// and every changelog entry references a real cycle or CR.
//
// This does NOT judge completeness (whether every event that "should"
// have an entry actually got one) — that's a Judgment criterion,
// rules/quality-gate-structure.md, checked at Review (phase 17), not
// something a script can know without seeing what didn't happen.
//
// Usage: node validate-versioning.mjs [project-root]
// Can also be imported:
//   import { validateAuthorPresence, validateVersioning } from './validate-versioning.mjs'

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { buildProjectIndex, loadProjectState } from './lib/docs.mjs';
import { isMainModule } from './lib/cli.mjs';

const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)$/;

function parseSemver(v) {
  const m = typeof v === 'string' ? v.match(SEMVER_RE) : null;
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

function compareSemver(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

// Every cycle needs a non-blank author; every artifact (any heading with
// an ID) needs a non-blank Author in its metadata line. The metadata-line
// parser (lib/docs.mjs) already captures arbitrary keys generically, so
// `artifact.raw.author` is available with no parser changes.
export function validateAuthorPresence(projectRoot) {
  const violations = [];
  const projectState = loadProjectState(projectRoot);

  const cycles = Array.isArray(projectState && projectState.cycles) ? projectState.cycles : [];
  for (const cycle of cycles) {
    if (!cycle || !String(cycle.author || '').trim()) {
      violations.push({
        type: 'missing-cycle-author',
        message: `cycle ${cycle && cycle.id !== undefined ? cycle.id : '(unknown)'}: no author recorded — project-state.md's cycles[].author must never be blank`,
      });
    }
  }

  const { artifacts } = buildProjectIndex(projectRoot);
  for (const a of artifacts) {
    const author = a.raw && a.raw.author;
    if (!String(author || '').trim()) {
      violations.push({
        type: 'missing-artifact-author',
        id: a.id,
        path: a.path,
        message: `${a.id} (${a.path}): no Author in the metadata line — rules/document-format.md requires one on every ID'd artifact`,
      });
    }
  }

  return violations;
}

// Parses docs/CHANGELOG.md's table into the same shape as project-state.md's
// changelog[] entries, for a direct content comparison. Table is newest-
// first by convention (templates/changelog.md); returned in that same
// (newest-first) order — callers reverse changelog[] to compare, not this.
function parseChangelogMarkdown(content) {
  const lines = content.split('\n');
  const rows = [];
  let inTable = false;
  for (const line of lines) {
    if (/^\|\s*Version\s*\|/i.test(line)) { inTable = true; continue; }
    if (inTable && /^\|\s*:?-+:?\s*\|/.test(line)) continue; // separator row
    if (inTable && /^\|.*\|\s*$/.test(line)) {
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (cells.length < 4) continue;
      rows.push({ version: cells[0], author: cells[1], date: cells[2], description: cells[3] });
      continue;
    }
    if (inTable) break; // table ended
  }
  return rows;
}

function entriesMatch(a, b) {
  return a && b
    && a.version === b.version
    && a.author === b.author
    && a.date === b.date
    && a.description === b.description;
}

export function validateVersioning(projectRoot) {
  const violations = [];
  const projectState = loadProjectState(projectRoot);
  if (!projectState) {
    return [{ type: 'missing-project-state', message: 'docs/project-state.md not found' }];
  }

  const docsVersion = projectState.docs_version;
  const docsVersionParsed = parseSemver(docsVersion);
  if (!docsVersionParsed) {
    violations.push({
      type: 'malformed-docs-version',
      message: `docs_version "${docsVersion}" is not a well-formed Major.Minor.Patch string`,
    });
  }

  const changelogYaml = Array.isArray(projectState.changelog) ? projectState.changelog : [];
  const cycleIds = new Set((Array.isArray(projectState.cycles) ? projectState.cycles : []).map((c) => c && c.id));
  const crIds = new Set((Array.isArray(projectState.change_requests) ? projectState.change_requests : []).map((c) => c && c.id));

  // Monotonicity: changelog[] is chronological (oldest first, a plain
  // append) — each entry's version must be strictly greater than the one
  // before it, and the last one must match top-level docs_version exactly.
  let prev = null;
  for (const entry of changelogYaml) {
    const parsed = parseSemver(entry && entry.version);
    if (!parsed) {
      violations.push({ type: 'malformed-changelog-version', message: `changelog entry "${entry && entry.description}" has a malformed version "${entry && entry.version}"` });
      continue;
    }
    if (prev && compareSemver(parsed, prev) <= 0) {
      violations.push({
        type: 'non-monotonic-changelog',
        message: `changelog version ${entry.version} does not strictly increase over the previous entry — changelog[] must be in chronological (oldest-first) order with strictly increasing versions`,
      });
    }
    prev = parsed;

    const hasCycle = entry.cycle_id !== null && entry.cycle_id !== undefined;
    const hasCr = entry.cr_id !== null && entry.cr_id !== undefined;
    if (hasCycle === hasCr) {
      violations.push({
        type: 'ambiguous-changelog-trigger',
        message: `changelog entry ${entry.version}: exactly one of cycle_id/cr_id must be set (phase-triggered vs. CR-triggered, rules/versioning.md), found cycle_id=${entry.cycle_id}, cr_id=${entry.cr_id}`,
      });
    } else if (hasCycle && !cycleIds.has(entry.cycle_id)) {
      violations.push({ type: 'orphaned-changelog-cycle', message: `changelog entry ${entry.version} references cycle_id ${entry.cycle_id}, which doesn't exist in cycles[]` });
    } else if (hasCr && !crIds.has(entry.cr_id)) {
      violations.push({ type: 'orphaned-changelog-cr', message: `changelog entry ${entry.version} references cr_id ${entry.cr_id}, which doesn't exist in change_requests[]` });
    }
  }

  if (docsVersionParsed && changelogYaml.length > 0) {
    const last = parseSemver(changelogYaml[changelogYaml.length - 1].version);
    if (last && compareSemver(last, docsVersionParsed) !== 0) {
      violations.push({
        type: 'docs-version-mismatch',
        message: `docs_version ("${docsVersion}") does not match changelog[]'s newest entry ("${changelogYaml[changelogYaml.length - 1].version}")`,
      });
    }
  }

  // Sync check: docs/CHANGELOG.md (newest-first) vs. changelog[] reversed
  // to newest-first, compared entry by entry, by content.
  const changelogPath = join(projectRoot, 'docs', 'CHANGELOG.md');
  if (!existsSync(changelogPath)) {
    if (changelogYaml.length > 0) {
      violations.push({ type: 'missing-changelog-md', message: 'project-state.md has changelog[] entries but docs/CHANGELOG.md does not exist' });
    }
    return violations;
  }
  const changelogMdRows = parseChangelogMarkdown(readFileSync(changelogPath, 'utf8'));
  const yamlNewestFirst = [...changelogYaml].reverse();

  if (changelogMdRows.length !== yamlNewestFirst.length) {
    violations.push({
      type: 'changelog-count-mismatch',
      message: `docs/CHANGELOG.md has ${changelogMdRows.length} row(s) but project-state.md's changelog[] has ${yamlNewestFirst.length} — they must mirror each other 1:1`,
    });
  }
  const shorter = Math.min(changelogMdRows.length, yamlNewestFirst.length);
  for (let i = 0; i < shorter; i++) {
    if (!entriesMatch(changelogMdRows[i], yamlNewestFirst[i])) {
      violations.push({
        type: 'changelog-entry-mismatch',
        message: `docs/CHANGELOG.md row ${i + 1} (newest-first) doesn't match project-state.md's changelog[] entry ${changelogYaml.length - i} — ${JSON.stringify(changelogMdRows[i])} vs ${JSON.stringify(yamlNewestFirst[i])}`,
      });
    }
  }

  return violations;
}

function main() {
  const projectRoot = process.argv[2] || process.cwd();
  const violations = [
    ...validateAuthorPresence(projectRoot),
    ...validateVersioning(projectRoot),
  ];
  if (violations.length === 0) {
    console.log('validate-versioning: OK — no violations found');
    process.exit(0);
  }
  console.log(`validate-versioning: ${violations.length} violation(s) found\n`);
  for (const v of violations) {
    console.log(`  [${v.type}] ${v.message}`);
  }
  process.exit(1);
}

if (isMainModule(import.meta.url)) {
  main();
}
