// Markdown-to-RTF renderer — the RTF sibling of markdown-lite.mjs,
// covering the same subset of Markdown this Skill's own templates
// actually produce (see that file's own header comment for the
// rationale: not a general CommonMark implementation, good enough for
// what we control). Used by build-doc-word.mjs to produce one
// consolidated .rtf a real Word (or LibreOffice, Pages, Google Docs
// import) opens natively — no npm dependency, no intermediate .docx/
// ZIP container to hand-build, since RTF is plain text.
//
// Mermaid code fences render as a labeled, monospaced text block, not
// a diagram — RTF has no script execution to render one client-side
// the way the HTML build does. This is the same documented fallback
// rules/document-format.md already accepts for tools that can't render
// Mermaid natively ("falling back to a readable code block").
//
// Headings use \outlinelevel so Word's built-in Navigation Pane and
// Insert Table of Contents both work on this file for free — no
// hand-rolled sidebar/TOC needed the way the HTML build has one.

import { escapeRtfText, sanitizeBookmarkName, escapeRtfFieldInstruction, CF_ACCENT, CF_MUTED } from './rtf.mjs';

const ID_HEADING_RE = /^([A-Z]+-[A-Za-z0-9]+)(?:\s+—\s+(.*))?\s*$/;
const BOLD_LABEL_RE = /^\*\*[^*]+\*\*\s*$/;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-') || 'section';
}

// Splits a line into a sequence of tokens — code spans, links, bold,
// italic, and plain text runs — in source order. Unlike markdown-
// lite.mjs's placeholder-based approach (needed there to control when
// HTML-escaping happens relative to substitution), RTF has no
// escaping/tag-nesting concern that forces a particular pass order, so
// a single left-to-right tokenizer is simpler and just as correct.
const INLINE_RE = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*([^*\n]+)\*/g;

function tokenizeInline(text) {
  const tokens = [];
  let last = 0;
  let m;
  INLINE_RE.lastIndex = 0;
  while ((m = INLINE_RE.exec(text))) {
    if (m.index > last) tokens.push({ type: 'text', value: text.slice(last, m.index) });
    if (m[1] !== undefined) tokens.push({ type: 'code', value: m[1] });
    else if (m[2] !== undefined) tokens.push({ type: 'bold', value: m[2] });
    else if (m[3] !== undefined) tokens.push({ type: 'link', label: m[3], href: m[4] });
    else if (m[5] !== undefined) tokens.push({ type: 'italic', value: m[5] });
    last = INLINE_RE.lastIndex;
  }
  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });
  return tokens;
}

/**
 * @param {(href: string) => {bookmark: string}|{url: string}|null} resolveLink
 *   Classifies a link target: {bookmark} for an internal cross-reference
 *   (rendered as a HYPERLINK field jumping to that bookmark), {url} for
 *   an external one, or null to render the label as plain text (no
 *   working target — e.g. a relative link this renderer can't resolve).
 */
function renderInlineRtf(text, resolveLink) {
  let out = '';
  for (const token of tokenizeInline(text)) {
    if (token.type === 'text') { out += escapeRtfText(token.value); continue; }
    if (token.type === 'bold') { out += `{\\b ${escapeRtfText(token.value)}}`; continue; }
    if (token.type === 'italic') { out += `{\\i ${escapeRtfText(token.value)}}`; continue; }
    if (token.type === 'code') { out += `{\\f1 ${escapeRtfText(token.value)}}`; continue; }
    if (token.type === 'link') {
      const resolved = resolveLink(token.href);
      const label = escapeRtfText(token.label);
      if (resolved && resolved.bookmark) {
        out += `{\\field{\\*\\fldinst HYPERLINK \\\\l "${resolved.bookmark}"}{\\fldrslt {\\ul\\cf${CF_ACCENT} ${label}}}}`;
      } else if (resolved && resolved.url) {
        out += `{\\field{\\*\\fldinst HYPERLINK "${escapeRtfFieldInstruction(resolved.url)}"}{\\fldrslt {\\ul\\cf${CF_ACCENT} ${label}}}}`;
      } else {
        out += label;
      }
      continue;
    }
  }
  return out;
}

// Page content width for the table column-width math below — 6.5in at
// 1440 twips/inch (standard Word default margins on an 8.5x11 page).
const PAGE_WIDTH_TWIPS = 9360;

