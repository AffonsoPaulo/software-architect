#!/usr/bin/env node
// Builds a single .rtf from a target project's docs/ — the Word
// counterpart to build-doc-site.mjs's HTML export. RTF, not .docx:
// it's plain text (no ZIP/OOXML container to hand-build), and every
// mainstream word processor (Word, LibreOffice, Apple Pages/TextEdit,
// Google Docs' importer) opens it directly, with no npm dependency —
// matching every other script here (scripts/README.md).
//
// Navigation is native, not hand-rolled: headings carry \outlinelevel,
// so Word's built-in Navigation Pane and Insert > Table of Contents
// both work on this file for free, the same role build-doc-site.mjs's
// sidebar plays in the HTML version. Cross-references to a specific
// artifact (`[REQ-001](req-001.md)`, the shape index-table links
// actually take) become real, clickable Word hyperlinks; a link this
// script can't resolve to a known artifact ID renders as plain text
// rather than a broken link.
//
// This never runs automatically — an on-demand utility, exactly like
// build-doc-site.mjs.
//
// Usage: node build-doc-word.mjs [project-root] [output-path]
//   project-root defaults to the current working directory.
//   output-path defaults to <project-root>/docs/project-overview.rtf

import { writeFileSync, existsSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';
import { renderMarkdownToRtf } from './lib/markdown-to-rtf.mjs';
import { escapeRtfText, sanitizeBookmarkName, COLOR_TABLE } from './lib/rtf.mjs';
import { isMainModule } from './lib/cli.mjs';
import { PHASES, collectPhaseFiles, collectChangeRequestFiles, readChangelogFile } from './lib/doc-tree.mjs';

// Resolves a markdown link's href to an RTF hyperlink target. Only
// links to another artifact's own file (`req-001.md`, `ADR-001.md` —
// rules/document-locations.md's two filename conventions) resolve to a
// real bookmark; anything else (a phase's index file, an external URL,
// a link this script can't place) is left as plain text rather than a
// broken jump. See file header for why this is a deliberate scope cut,
// not an oversight.
function resolveLink(href) {
  if (/^https?:\/\//.test(href)) return { url: href };
  if (href.startsWith('#')) return null;
  const base = href.split('/').pop().replace(/\.md$/i, '');
  if (!/^[A-Za-z]+-[A-Za-z0-9]+$/.test(base)) return null;
  const [prefixPart, ...rest] = base.split('-');
  const id = `${prefixPart.toUpperCase()}-${rest.join('-')}`;
  return { bookmark: sanitizeBookmarkName(id) };
}

// Every source file's own `#` is level 1 in isolation (an item file's
// heading, per rules/document-format.md, since "the file *is* the
// artifact"). Assembled into one document, only the phase's own main/
// index file should keep that as a real H1 — every other file (an
// item file, or any Change Request) is content *within* that phase, so
// its heading nests one level deeper. Without this, a phase with 30
// requirements produces 30 unrelated H1s alongside "Requirements"
// itself — a flat, unindented wall in Word's Navigation Pane/TOC
// instead of a hierarchy.
function renderFiles(files) {
  let rtf = '';
  for (const f of files) {
    const headingLevelOffset = f.isMain ? 0 : 1;
    rtf += renderMarkdownToRtf(f.content, { namespace: f.namespace, resolveLink, headingLevelOffset }).rtf + '\n';
  }
  return rtf;
}

const FONT_TABLE = '{\\fonttbl{\\f0\\froman\\fcharset0 Times New Roman;}{\\f1\\fmodern\\fcharset0 Courier New;}{\\f2\\fswiss\\fcharset0 Arial;}}';
const PAGE_SETUP = '\\paperw12240\\paperh15840\\margl1440\\margr1440\\margt1440\\margb1440';

// A page break as its own bare \page token between two {\pard...} groups
// is valid RTF, but empirically corrupts the very next paragraph's
// character formatting in at least one real-world reader (macOS
// textutil's RTF-to-docx conversion silently dropped a heading's \fs32
// down to the 12pt default) — verified by isolating it in a minimal
// repro. Giving the break its own paragraph group sidesteps whatever
// state leaks across an ungrouped control word.
const PAGE_BREAK = '{\\pard\\page\\par}';

// Style handle N is "heading N" for every RTF/Word reader by default
// convention — declaring it explicitly (name, outline level, and the
// same size/spacing markdown-to-rtf.mjs applies as direct formatting)
// is what makes Word's Navigation Pane, Insert > Table of Contents,
// and "recognized as a real heading" (not just bold text) all work
// reliably, instead of depending on every reader guessing the same
// unwritten convention markdown-to-rtf.mjs's direct formatting alone
// would otherwise rely on.
const STYLESHEET =
  '{\\stylesheet' +
  '{\\s0\\snext0 Normal;}' +
  '{\\s1\\outlinelevel0\\b\\f2\\fs32\\sb280\\sa120\\sbasedon0\\snext0 heading 1;}' +
  '{\\s2\\outlinelevel1\\b\\f2\\fs28\\sb220\\sa120\\sbasedon0\\snext0 heading 2;}' +
  '{\\s3\\outlinelevel2\\b\\f2\\fs26\\sb180\\sa120\\sbasedon0\\snext0 heading 3;}' +
  '{\\s4\\outlinelevel3\\b\\f2\\fs24\\sb140\\sa120\\sbasedon0\\snext0 heading 4;}' +
  '{\\s5\\outlinelevel4\\b\\f2\\fs22\\sb120\\sa120\\sbasedon0\\snext0 heading 5;}' +
  '{\\s6\\outlinelevel5\\b\\f2\\fs22\\sb120\\sa120\\sbasedon0\\snext0 heading 6;}' +
  // Word only matches these by *name* ("toc 1", "toc 2") when it
  // generates the TOC field's entries on F9/Update Field — without
  // them, it falls back to some built-in default that doesn't
  // distinguish a phase-level entry from an individual artifact one,
  // which is exactly what made a large project's summary run to 11
  // printed pages: every entry at the same size, none of them compact.
  // toc 2 (each artifact) is deliberately much smaller and tighter than
  // toc 1 (each phase) — \tqr\tldot\tx9350 is the right-aligned,
  // dot-leader tab Word always uses for a TOC's page-number column,
  // \tx9350 matching PAGE_SETUP's margins (12240 - 1440*2).
  '{\\s10\\li0\\sb120\\sa60\\tqr\\tldot\\tx9350\\b\\f2\\fs22\\sbasedon0\\snext10 toc 1;}' +
  '{\\s11\\li360\\sb0\\sa20\\tqr\\tldot\\tx9350\\f0\\fs16\\sbasedon0\\snext11 toc 2;}' +
  '}';

export function buildDocWord(projectRoot, outputPath) {
  const projectName = basename(resolve(projectRoot));
  const title = `${projectName} — Project Documentation`;

  const parts = [];
  parts.push(`{\\pard\\qc\\sb1440\\sa240\\b\\f2\\fs48 ${escapeRtfText(title)}\\b0\\par}`);
  parts.push(`{\\pard\\qc\\sa1440\\i\\fs20 Generated by software-architect \\emdash  read-only export of docs/\\i0\\par}`);
  parts.push(
    '{\\pard\\qc\\sa240\\b\\fs24 Table of Contents\\b0\\par}\n' +
    // Levels 1-2 only — a phase title plus each artifact's own ID, not
    // every subheading inside an artifact — the same scope
    // build-doc-site.mjs's sidebar already limits itself to ("not
    // every subheading, to keep the nav usable at 100+ artifacts").
    '{\\field{\\*\\fldinst TOC \\\\o "1-2" \\\\h \\\\z \\\\u }{\\fldrslt {\\i Right-click here and choose "Update Field" (or press F9) to generate the table of contents.\\i0}}}\\par\n' +
    PAGE_BREAK
  );

  let phasesRendered = 0;
  let firstPhase = true;
  for (const phase of PHASES) {
    const files = collectPhaseFiles(projectRoot, phase);
    if (!files) continue;
    if (!firstPhase) parts.push(PAGE_BREAK);
    firstPhase = false;
    parts.push(renderFiles(files));
    phasesRendered++;
  }

  const crFiles = collectChangeRequestFiles(projectRoot);
  if (crFiles) {
    parts.push(PAGE_BREAK);
    parts.push(`{\\pard\\s1\\keepn\\outlinelevel0\\sb280\\sa120\\b\\f2\\fs32 {\\*\\bkmkstart change_requests}Change Requests{\\*\\bkmkend change_requests}\\b0\\par}`);
    parts.push(renderFiles(crFiles));
    phasesRendered++;
  }

  const changelogFile = readChangelogFile(projectRoot);
  if (changelogFile) {
    parts.push(PAGE_BREAK);
    parts.push(renderFiles([{ ...changelogFile, isMain: true }]));
    phasesRendered++;
  }

  const rtf = `{\\rtf1\\ansi\\ansicpg1252\\uc1\\deff0\\deflang1033\n${FONT_TABLE}\n${COLOR_TABLE}\n${STYLESHEET}\n${PAGE_SETUP}\n${parts.join('\n')}\n}`;
  writeFileSync(outputPath, rtf, 'utf8');
  return { outputPath, phasesRendered };
}

function main() {
  const [projectRootArg, outputArg] = process.argv.slice(2);
  const projectRoot = projectRootArg || process.cwd();
  const outputPath = outputArg || join(projectRoot, 'docs', 'project-overview.rtf');
  if (!existsSync(join(projectRoot, 'docs'))) {
    console.error(`No docs/ found under ${projectRoot}`);
    process.exit(1);
  }
  const result = buildDocWord(projectRoot, outputPath);
  console.log(`Built ${result.outputPath} (${result.phasesRendered} section${result.phasesRendered === 1 ? '' : 's'}).`);
  console.log('Opens directly in Word, LibreOffice, Pages, or Google Docs (File > Open > Upload) — no conversion needed.');
}

if (isMainModule(import.meta.url)) {
  main();
}
