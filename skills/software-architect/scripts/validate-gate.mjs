#!/usr/bin/env node
// Generic quality-gate runner. Loads a phase's quality-gates/<phase>-gate.md
// and checklists/<phase>-checklist.md, runs the scriptable checks
// (delegating to validate-ids.mjs / validate-traceability.mjs /
// validate-versioning.mjs, plus a small number of phase-specific
// mechanical checks — dependency-cycle detection for Implementation Plan,
// milestone coverage for Roadmap — that don't fit the generic model), and
// lists every judgment criterion as pending manual review. It never
// decides on its own whether a gate passes when judgment criteria exist —
// it only reports what is objectively verifiable.
//
// Usage: node validate-gate.mjs <phase> [project-root]
//   <phase> is the numeric prefix, e.g. "03" or "17".

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validateIds } from './validate-ids.mjs';
import { validateTraceability } from './validate-traceability.mjs';
import { validateAuthorPresence, validateVersioning } from './validate-versioning.mjs';
import { buildProjectIndex } from './lib/docs.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = dirname(SCRIPT_DIR);

function findPhaseFile(dir, phase, suffix) {
  const files = readdirSync(dir);
  const match = files.find((f) => f.startsWith(`${phase}-`) && f.endsWith(suffix));
  return match ? join(dir, match) : null;
}

function extractSection(markdown, heading) {
  // Matches by prefix, not exact equality — some gate files append extra
  // context to the heading (e.g. "Judgment criteria (AI/human) — never
  // delegated"), which must still count as the same section.
  const lines = markdown.split('\n');
  const items = [];
  let inSection = false;
  for (const line of lines) {
    if (line.startsWith('## ')) {
      inSection = line.trim().startsWith(`## ${heading}`);
      continue;
    }
    if (inSection && line.trim().startsWith('- [ ]')) {
      items.push(line.trim().replace(/^- \[ \]\s*/, ''));
    }
  }
  return items;
}

// Phase-specific mechanical checks that don't fit the generic
// ID/traceability model. Keyed by phase number.
function phaseSpecificChecks(phase, projectRoot) {
  const results = [];
  if (phase === '16') {
    results.push(checkImplementationPlanCycles(projectRoot));
  }
  if (phase === '14') {
    results.push(checkRoadmapCoverage(projectRoot));
  }
  return results.filter(Boolean);
}

function findDoc(index, pathSuffix) {
  return index.documents.find((d) => d.path.replace(/\\/g, '/').endsWith(pathSuffix));
}

