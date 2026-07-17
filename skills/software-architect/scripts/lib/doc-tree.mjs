// Shared "which files belong to which phase, in what order" logic for
// the two doc-building scripts (build-doc-site.mjs, build-doc-word.mjs).
// Deliberately format-agnostic: this only resolves file content and
// reading order per rules/document-locations.md's phase/category
// layout — how each file's markdown actually gets rendered (HTML vs
// RTF) is each build script's own concern, not this module's.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Mirrors rules/document-locations.md exactly: which phases exist, in
// what order, and — for categories that split into an index + item
// files (rules/document-locations.md's hybrid layout) — the index
// filename and the item-file prefix(es) that belong under it.
export const PHASES = [
  { dir: '00-calibration', title: '00 · Project Calibration', kind: 'single', file: 'calibration.md' },
  { dir: '01-discovery', title: '01 · Discovery', kind: 'single', file: 'vision.md' },
  { dir: '02-business-analysis', title: '02 · Business Analysis', kind: 'single', file: 'business-analysis.md' },
  { dir: '03-requirements', title: '03 · Requirements Engineering', kind: 'split', groups: [{ index: 'requirements.md', prefix: 'req' }] },
  { dir: '04-user-stories', title: '04 · User Stories', kind: 'split', groups: [{ index: 'user-stories.md', prefix: 'us' }] },
  { dir: '05-use-cases', title: '05 · Use Cases', kind: 'split', groups: [{ index: 'use-cases.md', prefix: 'uc' }] },
  { dir: '06-domain-model', title: '06 · Domain Model', kind: 'split', groups: [{ index: 'domain-model.md', prefix: 'ent' }] },
  { dir: '07-database-design', title: '07 · Database Design', kind: 'split', groups: [{ index: 'database.md', prefix: 'tbl' }] },
  { dir: '08-architecture', title: '08 · Architecture', kind: 'split', groups: [{ index: 'architecture.md', prefix: 'arch' }], extraDir: 'adr' },
  { dir: '09-api-design', title: '09 · API Design', kind: 'split', groups: [{ index: 'api.md', prefix: 'api' }] },
  { dir: '10-frontend-planning', title: '10 · Frontend Planning', kind: 'single', file: 'frontend.md' },
  { dir: '11-security', title: '11 · Security', kind: 'split', groups: [{ index: 'security.md', prefix: 'sec' }, { index: 'risk-register.md', prefix: 'risk' }] },
  { dir: '12-testing', title: '12 · Testing', kind: 'split', groups: [{ index: 'testing.md', prefix: 'test' }] },
  { dir: '13-deployment', title: '13 · Deployment', kind: 'single', file: 'deployment.md' },
  { dir: '14-roadmap', title: '14 · Roadmap', kind: 'single', file: 'roadmap.md' },
  { dir: '15-backlog', title: '15 · Backlog', kind: 'split', groups: [{ index: 'backlog.md', prefix: 'task' }] },
  { dir: '16-implementation-plan', title: '16 · Implementation Plan', kind: 'single', file: 'implementation-plan.md' },
  { dir: '17-review', title: '17 · Architecture Review', kind: 'single', file: 'review-report.md' }
];

export function readIfExists(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : null;
}

export function listItemFiles(dir, prefix) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.toLowerCase().startsWith(`${prefix}-`) && f.endsWith('.md'))
    .sort();
}

// Resolves one phase into an ordered list of { content, namespace,
// isMain } — isMain flags the very first file (the index/single file),
// whose top-level heading is the category's own translated title
// (rules/language-policy.md). Returns null if the phase directory
// doesn't exist or has nothing in it yet, exactly like the two
// callers' previous inline versions of this did.
export function collectPhaseFiles(projectRoot, phase) {
  const dir = join(projectRoot, 'docs', phase.dir);
  if (!existsSync(dir)) return null;

  const files = [];
  let isFirst = true;
  function push(content, namespace) {
    files.push({ content, namespace, isMain: isFirst });
    isFirst = false;
  }

  if (phase.kind === 'single') {
    const content = readIfExists(join(dir, phase.file));
    if (content === null) return null;
    push(content, phase.dir);
  } else {
    let foundAny = false;
    for (const group of phase.groups) {
      const indexContent = readIfExists(join(dir, group.index));
      if (indexContent === null) continue;
      foundAny = true;
      push(indexContent, `${phase.dir}-${group.prefix}`);
      for (const itemFile of listItemFiles(dir, group.prefix)) {
        const itemContent = readIfExists(join(dir, itemFile));
        if (itemContent !== null) push(itemContent, phase.dir);
      }
    }
    if (phase.extraDir) {
      const extraPath = join(dir, phase.extraDir);
      if (existsSync(extraPath)) {
        const extraFiles = readdirSync(extraPath).filter((f) => f.endsWith('.md')).sort();
        for (const f of extraFiles) {
          foundAny = true;
          push(readFileSync(join(extraPath, f), 'utf8'), phase.dir);
        }
      }
    }
    if (!foundAny) return null;
  }

  return files;
}

export function collectChangeRequestFiles(projectRoot) {
  const dir = join(projectRoot, 'docs', 'change-requests');
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
  if (files.length === 0) return null;
  return files.map((f) => ({ content: readFileSync(join(dir, f), 'utf8'), namespace: 'change-requests', isMain: false }));
}

export function readChangelogFile(projectRoot) {
  const path = join(projectRoot, 'docs', 'CHANGELOG.md');
  if (!existsSync(path)) return null;
  return { content: readFileSync(path, 'utf8'), namespace: 'changelog' };
}
