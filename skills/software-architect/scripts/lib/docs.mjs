// Shared document loading for the validation scripts.
//
// `project-state.md` is the one file under docs/ that stays YAML
// (rules/document-format.md) — it's the Skill's own operational state,
// never meant to be read by a stakeholder. Every other document under
// docs/ is plain markdown: artifacts and references are declared as a
// heading (optionally starting with an ID) immediately followed by an
// italicized `*Key: value · Key: value*` metadata line. See
// rules/document-format.md for the full convention this file parses.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseYamlLite } from './yaml-lite.mjs';

// project-state.md is pure YAML end to end (rules/document-format.md,
// templates/project-state.md) — it never needs `---`/`---` delimiters,
// unlike the legacy front-matter-block convention this function is
// named after. A conforming file is just the YAML directly, and
// parseYamlLite already treats a bare `---` line as unparseable
// key:value content and silently skips it (it's not a comment, block
// scalar, or mapping/sequence entry), so a file that *does* still carry
// delimiters — as both worked examples used to, until that was corrected
// — parses identically either way. There is deliberately no branching
// here on whether delimiters are present; the same parse handles both,
// so no file needs to declare which form it's in.
export function extractFrontMatter(fileContent) {
  try {
    return parseYamlLite(fileContent) || {};
  } catch (err) {
    return { __parse_error__: String(err && err.message ? err.message : err) };
  }
}

function walk(dir, out) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (entry.endsWith('.md')) out.push(full);
  }
  return out;
}

function isProjectStatePath(path) {
  return path.replace(/\\/g, '/').endsWith('docs/project-state.md');
}

export function loadAllDocuments(projectRoot) {
  const docsDir = join(projectRoot, 'docs');
  const files = walk(docsDir, []);
  return files.map((path) => {
    const content = readFileSync(path, 'utf8');
    const relPath = relative(projectRoot, path);
    const isState = isProjectStatePath(path);
    return {
      path: relPath,
      absPath: path,
      content,
      // `data` only exists for project-state.md (YAML). Every other
      // document is parsed on demand via extractArtifactsAndReferences,
      // which reads `content` directly — there is no intermediate
      // "data" object for markdown documents.
      data: isState ? extractFrontMatter(content) : null,
      isProjectState: isState,
    };
  });
}

export function loadProjectState(projectRoot) {
  const path = join(projectRoot, 'docs', 'project-state.md');
  if (!existsSync(path)) return null;
  const content = readFileSync(path, 'utf8');
  return extractFrontMatter(content);
}

// The PREFIX must be uppercase — that's what distinguishes a real
// artifact ID (REQ-001, US-002) from an intentional non-ID heading (a
// frontend.md screen, a roadmap.md milestone — both documented in their
// templates as deliberately not using the ID system). The digit part is
// deliberately permissive (not "at least 3 digits") — this only decides
// what COUNTS as an artifact candidate, not whether it's well-formed.
// Format correctness is validate-ids.mjs's job alone.
const HEADING_RE = /^(#{1,6})\s+(.*)$/;
const HEADING_ID_RE = /^([A-Z]+-[A-Za-z0-9]+)(?:\s+—\s+.*)?\s*$/;
const METADATA_LINE_RE = /^\*(.+)\*$/;

// Keys whose value is a comma-separated list of IDs rather than a plain
// scalar string — see rules/document-format.md's "Standard keys" table.
const LIST_KEYS = new Set(['traces_to', 'delivers', 'depends_on', 'parallelizable_with']);

const EMPTY_TOKENS = new Set(['(none)', 'none', '—', '-', 'n/a']);

function keyToField(rawKey) {
  return rawKey.trim().toLowerCase().replace(/\s+/g, '_');
}

function parseMetadataLine(line) {
  const m = line.match(METADATA_LINE_RE);
  if (!m) return null;
  const fields = {};
  const segments = m[1].split('·');
  for (const segment of segments) {
    const idx = segment.indexOf(':');
    if (idx === -1) continue;
    const field = keyToField(segment.slice(0, idx));
    const rawValue = segment.slice(idx + 1).trim();
    if (LIST_KEYS.has(field)) {
      const tokens = rawValue
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0 && !EMPTY_TOKENS.has(t.toLowerCase()));
      fields[field] = tokens;
    } else {
      fields[field] = rawValue;
    }
  }
  return fields;
}

// Parses one markdown document's artifacts and references directly from
// its raw content — no intermediate "data" object, unlike project-state.md.
// An artifact is any heading starting with a PREFIX-NNN token. A
// reference is any heading (with or without a leading ID) immediately
// followed by a metadata line that includes a `traces_to`, `delivers`,
// or `depends_on` key — this is what lets a screen or milestone (no
// reserved ID prefix) still participate in coverage checks.
export function extractArtifactsAndReferences(doc) {
  const artifacts = [];
  const references = [];
  const lines = doc.content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(HEADING_RE);
    if (!headingMatch) continue;
    const headingText = headingMatch[2].trim();
    const idMatch = headingText.match(HEADING_ID_RE);
    const id = idMatch ? idMatch[1] : null;

    // Find the next non-blank line; it's the metadata line only if it
    // comes immediately (blank lines are fine, prose is not).
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;
    const fields = j < lines.length ? parseMetadataLine(lines[j].trim()) : null;
    if (!fields) continue;

    if (id) {
      artifacts.push({ id, path: doc.path, raw: fields });
    }
    if ('traces_to' in fields || 'delivers' in fields || 'depends_on' in fields) {
      references.push({
        id,
        path: doc.path,
        traces_to: fields.traces_to || [],
        raw: fields,
      });
    }
  }

  return { artifacts, references };
}

export function buildProjectIndex(projectRoot) {
  const documents = loadAllDocuments(projectRoot);
  const artifacts = [];
  const references = [];
  for (const doc of documents) {
    if (doc.isProjectState) continue; // operational state, not a document artifact
    const found = extractArtifactsAndReferences(doc);
    artifacts.push(...found.artifacts);
    references.push(...found.references);
  }
  const byId = new Map();
  for (const a of artifacts) {
    if (!byId.has(a.id)) byId.set(a.id, []);
    byId.get(a.id).push(a);
  }
  return { documents, artifacts, references, byId };
}

export function prefixOf(id) {
  const m = id.match(/^([A-Z]+)-[A-Za-z0-9]+$/);
  return m ? m[1] : null;
}