function tableRowRtf(cells, colWidths, resolveLink, isHeader) {
  let out = '\\trowd\\trgaph108\\trleft0';
  let x = 0;
  for (const w of colWidths) {
    x += w;
    out += `\\clbrdrt\\brdrs\\brdrw10\\clbrdrl\\brdrs\\brdrw10\\clbrdrb\\brdrs\\brdrw10\\clbrdrr\\brdrs\\brdrw10\\cellx${x}`;
  }
  out += '\n';
  for (let i = 0; i < cells.length; i++) {
    const bold = isHeader ? '\\b ' : '';
    const boldEnd = isHeader ? '' : '';
    out += `\\intbl{\\fs20 ${bold}${renderInlineRtf(cells[i] || '', resolveLink)}${boldEnd}}\\cell `;
  }
  out += '\\row\n';
  return out;
}

/**
 * @param {string} markdown
 * @param {object} [options]
 * @param {string} [options.namespace] - prefix for slugified (non-ID) heading bookmarks, to avoid collisions across documents
 * @param {(href: string) => {bookmark:string}|{url:string}|null} [options.resolveLink]
 * @param {number} [options.headingLevelOffset] - added to every heading's
 *   level before rendering. Each source file's own `#` is always level 1
 *   in isolation (rules/document-format.md: an item file's heading is H1,
 *   "the file *is* the artifact, not a subsection"), but a whole phase's
 *   worth of item files assembled into one document needs its artifacts
 *   nested *under* the phase's own title, not flattened alongside it —
 *   the caller (build-doc-word.mjs) passes 1 for every file except a
 *   phase's own main/index file, so REQ-001's `#` becomes an H2 under
 *   Requirements' H1, not a second, unrelated H1.
 * @returns {{ rtf: string, headings: Array<{level:number, id:string, text:string, isArtifact:boolean}> }}
 */
