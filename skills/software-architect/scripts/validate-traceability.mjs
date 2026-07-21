#!/usr/bin/env node
// Validates the traceability graph defined in rules/traceability-rules.md
// against a target project's docs/ tree: required links present, no
// broken references, and the key coverage checks (every functional REQ
// has a US and a TEST, every NFR REQ has ARCH/SEC coverage, etc.).
// Respects phases marked "skipped" in docs/project-state.md — a prefix
// category that legitimately has no artifacts because its origin phase
// was skipped is not reported as a violation.
//
// Usage: node validate-traceability.mjs [project-root]
// Can also be imported: `import { validateTraceability } from './validate-traceability.mjs'`

import { buildProjectIndex, prefixOf, loadProjectState } from './lib/docs.mjs';
import { isMainModule } from './lib/cli.mjs';

// The definitive per-artifact table from rules/traceability-rules.md.
// mode: 'all' = must have >=1 target of every listed prefix
//       'any' = must have >=1 target of at least one listed prefix
const REQUIRED_TRACES = [
  { prefix: 'US', targets: ['REQ'], mode: 'all' },
  { prefix: 'UC', targets: ['US'], mode: 'all' },
  { prefix: 'ENT', targets: ['UC'], mode: 'all' },
  { prefix: 'TBL', targets: ['ENT'], mode: 'all' },
  { prefix: 'API', targets: ['UC', 'ARCH'], mode: 'all' },
  { prefix: 'SCR', targets: ['UC'], mode: 'all' },
  { prefix: 'SEC', targets: ['ARCH', 'API'], mode: 'any' },
  { prefix: 'TEST', targets: ['REQ'], mode: 'all' },
  { prefix: 'TASK', targets: ['US', 'UC'], mode: 'any' },
];

// Maps a required-trace prefix to the phase that produces it, so a
// missing link can be forgiven when that phase was explicitly skipped.
const PRODUCING_PHASE = {
  US: '04', UC: '05', ENT: '06', TBL: '07', ARCH: '08',
  API: '09', SCR: '10', SEC: '11', TEST: '12', TASK: '15',
};

function skippedPhases(projectState) {
  const skipped = new Set();
  if (!projectState || !Array.isArray(projectState.cycles)) return skipped;
  for (const cycle of projectState.cycles) {
    if (!Array.isArray(cycle.phases)) continue;
    for (const phase of cycle.phases) {
      if (phase && phase.status === 'skipped' && phase.phase_id) {
        skipped.add(String(phase.phase_id));
      }
    }
  }
  return skipped;
}

