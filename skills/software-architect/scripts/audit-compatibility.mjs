#!/usr/bin/env node
// Implements the "compatibility audit" defined in rules/skill-drift.md:
// a read-only pass that re-runs every already-`approved` phase's CURRENT
// Quality Gate against a project's existing confirmed content, and
// reports what's now missing relative to the currently installed Skill
// — without modifying anything. This is what makes that mechanism
// actually mechanical instead of "the AI rereads every gate file by
// hand," the same reasoning that motivated validate-gate.mjs itself.
//
// Scope: every phase whose most recent status (across all cycles, not
// just the active one — a phase can be reopened by a later incremental
// cycle) is "completed". A phase that's "pending"/"in_progress" hasn't
// been approved yet, so there's nothing to audit against drift; a
// "skipped" phase was never produced, so there's nothing to check.
//
// This never decides a gate passed or failed on its own — same posture
// as validate-gate.mjs, and for the same reason (rules/quality-gate-
// structure.md): judgment criteria always need a human. It only ever
// reports; any gap the user decides is worth addressing routes through
// a normal Change Request (rules/change-management.md), never an
// automatic edit.
//
// Usage: node audit-compatibility.mjs [project-root]
// Can also be imported: `import { auditCompatibility } from './audit-compatibility.mjs'`

import { runGate } from './validate-gate.mjs';
import { loadProjectState } from './lib/docs.mjs';
import { isMainModule } from './lib/cli.mjs';

// Later cycles can reopen an earlier phase (an incremental cycle whose
// scope touches it again) — the phase's CURRENT status is whatever its
// most recent cycle entry says, not the first one. Cycles are stored in
// the order they were opened (project-state.md's notes), so a simple
// left-to-right last-write-wins walk gives the current status per phase.
function currentPhaseStatuses(projectState) {
  const statuses = new Map(); // phase_id -> { status, cycleId }
  const cycles = Array.isArray(projectState && projectState.cycles) ? projectState.cycles : [];
  for (const cycle of cycles) {
    if (!Array.isArray(cycle.phases)) continue;
    for (const phase of cycle.phases) {
      if (!phase || !phase.phase_id) continue;
      statuses.set(String(phase.phase_id), { status: phase.status, cycleId: cycle.id });
    }
  }
  return statuses;
}

export function auditCompatibility(projectRoot) {
  const projectState = loadProjectState(projectRoot);
  if (!projectState) {
    return { error: 'docs/project-state.md not found', phases: [] };
  }
  const statuses = currentPhaseStatuses(projectState);
  const approvedPhaseIds = [...statuses.entries()]
    .filter(([, v]) => v.status === 'completed')
    .map(([phaseId]) => phaseId)
    .sort();

  const phases = [];
  for (const phaseId of approvedPhaseIds) {
    try {
      const result = runGate(phaseId, projectRoot);
      const scriptableClean =
        result.idViolations.length === 0 &&
        result.traceabilityViolations.length === 0 &&
        result.versioningViolations.length === 0 &&
        result.toneViolations.length === 0 &&
        result.headingLanguageViolations.length === 0 &&
        result.exportLabelsViolations.length === 0;
      phases.push({
        phaseId,
        gatePath: result.gatePath,
        scriptableClean,
        idViolations: result.idViolations,
        traceabilityViolations: result.traceabilityViolations,
        versioningViolations: result.versioningViolations,
        toneViolations: result.toneViolations,
        headingLanguageViolations: result.headingLanguageViolations,
        exportLabelsViolations: result.exportLabelsViolations,
        extra: result.extra,
        judgment: result.judgment,
      });
    } catch (err) {
      phases.push({ phaseId, error: String(err && err.message ? err.message : err) });
    }
  }
  return { phases };
}

function main() {
  const projectRoot = process.argv[2] || process.cwd();
  const { error, phases } = auditCompatibility(projectRoot);

  if (error) {
    console.error(`audit-compatibility: ${error}`);
    process.exit(2);
  }

  if (phases.length === 0) {
    console.log('audit-compatibility: no completed phases found — nothing to audit yet.');
    process.exit(0);
  }

  console.log(`Compatibility audit — re-checking ${phases.length} completed phase(s) against the currently installed Skill's rules.\n`);

  let anyScriptableViolation = false;
  let anyJudgmentToReview = false;

  for (const p of phases) {
    console.log(`=== Phase ${p.phaseId} ===`);
    if (p.error) {
      console.log(`  ERROR: ${p.error}`);
      console.log('');
      continue;
    }
    console.log(`  Gate file: ${p.gatePath}`);
    console.log(`  Scriptable: ${p.scriptableClean ? 'clean — no violations found project-wide' : 'VIOLATIONS FOUND (see below)'}`);
    if (!p.scriptableClean) {
      anyScriptableViolation = true;
      for (const v of p.idViolations) console.log(`    [id] ${v.message}`);
      for (const v of p.traceabilityViolations) console.log(`    [traceability] ${v.message}`);
      for (const v of p.versioningViolations) console.log(`    [versioning] ${v.message}`);
      for (const v of p.toneViolations) console.log(`    [tone] ${v.path}: ${v.message}`);
      for (const v of p.headingLanguageViolations) console.log(`    [heading-language] ${v.path}: ${v.message}`);
      for (const v of p.exportLabelsViolations) console.log(`    [export-labels] ${v.message}`);
    }
    for (const e of p.extra) console.log(`    [phase-specific] ${e.label}: ${e.status}`);
    if (p.judgment.length > 0) {
      anyJudgmentToReview = true;
      console.log(`  Judgment criteria (current rules — compare by hand against what was actually confirmed for this phase):`);
      for (const j of p.judgment) console.log(`    [ ] ${j}`);
    }
    console.log('');
  }

  console.log('---');
  console.log(
    anyScriptableViolation
      ? 'Some phases have scriptable violations against the CURRENT rules — this can mean genuine drift (a rule changed since approval) or a pre-existing issue unrelated to any Skill update. Either way, resolve via a normal Change Request (rules/change-management.md), never a direct edit.'
      : 'No scriptable violations found in any audited phase.'
  );
  console.log(
    anyJudgmentToReview
      ? "Judgment criteria are listed above for every phase — this script cannot know whether a NEW judgment criterion (added since the phase was approved) was ever actually confirmed. Read the phase's own documents against the current list; if something new is genuinely missing, that's a gap worth a CR too."
      : 'No judgment criteria to review.'
  );
  console.log('\nThis script never modifies anything and never declares a phase re-approved on its own — see rules/skill-drift.md.');
}

if (isMainModule(import.meta.url)) {
  main();
}
