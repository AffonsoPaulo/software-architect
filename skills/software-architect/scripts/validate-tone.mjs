#!/usr/bin/env node
// Validates rules/document-format.md's "Never let the Skill's own
// process show through" section: scans every generated document (never
// project-state.md — it's the one file allowed to be Skill-internal,
// rules/document-format.md) for patterns that only make sense if the
// Skill's own interview process, file structure, or policy vocabulary
// leaked into what's supposed to read as human-authored output.
//
// This is a narrower, more mechanical check than the four patterns'
// full intent — regex can't judge whether a "reason" genuinely reads
// like project-specific business reasoning, only whether it contains
// specific known Skill-internal strings. The semantic judgment still
// belongs to phase 17's review (rules/quality-gate-structure.md); this
// catches the unambiguous, structural cases first.
//
// Usage: node validate-tone.mjs [project-root]
// Can also be imported: import { validateTone } from './validate-tone.mjs'

import { loadAllDocuments } from './lib/docs.mjs';
import { isMainModule } from './lib/cli.mjs';

// "Fase 08" / "Phase 17" — the numbered phase table is SKILL.md's own
// internal organization; a reader has no reason to know a Requirements
// document is "Phase 03." Two digits covers 00-17; deliberately doesn't
// match a lone "Phase" without a number, since that word alone is
// ordinary English a real document might use for other reasons.
const PHASE_NUMBER_RE = /\b(?:Fase|Phase|Fases|Phases)\s+\d{1,2}\b/gi;

// The confirmation-protocol bracket marker (rules/confirmation-protocol.md)
// tracks HOW an answer was confirmed during the interview — it is never
// meant to survive into the written document. Matches the English form
// and any translated one by shape (bracketed text containing the word
// "individual"), since the marker's defining feature is the brackets
// plus that word, not a specific language's exact phrasing.
const CONFIRMATION_MARKER_RE = /\[[^\]\n]*\bindividual\b[^\]\n]*\]/gi;

// A citation of this Skill's own internal file structure — meaningless
// to a stakeholder, who has no access to these files. Requires a real
// file extension at the end (every actual rules/playbooks/templates/
// scripts file this Skill has is a .md, .mjs, .js, or .json file) so
// ordinary prose that happens to contain "scripts/" or "rules/" as two
// separate words joined by a slash (e.g. "scripts/config files" meaning
// "scripts or config files") doesn't false-positive.
const INTERNAL_PATH_RE = /\b(?:rules|playbooks|templates|scripts|checklists|quality-gates)\/[\w./-]*\.(?:md|mjs|js|json)\b/g;

// Best-effort, English-only: catches the Skill's own policy phrase
// (playbooks/00-project-calibration.md's "always mandatory" framing for
// phases 03/08/11/17) echoed as if it were this project's own reasoning.
// Doesn't attempt to match every possible translation — that's exactly
// the kind of judgment call rules/document-format.md leaves to the
// semantic review at phase 17, not something regex can verify across
// an arbitrary confirmed language.
const POLICY_ECHO_RE = /\balways mandatory\b/gi;

// "Fully Dressed"/"Casual" (rules/documentation-depth.md) are this
// Skill's own name for a depth choice, not a real domain or engineering
// term — meaningless to a stakeholder. Scoped to a bold-only line (the
// shape a real generated document actually used it in, copying every
// playbook's own `*Fully Dressed only*` instruction-to-self marker)
// rather than banning the words anywhere in prose — "Casual" especially
// is ordinary English a project could legitimately use for unrelated
// reasons (a casual tone, casual Friday), so this only catches the
// specific failure mode actually observed, not every possible mention.
const DEPTH_LABEL_RE = /^\*\*(Fully Dressed|Casual)\b[^*]*\*\*\s*$/gm;

function findMatches(content, re, type, describe) {
  const violations = [];
  let m;
  re.lastIndex = 0;
  while ((m = re.exec(content))) {
    violations.push({ type, match: m[0], index: m.index, message: describe(m[0]) });
  }
  return violations;
}

