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
import { validateTone } from './validate-tone.mjs';
import { validateHeadingLanguage } from './validate-heading-language.mjs';
import { validateExportLabels } from './validate-export-labels.mjs';
import { buildProjectIndex, loadProjectState } from './lib/docs.mjs';
import { isMainModule } from './lib/cli.mjs';

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
  if (phase === '00') {
    results.push(checkCalibrationCompleteness(projectRoot));
  }
  if (phase === '01') {
    results.push(checkVisionCompleteness(projectRoot));
  }
  if (phase === '03') {
    results.push(checkRequirementsCompleteness(projectRoot));
  }
  if (phase === '05') {
    results.push(checkUseCasesPostconditions(projectRoot));
  }
  if (phase === '06') {
    results.push(checkDomainModelCompleteness(projectRoot));
  }
  if (phase === '12') {
    results.push(checkTestingKindExplicit(projectRoot));
  }
  if (phase === '14') {
    results.push(checkRoadmapCoverage(projectRoot));
    results.push(checkRoadmapDatesAndCycles(projectRoot));
  }
  if (phase === '16') {
    results.push(checkImplementationPlanCycles(projectRoot));
    results.push(checkImplementationPlanDefinitionOfDone(projectRoot));
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
//
// Scans the whole document for TASK-XXX-shaped rows instead of scoping to
// a "## Sequence" heading match first — rules/language-policy.md requires
// that heading to be translated for a non-English project ("## Sequência"
// for pt), so matching literal English heading text here would silently
// find nothing and skip the whole check. Task IDs never translate
// (rules/id-conventions.md), so the row shape is a language-independent
// anchor, and the template confirms no other section in this document
// produces TASK-XXX-shaped table rows.
function parseSequenceTable(content) {
  const edges = new Map();
  for (const line of content.split('\n')) {
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

// Phase 00 — Calibration. project-state.md is pure YAML (rules/document-
// format.md), so this reads the parsed object directly rather than
// scanning raw content — no language concern here, since project-state.md
// itself is always English regardless of the project's confirmed
// language. Phase status/skip decisions are read from calibration.md's
// own "Phase inclusion" table instead of project-state.md's cycles[]
// .phases[] array, since that array only gains an entry once a phase is
// actually *reached* (templates/project-state.md) — at Calibration's own
// gate, most phases haven't been reached yet, so an empty array there is
// normal, not a gap. calibration.md's table is what actually records
// the upfront included/skipped decision for every phase 01-17. Its
// "Status" column values (included/skipped) are treated as fixed schema
// words, not translated prose — same convention as project-state.md's
// own status enum, and consistent with every real generated project
// this was checked against.
function checkCalibrationCompleteness(projectRoot) {
  const projectState = loadProjectState(projectRoot);
  if (!projectState) {
    return { label: 'Calibration completeness check', status: 'skipped (no project-state.md found)' };
  }
  const gaps = [];
  if (!projectState.confirmation_mode) gaps.push('confirmation_mode is not set');
  if (!projectState.documentation_depth) gaps.push('documentation_depth is not set');
  if (!projectState.language) gaps.push('language is not set');

  const cycles = Array.isArray(projectState.cycles) ? projectState.cycles : [];
  const activeCycle = cycles.find((c) => c && c.id === projectState.active_cycle_id);
  if (!activeCycle) {
    gaps.push(`active_cycle_id (${projectState.active_cycle_id}) does not match any cycle in cycles[]`);
  }

  const index = buildProjectIndex(projectRoot);
  const calDoc = findDoc(index, '00-calibration/calibration.md');
  if (!calDoc) {
    gaps.push('docs/00-calibration/calibration.md not found');
  } else {
    const ALWAYS_MANDATORY = new Set(['03', '08', '11', '17']);
    const seen = new Set();
    for (const line of calDoc.content.split('\n')) {
      const cells = line.split('|').map((c) => c.trim());
      if (cells.length < 4) continue;
      const phaseMatch = cells[1].match(/^(\d{2})\s*—/);
      if (!phaseMatch) continue;
      const phaseId = phaseMatch[1];
      seen.add(phaseId);
      const status = cells[2].toLowerCase();
      if (ALWAYS_MANDATORY.has(phaseId) && status === 'skipped') {
        gaps.push(`phase ${phaseId} is marked skipped in calibration.md, but it's always mandatory`);
      }
    }
    for (let n = 1; n <= 17; n++) {
      const id = String(n).padStart(2, '0');
      if (!seen.has(id)) gaps.push(`phase ${id} has no row in calibration.md's Phase inclusion table`);
    }
  }

  return {
    label: 'Calibration completeness check',
    status: gaps.length === 0 ? 'PASS — project-state.md and calibration.md are structurally complete' : `FAIL — ${gaps.join('; ')}`,
  };
}

// Phase 01 — Discovery (Vision). Checks two things, both language-
// independent: (1) every Casual-depth section is present, matched by
// heading LEVEL and POSITION-independent presence rather than literal
// English text (rules/language-policy.md translates these headings) —
// done here by counting top-level (##) headings against the known
// count, not by matching their text; (2) at Fully Dressed depth,
// "Stakeholder profiles" and "Success metrics" each contain an actual
// table, not just prose — templates/vision.md's own intro sentence
// calls both sections "a table," and this check enforces that
// literally, independent of whichever heading text a translated
// project uses.
function checkVisionCompleteness(projectRoot) {
  const index = buildProjectIndex(projectRoot);
  const doc = findDoc(index, '01-discovery/vision.md');
  if (!doc) {
    return { label: 'Vision completeness check', status: 'skipped (no vision.md found)' };
  }
  const projectState = loadProjectState(projectRoot);
  const fullyDressed = projectState && projectState.documentation_depth === 'fully_dressed';

  const headings = [...doc.content.matchAll(/^##\s+.*$/gm)];
  const CASUAL_SECTION_COUNT = 7; // Problem, Target audience, Current state, Business objective, Success criteria, Constraints, Out of scope
  const FULLY_DRESSED_SECTION_COUNT = 12; // Casual's 7 + Stakeholder profiles, Business opportunity, Success metrics, Assumptions and dependencies, Business-level risks
  const expected = fullyDressed ? FULLY_DRESSED_SECTION_COUNT : CASUAL_SECTION_COUNT;

  const gaps = [];
  if (headings.length < expected) {
    gaps.push(`only ${headings.length} top-level section(s) found, expected at least ${expected} (${fullyDressed ? 'Fully Dressed' : 'Casual'} depth, templates/vision.md)`);
  }

  if (fullyDressed) {
    // Split into blocks per "## " heading and check by fixed position —
    // simpler and just as reliable given the section count above: scan
    // the relevant blocks, flag either one with no table row under it.
    // Position-based per templates/vision.md's own fixed Fully Dressed
    // order (0-indexed after slice(1)): 0 Problem, 1 Target audience,
    // 2 Stakeholder profiles, 3 Current state, 4 Business objective,
    // 5 Business opportunity, 6 Success criteria, 7 Success metrics,
    // 8 Constraints, 9 Assumptions and dependencies, 10 Business-level
    // risks, 11 Out of scope — not by matching either heading's own
    // (translatable) text.
    const blocks = doc.content.split(/^##\s+/m).slice(1);
    let stakeholderBlockHasTable = null;
    let metricsBlockHasTable = null;
    if (blocks[2]) stakeholderBlockHasTable = /^\|.*\|\s*$/m.test(blocks[2]);
    if (blocks[7]) metricsBlockHasTable = /^\|.*\|\s*$/m.test(blocks[7]);
    if (stakeholderBlockHasTable === false) gaps.push('"Stakeholder profiles" section (3rd) has no table — expected a consistent multi-field table per rules/document-format.md');
    if (metricsBlockHasTable === false) gaps.push('"Success metrics" section (8th) has no table — expected a consistent multi-field table per rules/document-format.md');
  }

  return {
    label: 'Vision completeness check',
    status: gaps.length === 0 ? 'PASS — every expected section is present' : `FAIL — ${gaps.join('; ')}`,
  };
}

// Phase 03 — Requirements. "Acceptance criteria" is always a checklist
// (`- [ ]`), "Edge cases" is always a plain bullet list (`- text`, no
// brackets) — templates/requirements.md's only two bullet-shaped
// sections in an item file, at any depth. Checking for the SHAPE of
// each rather than matching either bold label's (translatable) text.
// Non-functional requirements are exempt (rules/traceability-rules.md —
// they trace directly to ARCH/SEC instead of needing this Requirements-
// specific detail).
//
// `Type` itself is a metadata-line VALUE, not a heading or table header
// — but rules/language-policy.md still treats "Functional"/
// "Non-functional" as fixed vocabulary (like Testing's `Kind:
// Automated`/`Manual`), never translated prose, precisely because this
// check (and validate-traceability.mjs's functional/non-functional
// coverage split) matches it literally. A `Type` value that isn't
// either recognized word is flagged explicitly here rather than
// silently treated as "not functional" and skipped — the same failure
// mode a translated value would otherwise cause invisibly.
const VALID_REQ_TYPES = new Set(['functional', 'non-functional']);

function checkRequirementsCompleteness(projectRoot) {
  const index = buildProjectIndex(projectRoot);
  const reqs = index.artifacts.filter((a) => /^REQ-\d+$/.test(a.id));
  if (reqs.length === 0) {
    return { label: 'Requirements completeness check', status: 'skipped (no requirements found)' };
  }
  const docByPath = new Map(index.documents.map((d) => [d.path, d.content]));
  const gaps = [];
  for (const req of reqs) {
    const rawType = (req.raw && req.raw.type) || '';
    const type = String(rawType).toLowerCase();
    if (!VALID_REQ_TYPES.has(type)) {
      gaps.push(`${req.id}: Type is "${rawType || '(missing)'}", expected Functional or Non-functional`);
      continue;
    }
    if (type !== 'functional') continue;
    const content = docByPath.get(req.path) || '';
    if (!/^-\s*\[[ xX]\]/m.test(content)) gaps.push(`${req.id}: no acceptance criteria (checklist) found`);
    if (!/^-\s+(?!\[)\S/m.test(content)) gaps.push(`${req.id}: no edge cases (bullet list) found`);
  }
  return {
    label: 'Requirements completeness check',
    status: gaps.length === 0 ? 'PASS — every functional requirement has acceptance criteria and edge cases' : `FAIL — ${gaps.join('; ')}`,
  };
}

// Phase 05 — Use Cases. "Postconditions" (Casual) is a bullet list, but
// its Fully Dressed rename "Success guarantees" (templates/use-cases.md,
// same content, Cockburn's convention) allows either a bullet list or a
// single prose sentence, per the template's own placeholder — so
// requiring a bullet specifically would enforce a shape the template
// itself doesn't promise. Anchored instead on "Alternative/exception flows"'s
// table — its data rows always have a purely-numeric first cell (the
// step number, which never translates), the one reliable structural
// landmark both depths share — and just checks that *some* real content
// (prose or bullets, either is valid) exists after it, before the next
// Mermaid diagram.
function checkUseCasesPostconditions(projectRoot) {
  const index = buildProjectIndex(projectRoot);
  const ucs = index.artifacts.filter((a) => /^UC-\d+$/.test(a.id));
  if (ucs.length === 0) {
    return { label: 'Use Cases postconditions check', status: 'skipped (no use cases found)' };
  }
  const docByPath = new Map(index.documents.map((d) => [d.path, d.content]));
  const gaps = [];
  for (const uc of ucs) {
    const content = docByPath.get(uc.path) || '';
    const lines = content.split('\n');
    let lastFlowRowIdx = -1;
    lines.forEach((line, i) => {
      const cells = line.split('|').map((c) => c.trim());
      if (cells.length >= 4 && /^\d+$/.test(cells[1] || '')) lastFlowRowIdx = i;
    });
    const searchFrom = lastFlowRowIdx === -1 ? 0 : lastFlowRowIdx + 1;
    const mermaidIdx = lines.findIndex((l, i) => i > searchFrom && /^```/.test(l.trim()));
    const searchTo = mermaidIdx === -1 ? lines.length : mermaidIdx;
    const afterFlows = lines.slice(searchFrom, searchTo)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !/^\*\*.+\*\*$/.test(l)) // drop bare bold-label lines
      .join(' ')
      .trim();
    if (afterFlows.length < 10) gaps.push(`${uc.id}: no substantial content found after the alternative/exception flows (expected postconditions/success guarantees)`);
  }
  return {
    label: 'Use Cases postconditions check',
    status: gaps.length === 0 ? 'PASS — every use case has content after its alternative/exception flows' : `FAIL — ${gaps.join('; ')}`,
  };
}

// Phase 06 — Domain Model. "Invariants" (item file, plain bullets — the
// only bullet-shaped content in an ent-XXX.md, so any bullet at all is
// unambiguous) and aggregate membership (parsed from the INDEX file's
// own summary table, `| ID | Name | Kind | Belongs to aggregate | Traces
// to |` — a fixed column position regardless of what the header itself
// says in a translated project) — neither depends on matching an
// item file's own translatable "**Belongs to aggregate**" bold label.
function checkDomainModelCompleteness(projectRoot) {
  const index = buildProjectIndex(projectRoot);
  const entities = index.artifacts.filter((a) => /^ENT-\d+$/.test(a.id));
  if (entities.length === 0) {
    return { label: 'Domain Model completeness check', status: 'skipped (no entities found)' };
  }
  const docByPath = new Map(index.documents.map((d) => [d.path, d.content]));
  const gaps = [];
  for (const ent of entities) {
    const content = docByPath.get(ent.path) || '';
    if (!/^-\s+\S/m.test(content)) gaps.push(`${ent.id}: no invariants (bullet list) found`);
  }

  const indexDoc = findDoc(index, '06-domain-model/domain-model.md');
  if (indexDoc) {
    const knownIds = new Set(entities.map((e) => e.id));
    for (const line of indexDoc.content.split('\n')) {
      const cells = line.split('|').map((c) => c.trim());
      if (cells.length < 6) continue;
      const idMatch = cells[1].match(/ENT-\d+/);
      if (!idMatch) continue;
      const entId = idMatch[0];
      const belongsCell = cells[4];
      if (!belongsCell) {
        gaps.push(`${entId}: "Belongs to aggregate" cell is empty in domain-model.md's index table`);
        continue;
      }
      const refMatch = belongsCell.match(/ENT-\d+/);
      // No ENT-XXX token in the cell parses as "itself is the root" no
      // matter what the rest of the cell's text actually says — this
      // check doesn't require the literal English phrase. That parsing
      // tolerance is not the same as language-policy.md's own authoring
      // rule, though: "itself is the root" is closed vocabulary a
      // project should still write literally, same as `Kind: Entity`/
      // `Value object` on this same table (rules/language-policy.md).
      if (refMatch && !knownIds.has(refMatch[0])) {
        gaps.push(`${entId}: "Belongs to aggregate" references ${refMatch[0]}, which doesn't exist`);
      }
    }
  }

  return {
    label: 'Domain Model completeness check',
    status: gaps.length === 0 ? 'PASS — every entity has invariants and valid aggregate membership' : `FAIL — ${gaps.join('; ')}`,
  };
}

// Phase 12 — Testing. `Kind` is a metadata-line key (rules/document-
// format.md's "Standard keys" convention doesn't reserve it, but
// templates/testing.md does, per-template) — already generically
// captured by the metadata-line parser, so this reads `raw.kind`
// directly rather than scanning raw content, same as the Requirements
// check reads `raw.type`.
function checkTestingKindExplicit(projectRoot) {
  const index = buildProjectIndex(projectRoot);
  const tests = index.artifacts.filter((a) => /^TEST-\d+$/.test(a.id));
  if (tests.length === 0) {
    return { label: 'Testing kind-explicit check', status: 'skipped (no tests found)' };
  }
  const VALID = new Set(['automated', 'manual']);
  const gaps = [];
  for (const test of tests) {
    const kind = String((test.raw && test.raw.kind) || '').toLowerCase();
    if (!VALID.has(kind)) gaps.push(`${test.id}: Kind is "${test.raw && test.raw.kind ? test.raw.kind : '(missing)'}", expected Automated or Manual`);
  }
  return {
    label: 'Testing kind-explicit check',
    status: gaps.length === 0 ? 'PASS — every test has an explicit Automated/Manual kind' : `FAIL — ${gaps.join('; ')}`,
  };
}

// Phase 14 — Roadmap, second check (checkRoadmapCoverage above is the
// existing coverage one). "Has real dates" is a metadata-style fact
// stated in the index file's own intro prose, not a metadata-line key —
// checked here via presence of a Yes/No-shaped statement is too fragile
// across languages, so this instead checks the more mechanically
// reliable half of the criterion: no dependency cycle among milestones
// themselves (`Depends on` in each milestone's metadata line, a
// standard key that never translates — rules/document-format.md).
// Milestones have no reserved ID prefix (rules/id-conventions.md), so
// unlike every other cross-reference in this Skill, there's no stable
// id to key a "Depends on: <other milestone>" value against — the
// generic reference extractor's own auto-slugified id (derived from a
// namespace plus the heading text) doesn't match what a human/AI would
// naturally write there (the other milestone's own plain title). This
// parses roadmap.md directly instead, pairing each "### <title>" with
// its own metadata line, and matches "Depends on" targets against other
// milestones' titles by normalized text (lowercased, punctuation/
// whitespace stripped) rather than any id. "Depends on" itself is a
// standard metadata-line key (rules/document-format.md) that never
// translates, so matching it literally is safe regardless of the
// project's language — only the milestone TITLES either side of it
// vary, which is exactly what the normalization handles.
function normalizeTitle(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function checkRoadmapDatesAndCycles(projectRoot) {
  const doc = findDoc(buildProjectIndex(projectRoot), '14-roadmap/roadmap.md');
  if (!doc) {
    return { label: 'Roadmap milestone dependency cycle check', status: 'skipped (no roadmap.md found)' };
  }
  const lines = doc.content.split('\n');
  const milestones = [];
  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(/^###\s+(.*)$/);
    if (!headingMatch) continue;
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;
    const metaMatch = lines[j] && lines[j].trim().match(/^\*(.+)\*$/);
    if (!metaMatch) continue;
    const dependsOnMatch = metaMatch[1].match(/Depends on:\s*([^·]+)/i);
    if (!dependsOnMatch) continue;
    const tokens = dependsOnMatch[1].trim().split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !EMPTY_TOKENS.has(t.toLowerCase()));
    milestones.push({ title: headingMatch[1].trim(), dependsOn: tokens });
  }
  if (milestones.length === 0) {
    return { label: 'Roadmap milestone dependency cycle check', status: 'skipped (no milestones found)' };
  }
  const byTitle = new Set(milestones.map((m) => normalizeTitle(m.title)));
  const edges = new Map(milestones.map((m) => [
    normalizeTitle(m.title),
    m.dependsOn.map(normalizeTitle).filter((t) => byTitle.has(t)),
  ]));
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map([...edges.keys()].map((k) => [k, WHITE]));
  let cycle = null;
  function visit(node, path) {
    color.set(node, GRAY);
    for (const dep of edges.get(node) || []) {
      if (color.get(dep) === GRAY) { cycle = [...path, node, dep]; return true; }
      if (color.get(dep) === WHITE) { if (visit(dep, [...path, node])) return true; }
    }
    color.set(node, BLACK);
    return false;
  }
  for (const node of edges.keys()) {
    if (color.get(node) === WHITE) { if (visit(node, [])) break; }
  }
  return {
    label: 'Roadmap milestone dependency cycle check',
    status: cycle ? `FAIL — cycle detected: ${cycle.join(' -> ')}` : 'PASS — no milestone dependency cycles',
  };
}

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

// Definition of Done is stated once, at the top of implementation-plan.md,
// before the "## Sequence" table (templates/implementation-plan.md's own
// fixed order) — checked by confirming substantial prose exists between
// the document's own H1 and the first TASK-XXX-shaped row, rather than
// matching "Definition of Done"'s own translatable heading text.
function checkImplementationPlanDefinitionOfDone(projectRoot) {
  const index = buildProjectIndex(projectRoot);
  const doc = findDoc(index, '16-implementation-plan/implementation-plan.md');
  if (!doc) {
    return { label: 'Implementation Plan Definition of Done check', status: 'skipped (no implementation-plan.md found)' };
  }
  const lines = doc.content.split('\n');
  let sequenceStartIdx = lines.findIndex((l) => {
    const cells = l.split('|').map((c) => c.trim());
    return cells.length >= 4 && /^TASK-[A-Za-z0-9]+$/.test(cells[1] || '');
  });
  if (sequenceStartIdx === -1) sequenceStartIdx = lines.length;
  const contentLines = lines.slice(1, sequenceStartIdx).filter((l) => !/^#+\s/.test(l.trim()) && l.trim().length > 0);
  const hasContent = contentLines.join(' ').trim().length > 20;
  return {
    label: 'Implementation Plan Definition of Done check',
    status: hasContent ? 'PASS — Definition of Done content found before the Sequence table' : 'FAIL — no substantial Definition of Done content found before the Sequence table',
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
  //
  // Scanned across the whole document rather than scoped to a "## Deferred"
  // heading match — same reason as parseSequenceTable above: that heading
  // translates for a non-English project, and matching literal English
  // text would silently find zero deferred items, which here doesn't just
  // skip the check, it produces a false "FAIL — unaddressed" for every
  // genuinely-deferred story. Restricted to US-/UC- ids specifically (the
  // only ids this check ever cares about) followed by an em dash, matching
  // the template's exact bullet shape, to keep the match narrow.
  const deferred = new Set(
    [...doc.content.matchAll(/^-\s*((?:US|UC)-[A-Za-z0-9]+)\s+—/gm)].map((m) => m[1])
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
  const toneViolations = validateTone(projectRoot);
  const headingLanguageViolations = validateHeadingLanguage(projectRoot);
  const exportLabelsViolations = validateExportLabels(projectRoot);
  const extra = phaseSpecificChecks(phase, projectRoot);

  return {
    gatePath,
    checklistPath,
    scriptable,
    judgment,
    idViolations,
    traceabilityViolations: traceResult.violations,
    versioningViolations,
    toneViolations,
    headingLanguageViolations,
    exportLabelsViolations,
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
  console.log('Scriptable criteria (from validate-ids.mjs / validate-traceability.mjs / validate-versioning.mjs / validate-tone.mjs / validate-heading-language.mjs / validate-export-labels.mjs / phase-specific checks):');
  const overallClean = result.idViolations.length === 0 && result.traceabilityViolations.length === 0 && result.versioningViolations.length === 0 && result.toneViolations.length === 0 && result.headingLanguageViolations.length === 0 && result.exportLabelsViolations.length === 0;
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
  if (result.toneViolations.length > 0) {
    console.log('\n  Tone violations:');
    for (const v of result.toneViolations) console.log(`    - ${v.path}: ${v.message}`);
  }
  if (result.headingLanguageViolations.length > 0) {
    console.log('\n  Heading-language violations:');
    for (const v of result.headingLanguageViolations) console.log(`    - ${v.path}: ${v.message}`);
  }
  if (result.exportLabelsViolations.length > 0) {
    console.log('\n  Export-labels violations:');
    for (const v of result.exportLabelsViolations) console.log(`    - ${v.message}`);
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

if (isMainModule(import.meta.url)) {
  main();
}
