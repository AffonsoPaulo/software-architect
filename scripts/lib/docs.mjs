// Shared document loading for the validation scripts: front-matter
// extraction, walking a target project's docs/ tree, and pulling out
// artifacts (anything with an `id` matching a known prefix) and
// references (anything with a `traces_to` array, whether or not it has
// its own id — this is what lets frontend.md screens, which have no
// formal ID prefix, still participate in coverage checks).

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseYamlLite } from './yaml-lite.mjs';

const FRONT_MATTER_RE = /^---\n([\s\S]*?)\n---/;

export function extractFrontMatter(fileContent) {
  const m = fileContent.match(FRONT_MATTER_RE);
  if (!m) return {};
  try {
    return parseYamlLite(m[1]) || {};
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

export function loadAllDocuments(projectRoot) {
  const docsDir = join(projectRoot, 'docs');
  const files = walk(docsDir, []);
  return files.map((path) => {
    const content = readFileSync(path, 'utf8');
    return {
      path: relative(projectRoot, path),
      absPath: path,
      data: extractFrontMatter(content),
    };
  });
}

export function loadProjectState(projectRoot) {
  const path = join(projectRoot, 'docs', 'project-state.md');
  if (!existsSync(path)) return null;
  const content = readFileSync(path, 'utf8');
  return extractFrontMatter(content);
}

// Deliberately permissive — this only decides what COUNTS as an artifact
// candidate, not whether it's well-formed. A too-strict pattern here
// would silently hide malformed IDs (e.g. "REQ-01", too few digits)
// from validate-ids.mjs instead of letting it flag them. Format
// correctness is validate-ids.mjs's job alone.
const ID_RE = /^[A-Za-z]+-[A-Za-z0-9]+$/;

// Recursively walks a parsed front-matter object looking for:
//  - artifacts: any object with an `id` field matching PREFIX-NNN
//  - references: any object with a `traces_to` array (artifact or not)
// Both are tagged with the source document's path for reporting.
export function extractArtifactsAndReferences(doc) {
  const artifacts = [];
  const references = [];

  function walkNode(node) {
    if (Array.isArray(node)) {
      for (const item of node) walkNode(item);
      return;
    }
    if (node && typeof node === 'object') {
      if (typeof node.id === 'string' && ID_RE.test(node.id)) {
        artifacts.push({ id: node.id, path: doc.path, raw: node });
      }
      if (Array.isArray(node.traces_to) && node.traces_to.length > 0) {
        references.push({
          id: typeof node.id === 'string' ? node.id : null,
          path: doc.path,
          traces_to: node.traces_to.filter((t) => typeof t === 'string'),
          raw: node,
        });
      } else if ('traces_to' in node) {
        // present but empty/null — still a reference, with zero targets,
        // relevant for orphan detection
        references.push({
          id: typeof node.id === 'string' ? node.id : null,
          path: doc.path,
          traces_to: [],
          raw: node,
        });
      }
      for (const key of Object.keys(node)) {
        if (key === 'traces_to') continue;
        walkNode(node[key]);
      }
    }
  }

  walkNode(doc.data);
  return { artifacts, references };
}

export function buildProjectIndex(projectRoot) {
  const documents = loadAllDocuments(projectRoot);
  const artifacts = [];
  const references = [];
  for (const doc of documents) {
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
  const m = id.match(/^([A-Z]+)-\d+$/);
  return m ? m[1] : null;
}