export function validateTraceability(projectRoot) {
  const index = buildProjectIndex(projectRoot);
  const projectState = loadProjectState(projectRoot);
  const skipped = skippedPhases(projectState);
  const violations = [];
  const report = [];

  // 1. Broken references: every traces_to target must exist somewhere.
  for (const ref of index.references) {
    for (const target of ref.traces_to) {
      if (!index.byId.has(target)) {
        violations.push({
          type: 'broken-reference',
          path: ref.path,
          message: `${ref.id || '(unnamed entry)'} in ${ref.path} references "${target}", which does not exist anywhere in the project`,
        });
      }
    }
  }

  // 2. Required-trace checks, per artifact.
  for (const rule of REQUIRED_TRACES) {
    const producingPhase = PRODUCING_PHASE[rule.prefix];
    const artifactsOfPrefix = index.artifacts.filter((a) => prefixOf(a.id) === rule.prefix);
    let orphanCount = 0;
    for (const artifact of artifactsOfPrefix) {
      const ref = index.references.find((r) => r.id === artifact.id);
      const traces = ref ? ref.traces_to : [];
      const targetPrefixesPresent = new Set(traces.map(prefixOf));
      const ok = rule.mode === 'all'
        ? rule.targets.every((t) => targetPrefixesPresent.has(t))
        : rule.targets.some((t) => targetPrefixesPresent.has(t));
      if (!ok) {
        orphanCount++;
        violations.push({
          type: 'orphan',
          path: artifact.path,
          message: `${artifact.id} in ${artifact.path} is missing a required traces_to (${rule.mode === 'all' ? 'needs all of' : 'needs at least one of'}: ${rule.targets.join(', ')})`,
        });
      }
    }
    report.push({ prefix: rule.prefix, checked: artifactsOfPrefix.length, orphans: orphanCount });
    if (artifactsOfPrefix.length === 0 && producingPhase && skipped.has(producingPhase)) {
      report[report.length - 1].note = `phase ${producingPhase} skipped — zero artifacts expected`;
    }
  }

  // Remove violations whose artifact's producing phase is legitimately
  // skipped (only relevant when an artifact of a LATER phase references
  // something that would have come from a skipped phase — the common
  // case is already handled by zero-artifacts-of-that-prefix above, but
  // this guards the case where a downstream artifact was itself never
  // created either, which just means fewer artifacts, not violations).

  // 3. Coverage checks that need type-aware filtering.
  const requirements = index.artifacts.filter((a) => prefixOf(a.id) === 'REQ');
  const referencesById = new Map(index.references.filter((r) => r.id).map((r) => [r.id, r]));

  function referencedByAnyPrefix(targetId, prefixes) {
    return index.references.some(
      (r) => r.traces_to.includes(targetId) && prefixes.includes(prefixOf(r.id || ''))
    );
  }

  // Referenced by ANYTHING with a traces_to — covers both an SCR-XXX
  // screen (formally ID'd, already caught by the forward SCR->UC rule
  // above) and a still-ID-less entry from another category (e.g. a
  // Roadmap milestone's Delivers list), so this stays generic rather
  // than hardcoding which categories currently lack a reserved prefix.
  function referencedByAnything(targetId) {
    return index.references.some((r) => r.traces_to.includes(targetId));
  }

  for (const req of requirements) {
    // Written in the document as "Functional"/"Non-functional" (fixed
    // vocabulary, never translated even in a non-English project — same
    // convention as a metadata-line key, rules/language-policy.md —
    // since this exact comparison is what the coverage split below
    // depends on). Normalize case before comparing either way.
    const type = req.raw && typeof req.raw.type === 'string' ? req.raw.type.toLowerCase() : undefined;
    if (type === 'functional') {
      if (!skipped.has('04') && !referencedByAnyPrefix(req.id, ['US'])) {
        violations.push({
          type: 'coverage-gap',
          path: req.path,
          message: `${req.id} (functional) has no US-XXX covering it`,
        });
      }
      if (!skipped.has('12') && !referencedByAnyPrefix(req.id, ['TEST'])) {
        violations.push({
          type: 'coverage-gap',
          path: req.path,
          message: `${req.id} (functional) has no TEST-XXX covering it`,
        });
      }
    } else if (type === 'non-functional') {
      if (!referencedByAnyPrefix(req.id, ['ARCH', 'SEC'])) {
        violations.push({
          type: 'coverage-gap',
          path: req.path,
          message: `${req.id} (non-functional) has no ARCH-XXX or SEC-XXX addressing it`,
        });
      }
    } else {
      // Neither recognized value — most likely a translated "Type"
      // (e.g. "Funcional") slipping past the convention above, which
      // would otherwise silently drop this requirement out of every
      // coverage check below rather than fail loudly.
      violations.push({
        type: 'unrecognized-requirement-type',
        path: req.path,
        message: `${req.id}: Type is "${(req.raw && req.raw.type) || '(missing)'}", expected Functional or Non-functional`,
      });
    }
  }

  // 4. Reverse-coverage checks explicitly promised in specific gates:
  //    - every UC needs at least one thing covering it: an API-XXX, an
  //      SCR-XXX, or both — either counts, and the forward SCR->UC rule
  //      above already re-confirms it from the screen's own side too
  //    - every ENT needs at least one TBL, unless the phase was skipped
  // Skip this check only if BOTH phases that could cover a Use Case
  // (API Design and Frontend Planning) were skipped — if either ran,
  // coverage is still expected through whichever one did.
  if (!(skipped.has('09') && skipped.has('10'))) {
    const useCases = index.artifacts.filter((a) => prefixOf(a.id) === 'UC');
    for (const uc of useCases) {
      if (!referencedByAnything(uc.id)) {
        violations.push({
          type: 'coverage-gap',
          path: uc.path,
          message: `${uc.id} has no API-XXX or SCR-XXX covering it`,
        });
      }
    }
  }
  if (!skipped.has('07')) {
    const entities = index.artifacts.filter((a) => prefixOf(a.id) === 'ENT');
    for (const ent of entities) {
      if (!referencedByAnyPrefix(ent.id, ['TBL'])) {
        violations.push({
          type: 'coverage-gap',
          path: ent.path,
          message: `${ent.id} has no TBL-XXX covering it (expected unless explicitly documented as an embedded value object)`,
        });
      }
    }
  }

  // Every API-XXX needs at least one SEC-XXX covering it — including an
  // explicit "public, no auth required" control, which still gets its own
  // SEC-XXX per templates/security.md; there's no such thing as an
  // interaction unit with no stated auth treatment. Security (phase 11) is
  // never skippable, so no skip guard is needed here — if API-XXX exists,
  // it needs auth coverage, full stop.
  const apiUnits = index.artifacts.filter((a) => prefixOf(a.id) === 'API');
  for (const api of apiUnits) {
    if (!referencedByAnyPrefix(api.id, ['SEC'])) {
      violations.push({
        type: 'coverage-gap',
        path: api.path,
        message: `${api.id} has no SEC-XXX covering it — every interaction unit needs a stated auth treatment, including an explicit "public, no auth required" control`,
      });
    }
  }

  // 5. Roadmap coverage: every US/UC delivered by a milestone needs at
  // least one TASK-XXX, mirroring the Backlog gate's "every US in a
  // currently-included milestone has a backlog item."
  const roadmapDoc = index.documents.find((d) => d.path.replace(/\\/g, '/').endsWith('14-roadmap/roadmap.md'));
  const milestoneRefs = roadmapDoc
    ? index.references.filter((r) => r.path === roadmapDoc.path && Array.isArray(r.raw.delivers))
    : [];
  if (roadmapDoc && milestoneRefs.length > 0 && !skipped.has('15')) {
    const delivered = new Set();
    for (const m of milestoneRefs) {
      for (const id of m.raw.delivers) delivered.add(id);
    }
    for (const id of delivered) {
      if (!referencedByAnyPrefix(id, ['TASK'])) {
        violations.push({
          type: 'coverage-gap',
          path: roadmapDoc.path,
          message: `${id} is delivered by a milestone but has no TASK-XXX in the Backlog`,
        });
      }
    }
  }

  return { violations, report };
}

function main() {
  const projectRoot = process.argv[2] || process.cwd();
  const { violations, report } = validateTraceability(projectRoot);

  console.log('validate-traceability: per-prefix summary');
  for (const r of report) {
    const note = r.note ? ` (${r.note})` : '';
    console.log(`  ${r.prefix}: ${r.checked} checked, ${r.orphans} orphan(s)${note}`);
  }
  console.log('');

  if (violations.length === 0) {
    console.log('validate-traceability: OK — no violations found');
    process.exit(0);
  }
  console.log(`validate-traceability: ${violations.length} violation(s) found\n`);
  for (const v of violations) {
    console.log(`  [${v.type}] ${v.message}`);
  }
  process.exit(1);
}

if (isMainModule(import.meta.url)) {
  main();
}
