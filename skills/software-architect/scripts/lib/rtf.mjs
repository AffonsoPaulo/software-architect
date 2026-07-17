// Low-level RTF text escaping, shared by markdown-to-rtf.mjs and any
// future RTF-emitting script. Not a general RTF writer — just the two
// primitives every control-word-heavy renderer needs: escaping plain
// text, and sanitizing a string into a valid RTF bookmark name.

// Every RTF-special character (`\`, `{`, `}`) needs escaping, and every
// character outside 7-bit ASCII needs a `\uN` unicode escape — RTF's
// classic 8-bit encodings can't represent Portuguese/Spanish/etc.
// accented characters (or anything further from Latin-1) reliably
// across readers, but \u is understood by every RTF reader that
// matters (Word, LibreOffice, Apple's TextEdit/textutil, Google Docs'
// importer). `?` after each \uN is the mandatory fallback character for
// readers that don't support \u at all — none we target lack it, but
// leaving it off is invalid RTF per spec.
export function escapeRtfText(text) {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (ch === '\\') { out += '\\\\'; continue; }
    if (ch === '{') { out += '\\{'; continue; }
    if (ch === '}') { out += '\\}'; continue; }
    if (code < 128) { out += ch; continue; }
    if (code > 0xffff) {
      // Outside the BMP (emoji, etc.) — encode as a UTF-16 surrogate
      // pair, one \u escape per code unit, per the RTF spec.
      const high = Math.floor((code - 0x10000) / 0x400) + 0xd800;
      const low = ((code - 0x10000) % 0x400) + 0xdc00;
      out += `\\u${toSigned16(high)}?\\u${toSigned16(low)}?`;
    } else {
      out += `\\u${toSigned16(code)}?`;
    }
  }
  return out;
}

// \u takes a signed 16-bit integer — a code unit >= 32768 has to be
// written as its negative twin (RTF has no unsigned form here).
function toSigned16(n) {
  return n > 32767 ? n - 65536 : n;
}

// RTF bookmark names are plain identifiers — no hyphens, spaces, or
// punctuation. Artifact IDs (`REQ-001`) always contain a hyphen, so
// this is applied everywhere a bookmark or its target is named.
export function sanitizeBookmarkName(name) {
  return name.replace(/[^A-Za-z0-9_]/g, '_');
}

// Field-instruction text (inside \fldinst, e.g. a HYPERLINK target) has
// its own, narrower escaping need than regular document text: a literal
// backslash or double-quote would break the instruction's own syntax
// (a quoted string, a \l switch). escapeRtfText's full \u-unicode
// escaping isn't used here deliberately — some readers parse \fldinst
// content differently from a body text run, so this stays minimal and
// targeted at the two characters that would actually corrupt the field.
export function escapeRtfFieldInstruction(text) {
  return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
