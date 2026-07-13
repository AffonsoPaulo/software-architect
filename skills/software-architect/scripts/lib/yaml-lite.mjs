// Minimal YAML subset parser — not a general-purpose YAML implementation.
//
// Handles exactly what this Skill's templates use: block mappings, block
// sequences (including sequences of mappings with one level of nested
// mappings inside, e.g. `input: { description: "..." }`), flow sequences
// (`["a", "b"]`), quoted/unquoted scalars, numbers, booleans, null, and
// `#` comments. Indentation is read dynamically from the actual sibling
// lines rather than assumed to be a fixed width, so it tolerates 2-space
// or other consistent indentation — but it is not forgiving of genuinely
// malformed or deeply irregular YAML. If this project's templates ever
// need real YAML features (anchors, multi-line block scalars, etc.), this
// parser needs to grow with them or be replaced.

function stripComment(line) {
  let inS = false;
  let inD = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (c === '#' && !inS && !inD) {
      if (i === 0 || /\s/.test(line[i - 1])) return line.slice(0, i);
    }
  }
  return line;
}

function splitFlowList(inner) {
  const parts = [];
  let depth = 0;
  let inS = false;
  let inD = false;
  let cur = '';
  for (const c of inner) {
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (c === '[' && !inS && !inD) depth++;
    else if (c === ']' && !inS && !inD) depth--;

    if (c === ',' && depth === 0 && !inS && !inD) {
      parts.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  if (cur.trim() !== '') parts.push(cur);
  return parts.map((p) => p.trim());
}

function parseScalar(raw) {
  const s = raw.trim();
  if (s === '' || s === 'null' || s === '~') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
  if ((s.startsWith('"') && s.endsWith('"') && s.length >= 2) ||
      (s.startsWith("'") && s.endsWith("'") && s.length >= 2)) {
    return s.slice(1, -1);
  }
  if (s.startsWith('[') && s.endsWith(']')) {
    const inner = s.slice(1, -1).trim();
    if (inner === '') return [];
    return splitFlowList(inner).map(parseScalar);
  }
  return s;
}

function splitKeyValue(content) {
  const idx = content.indexOf(':');
  if (idx === -1) return null;
  const key = content.slice(0, idx).trim();
  const val = content.slice(idx + 1).trim();
  return [key, val];
}

export function parseYamlLite(text) {
  const rootLines = [];
  for (const raw of text.split('\n')) {
    const line = stripComment(raw).replace(/\s+$/, '');
    if (line.trim() === '') continue;
    const indent = line.match(/^ */)[0].length;
    rootLines.push({ indent, content: line.trim() });
  }

  let pos = 0;

  function parseBlock(minIndent) {
    if (pos >= rootLines.length) return null;
    const first = rootLines[pos];
    if (first.indent < minIndent) return null;
    if (first.content === '-' || first.content.startsWith('- ')) {
      return parseSequence(first.indent);
    }
    return parseMapping(first.indent);
  }

  function parseSequence(indent) {
    const arr = [];
    while (
      pos < rootLines.length &&
      rootLines[pos].indent === indent &&
      (rootLines[pos].content === '-' || rootLines[pos].content.startsWith('- '))
    ) {
      const rest = rootLines[pos].content === '-' ? '' : rootLines[pos].content.slice(2).trim();
      pos++;
      if (rest === '') {
        arr.push(pos < rootLines.length && rootLines[pos].indent > indent ? parseBlock(indent + 1) : null);
        continue;
      }
      const kv = splitKeyValue(rest);
      if (!kv) {
        arr.push(parseScalar(rest));
        continue;
      }
      const [key, val] = kv;
      const obj = {};
      obj[key] = val === '' ? readNestedValue(indent) : parseScalar(val);
      let siblingIndent = null;
      while (pos < rootLines.length && rootLines[pos].indent > indent) {
        if (siblingIndent === null) siblingIndent = rootLines[pos].indent;
        if (rootLines[pos].indent !== siblingIndent) break;
        const kv2 = splitKeyValue(rootLines[pos].content);
        if (!kv2) break;
        const [k2, v2] = kv2;
        pos++;
        obj[k2] = v2 === '' ? readNestedValue(siblingIndent) : parseScalar(v2);
      }
      arr.push(obj);
    }
    return arr;
  }

  function readNestedValue(parentIndent) {
    if (pos < rootLines.length && rootLines[pos].indent > parentIndent) {
      return parseBlock(rootLines[pos].indent);
    }
    return null;
  }

  function parseMapping(indent) {
    const obj = {};
    while (
      pos < rootLines.length &&
      rootLines[pos].indent === indent &&
      !(rootLines[pos].content === '-' || rootLines[pos].content.startsWith('- '))
    ) {
      const kv = splitKeyValue(rootLines[pos].content);
      if (!kv) {
        pos++;
        continue;
      }
      const [key, val] = kv;
      pos++;
      obj[key] = val === '' ? readNestedValue(indent) : parseScalar(val);
    }
    return obj;
  }

  return parseBlock(0) || {};
}