// rules/document-format.md's "Cross-referencing another document in
// prose": a bare `docs/...` path sitting in running text, with no
// markdown link around it, sends the reader to browse a whole document
// hunting for the relevant part instead of clicking straight to it.
// Table rows (`| docs/... | ... |`) are the one established exception —
// a Change Request's own Impact list `Document` column names the bare
// path deliberately, a mechanical tracking record rather than
// reader-directed prose — so this only scans non-table lines.
const DOCS_PATH_RE = /\bdocs\/[\w./-]+\.md\b/g;
const MARKDOWN_LINK_URL_RE = /\]\(([^)]+)\)/g;

function findBareDocsPathCitations(content) {
  const violations = [];
  for (const line of content.split('\n')) {
    if (line.trim().startsWith('|')) continue; // table row — established exception, above
    const linkRanges = [];
    let lm;
    MARKDOWN_LINK_URL_RE.lastIndex = 0;
    while ((lm = MARKDOWN_LINK_URL_RE.exec(line))) {
      const urlStart = lm.index + 2; // past the "]("
      linkRanges.push([urlStart, urlStart + lm[1].length]);
    }
    let m;
    DOCS_PATH_RE.lastIndex = 0;
    while ((m = DOCS_PATH_RE.exec(line))) {
      const start = m.index;
      const end = start + m[0].length;
      if (linkRanges.some(([s, e]) => start >= s && end <= e)) continue; // inside a real link's URL — fine
      violations.push({
        type: 'bare-docs-path-citation',
        match: m[0],
        index: 0,
        message: `"${m[0]}" cites another document's raw path in running prose instead of a real markdown link (rules/document-format.md's "Cross-referencing another document in prose") — link the specific artifact by ID, or the document itself if it has no ID, not a bare path`,
      });
    }
  }
  return violations;
}

export function validateTone(projectRoot) {
  const violations = [];
  const documents = loadAllDocuments(projectRoot);

  for (const doc of documents) {
    if (doc.isProjectState) continue; // exempt — project-state.md is Skill-internal by design
    // exempt — docs/transcript.md (examples/ only) is a deliberate,
    // illustrative excerpt of an actual AI/user conversation, not a
    // project deliverable pretending no interview happened; showing
    // confirmation-protocol.md's own markers is the whole point of it.
    if (doc.path.replace(/\\/g, '/').endsWith('docs/transcript.md')) continue;

    const checks = [
      [PHASE_NUMBER_RE, 'phase-number-reference', (m) => `"${m}" references this Skill's internal numbered phase table — say what the content actually is (the document/concept name) instead`],
      [CONFIRMATION_MARKER_RE, 'confirmation-marker-leak', (m) => `"${m}" is a confirmation-protocol bookkeeping marker (rules/confirmation-protocol.md) — it tracks how an answer was confirmed during the interview and should never appear in the written document`],
      [INTERNAL_PATH_RE, 'internal-path-citation', (m) => `"${m}" cites this Skill's own internal file structure — a reader has no access to it; restate the substance in plain language instead`],
      [POLICY_ECHO_RE, 'policy-echo', (m) => `"${m}" echoes the Skill's own policy language rather than this project's own reasoning — state the actual, project-specific reason`],
      [DEPTH_LABEL_RE, 'depth-label-leak', (m) => `"${m}" uses this Skill's own documentation-depth name ("Fully Dressed"/"Casual", rules/documentation-depth.md) as a document label — meaningless to a stakeholder; remove the label or replace it with what the content actually is`],
    ];

    for (const [re, type, describe] of checks) {
      for (const v of findMatches(doc.content, re, type, describe)) {
        violations.push({ ...v, path: doc.path });
      }
    }

    for (const v of findBareDocsPathCitations(doc.content)) {
      violations.push({ ...v, path: doc.path });
    }
  }

  return violations;
}

function main() {
  const projectRoot = process.argv[2] || process.cwd();
  const violations = validateTone(projectRoot);
  if (violations.length === 0) {
    console.log('validate-tone: OK — no violations found');
    process.exit(0);
  }
  console.log(`validate-tone: ${violations.length} violation(s) found\n`);
  for (const v of violations) {
    console.log(`  [${v.type}] ${v.path}: ${v.message}`);
  }
  process.exit(1);
}

if (isMainModule(import.meta.url)) {
  main();
}