export function renderMarkdownToRtf(markdown, options = {}) {
  const namespace = options.namespace || '';
  const resolveLink = options.resolveLink || (() => null);
  const levelOffset = options.headingLevelOffset || 0;
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const headings = [];
  const out = [];
  const usedIds = new Set();

  function uniqueId(id) {
    let candidate = id;
    let n = 2;
    while (usedIds.has(candidate)) { candidate = `${id}-${n}`; n++; }
    usedIds.add(candidate);
    return candidate;
  }

  const HEADING_SIZE = [32, 28, 26, 24, 22, 22]; // half-points, H1..H6
  const HEADING_SPACE_BEFORE = [280, 220, 180, 140, 120, 120];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    // Code fence (mermaid gets an extra label; both render as a
    // monospaced, bordered block — see file header)
    const fenceMatch = line.match(/^```(\S*)\s*$/);
    if (fenceMatch) {
      const lang = fenceMatch[1] || '';
      const codeLines = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { codeLines.push(lines[i]); i++; }
      i++;
      const escapedLines = codeLines.map((l) => escapeRtfText(l)).join('\\line\n');
      if (lang.toLowerCase() === 'mermaid') {
        out.push(`{\\pard\\sb160\\i\\fs18 ${escapeRtfText('[Mermaid diagram — shown as source; see the HTML export (build-doc-site.mjs) for a rendered version]')}\\i0\\par}`);
      }
      out.push(`{\\pard\\box\\brdrs\\brdrw10\\brsp80\\li120\\ri120\\sb${lang.toLowerCase() === 'mermaid' ? '0' : '160'}\\sa160\\f1\\fs18 ${escapedLines}\\par}`);
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = Math.min(headingMatch[1].length + levelOffset, 6);
      const text = headingMatch[2].trim();
      const idMatch = text.match(ID_HEADING_RE);
      let id, isArtifact = false, displayText;
      if (idMatch) {
        id = idMatch[1];
        isArtifact = true;
        displayText = idMatch[2] ? `${idMatch[1]} — ${idMatch[2]}` : idMatch[1];
      } else {
        id = namespace ? `${namespace}--${slugify(text)}` : slugify(text);
        displayText = text;
      }
      id = uniqueId(id);
      const bookmark = sanitizeBookmarkName(id);
      headings.push({ level, id, text, isArtifact });
      const size = HEADING_SIZE[level - 1];
      const before = HEADING_SPACE_BEFORE[level - 1];
      // Headings stay plain black — unlike a link (blue/accent means
      // "clickable" to any reader without explanation) or a muted
      // metadata line (visually secondary, also self-evident), "this
      // heading is colored because it happens to be an artifact ID"
      // isn't a rule a reader can infer on sight, colored-by-level or
      // colored-by-artifact alike (both were tried and looked arbitrary
      // once rendered in a real document).
      // \sN references the stylesheet entry build-doc-word.mjs defines
      // for "heading N" (Word's own built-in style-handle convention —
      // style handle N is Heading N unless a stylesheet says otherwise,
      // which this one deliberately confirms rather than leaves
      // implicit). The direct \outlinelevel/\b/\f2/\fs formatting stays
      // too, as a flat-formatting fallback for a reader that ignores
      // stylesheets entirely — belt and suspenders, not redundant.
      out.push(
        `{\\pard\\s${level}\\keepn\\outlinelevel${level - 1}\\sb${before}\\sa120\\b\\f2\\fs${size} ` +
        `{\\*\\bkmkstart ${bookmark}}${renderInlineRtf(displayText, resolveLink)}{\\*\\bkmkend ${bookmark}}\\b0\\par}`
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (/^-{3,}\s*$/.test(line.trim())) {
      out.push('{\\pard\\brdrb\\brdrs\\brdrw10\\brsp20\\sa200 \\par}');
      i++;
      continue;
    }

    // Table
    if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/.test(lines[i + 1])) {
      const headerCells = line.split('|').slice(1, -1).map((c) => c.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        rows.push(lines[i].split('|').slice(1, -1).map((c) => c.trim()));
        i++;
      }
      const colCount = headerCells.length;
      const colWidth = Math.floor(PAGE_WIDTH_TWIPS / colCount);
      const colWidths = new Array(colCount).fill(colWidth);
      let tableRtf = tableRowRtf(headerCells, colWidths, resolveLink, true);
      for (const row of rows) tableRtf += tableRowRtf(row, colWidths, resolveLink, false);
      out.push(tableRtf);
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { quoteLines.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push(`{\\pard\\li720\\sa160\\i\\fs22 ${renderInlineRtf(quoteLines.join(' '), resolveLink)}\\i0\\par}`);
      continue;
    }

    // Checkbox / bullet / numbered list
    const checkboxMatch = line.match(/^(\s*)-\s+\[( |x|X)\]\s+(.*)$/);
    const bulletMatch = line.match(/^(\s*)-\s+(.*)$/);
    const numberedMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (checkboxMatch || (bulletMatch && !checkboxMatch) || numberedMatch) {
      const isNumbered = !!numberedMatch && !bulletMatch;
      const reMatch = () => lines[i] && (
        isNumbered ? lines[i].match(/^(\s*)\d+\.\s+(.*)$/)
          : lines[i].match(/^(\s*)-\s+(?:\[( |x|X)\]\s+)?(.*)$/)
      );
      let n = 1;
      while (i < lines.length) {
        const m = reMatch();
        if (!m) break;
        let marker, text;
        if (isNumbered) { marker = `${n}.`; text = m[2]; n++; }
        else if (m[2]) { marker = m[2].toLowerCase() === 'x' ? '[x]' : '[ ]'; text = m[3]; }
        else { marker = '\\bullet '; text = m[3]; } // RTF's own bullet control word (trailing space terminates it), not a raw Unicode char
        out.push(`{\\pard\\li720\\fi-360\\sa60\\fs22 ${marker}\\tab ${renderInlineRtf(text, resolveLink)}\\par}`);
        i++;
      }
      continue;
    }

    // Paragraph: consume contiguous non-blank, non-special lines. A
    // bold-only label line always stands alone, same rule as
    // markdown-lite.mjs.
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,6}\s+/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^\|.*\|\s*$/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^-{3,}\s*$/.test(lines[i].trim()) &&
      !/^(\s*)-\s+/.test(lines[i]) &&
      !/^(\s*)\d+\.\s+/.test(lines[i]) &&
      (paraLines.length === 0 || !BOLD_LABEL_RE.test(lines[i]))
    ) {
      paraLines.push(lines[i]);
      i++;
      if (BOLD_LABEL_RE.test(lines[i - 1])) break;
    }
    if (paraLines.length > 0) {
      const text = paraLines.join(' ').trim();
      const isMetadataLine = /^\*(?!\*)(.+)(?<!\*)\*$/.test(text);
      const isLabelLine = paraLines.length === 1 && BOLD_LABEL_RE.test(text);
      const rendered = isMetadataLine
        ? renderInlineRtf(text.slice(1, -1), resolveLink)
        : renderInlineRtf(text, resolveLink);
      if (isMetadataLine) out.push(`{\\pard\\sa160\\i\\cf${CF_MUTED}\\fs20 ${rendered}\\i0\\par}`);
      else if (isLabelLine) out.push(`{\\pard\\sb160\\sa60\\b\\fs22 ${rendered}\\b0\\par}`);
      else out.push(`{\\pard\\sa160\\sl276\\slmult1\\fs22 ${rendered}\\par}`);
    } else {
      i++;
    }
  }

  return { rtf: out.join('\n'), headings };
}
