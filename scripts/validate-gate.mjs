#!/usr/bin/env node
// Generic quality-gate runner. Loads a phase's quality-gates/<phase>-gate.md
// and checklists/<phase>-checklist.md, runs the scriptable checks
// (delegating to validate-ids.mjs / validate-traceability.mjs, plus a
// small number of phase-specific mechanical checks — dependency-cycle
// detection for Implementation Plan, milestone coverage for Roadmap —
// that don't fit the generic ID/traceability model), and lists every
// judgment criterion as pending manual review. It never decides on its
// own whether a gate passes when judgment criteria exist — it only
// reports what is objectively verifiable.
//
// Usage: node validate-gate.mjs <phase> [project-root]
//   <phase> is the numeric prefix, e.g. "03" or "17".

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validateIds } from './validate-ids.mjs';
import { validateTraceability } from './validate-traceability.mjs';
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

function checkImplementationPlanCycles(projectRoot) {
  const index = buildProjectIndex(projectRoot);
  const doc = findDoc(index, '16-implementation-plan/implementation-plan.md');
  if (!doc || !Array.isArray(doc.data.sequence)) {
    return { label: 'Implementation Plan dependency cycle check', status: 'skipped (no sequence found)' };
  }
  const edges = new Map();
  for (const item of doc.data.sequence) {
    edges.set(item.task, Array.isArray(item.depends_on) ? item.depends_on : []);
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
  if (!doc || !Array.isArray(doc.data.milestones)) {
    return { label: 'Roadmap 100% US/UC coverage check', status: 'skipped (no milestones found)' };
  }
  const delivered = new Set();
  for (const m of doc.data.milestones) {
    for (const id of m.delivers || []) delivered.add(id);
  }
  const deferred = new Set((doc.data.deferred || []).map((d) => d.item));
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
  const extra = phaseSpecificChecks(phase, projectRoot);

  return {
    gatePath,
    checklistPath,
    scriptable,
    judgment,
    idViolations,
    traceabilityViolations: traceResult.violations,
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
  console.log('Scriptable criteria (from validate-ids.mjs / validate-traceability.mjs / phase-specific checks):');
  const overallClean = result.idViolations.length === 0 && result.traceabilityViolations.length === 0;
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