// TASK-XXX is declared once, in Backlog (phase 15) — Implementation Plan
// only sequences existing tasks, it never redeclares them as headings
// (that would be a false duplicate-id). So its "## Sequence" section is a
// plain markdown table, not headings, and is parsed directly here rather
// than through the generic artifact/reference extraction:
//   | Task | Depends on | Parallelizable with |
//   |---|---|---|
//   | TASK-001 | (none) | — |
function parseSequenceTable(content) {
  const section = content.split(/^## Sequence\s*$/m)[1] || '';
  const untilNextHeading = section.split(/^## /m)[0];
  const edges = new Map();
  for (const line of untilNextHeading.split('\n')) {
    const cells = line.split('|').map((c) => c.trim());
    // A row is `| TASK-XXX | ... | ... |`, which splits into
    // ['', 'TASK-XXX', ..., ''] — at least 3 cells with the first real
    // cell matching a TASK id (skips the header/separator rows).
    if (cells.length < 4) continue;
    const taskMatch = cells[1].match(/^TASK-[A-Za-z0-9]+$/);
    if (!taskMatch) continue;
    const dependsOn = cells[2]
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !EMPTY_TOKENS.has(t.toLowerCase()));
    edges.set(cells[1], dependsOn);
  }
  return edges;
}

const EMPTY_TOKENS = new Set(['(none)', 'none', '—', '-', 'n/a']);

function checkImplementationPlanCycles(projectRoot) {
  const index = buildProjectIndex(projectRoot);
  const doc = findDoc(index, '16-implementation-plan/implementation-plan.md');
  const edges = doc ? parseSequenceTable(doc.content) : new Map();
  if (!doc || edges.size === 0) {
    return { label: 'Implementation Plan dependency cycle check', status: 'skipped (no tasks found)' };
  }
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map([...edges.keys()].map((k) => [k, WHITE]));
  let cycle = null;
  function visit(node, path) {
    color.set(node, GRAY);
    for (const dep of edges.get(node) || []) {
      if (color.get(dep) === GRAY) {
        cycle = [...path, node, dep];
        return true;
      }
      if (color.get(dep) === WHITE && edges.has(dep)) {
        if (visit(dep, [...path, node])) return true;
      }
    }
    color.set(node, BLACK);
    return false;
  }
  for (const node of edges.keys()) {
    if (color.get(node) === WHITE) {
      if (visit(node, [])) break;
    }
  }
  return {
    label: 'Implementation Plan dependency cycle check',
    status: cycle ? `FAIL — cycle detected: ${cycle.join(' -> ')}` : 'PASS — no cycles',
  };
}

function checkRoadmapCoverage(projectRoot) {
  const index = buildProjectIndex(projectRoot);
  const doc = findDoc(index, '14-roadmap/roadmap.md');
  const milestoneRefs = doc ? index.references.filter((r) => r.path === doc.path && Array.isArray(r.raw.delivers)) : [];
  if (!doc || milestoneRefs.length === 0) {
    return { label: 'Roadmap 100% US/UC coverage check', status: 'skipped (no milestones found)' };
  }
  const delivered = new Set();
  for (const m of milestoneRefs) {
    for (const id of m.raw.delivers) delivered.add(id);
  }
  // "## Deferred" bullets: "- US-014 — reason" (rules/document-format.md
  // doesn't reserve a metadata-line shape for this list, since a deferred
  // item is a plain fact, not a graph edge — parsed directly off the raw
  // content instead of the generic artifact/reference extraction.
  const deferredSection = doc.content.split(/^## Deferred\s*$/m)[1] || '';
  const deferredUntilNextHeading = deferredSection.split(/^## /m)[0];
  const deferred = new Set(
    [...deferredUntilNextHeading.matchAll(/^-\s*([A-Z]+-[A-Za-z0-9]+)/gm)].map((m) => m[1])
  );
  const stories = index.artifacts.filter((a) => /^(US|UC)-\d+$/.test(a.id));
  const uncovered = stories.filter((s) => !delivered.has(s.id) && !deferred.has(s.id));
  return {
    label: 'Roadmap 100% US/UC coverage check',
    status: uncovered.length === 0
      ? 'PASS — every approved US/UC is delivered or deferred'
      : `FAIL — unaddressed: ${uncovered.map((s) => s.id).join(', ')}`,
  };
}

export function runGate(phase, projectRoot) {
  const gatePath = findPhaseFile(join(SKILL_ROOT, 'quality-gates'), phase, '-gate.md');
  const checklistPath = findPhaseFile(join(SKILL_ROOT, 'checklists'), phase, '-checklist.md');
  if (!gatePath) {
    throw new Error(`No quality-gates/${phase}-*.md file found`);
  }
  const gateMarkdown = readFileSync(gatePath, 'utf8');
  const scriptable = extractSection(gateMarkdown, 'Scriptable criteria');
  const judgment = extractSection(gateMarkdown, 'Judgment criteria (AI/human)');

  const idViolations = validateIds(projectRoot);
  const traceResult = validateTraceability(projectRoot);
  const versioningViolations = [...validateAuthorPresence(projectRoot), ...validateVersioning(projectRoot)];
  const extra = phaseSpecificChecks(phase, projectRoot);

  return {
    gatePath,
    checklistPath,
    scriptable,
    judgment,
    idViolations,
    traceabilityViolations: traceResult.violations,
    versioningViolations,
    extra,
  };
}

function main() {
  const [phase, projectRootArg] = process.argv.slice(2);
  if (!phase) {
    console.error('Usage: node validate-gate.mjs <phase> [project-root]');
    process.exit(2);
  }
  const projectRoot = projectRootArg || process.cwd();
  const result = runGate(phase, projectRoot);

  console.log(`Gate: ${result.gatePath}`);
  console.log('');
  console.log('Scriptable criteria (from validate-ids.mjs / validate-traceability.mjs / validate-versioning.mjs / phase-specific checks):');
  const overallClean = result.idViolations.length === 0 && result.traceabilityViolations.length === 0 && result.versioningViolations.length === 0;
  for (const c of result.scriptable) {
    console.log(`  [${overallClean ? 'no violations found project-wide' : 'SEE VIOLATIONS BELOW'}] ${c}`);
  }
  if (result.idViolations.length > 0) {
    console.log('\n  ID violations:');
    for (const v of result.idViolations) console.log(`    - ${v.message}`);
  }
  if (result.traceabilityViolations.length > 0) {
    console.log('\n  Traceability violations:');
    for (const v of result.traceabilityViolations) console.log(`    - ${v.message}`);
  }
  if (result.versioningViolations.length > 0) {
    console.log('\n  Versioning violations:');
    for (const v of result.versioningViolations) console.log(`    - ${v.message}`);
  }
  if (result.extra.length > 0) {
    console.log('\n  Phase-specific checks:');
    for (const e of result.extra) console.log(`    - ${e.label}: ${e.status}`);
  }
  console.log('\nJudgment criteria (PENDING MANUAL REVIEW — not decided by this script):');
  for (const j of result.judgment) {
    console.log(`  [ ] ${j}`);
  }
  console.log('\nThis script never declares the gate itself passed or failed when judgment criteria exist — see rules/quality-gate-structure.md.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
