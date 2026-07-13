#!/usr/bin/env node
// Builds a single, self-contained HTML page from a target project's
// docs/ — a "reads like a Word document" view: one continuous,
// scrollable document with a clickable table of contents on the left,
// covering every phase and every artifact, in order. Read-only: never
// modifies anything under docs/, purely a presentation layer on top of
// what the Skill already produced.
//
// This never runs automatically — it's an on-demand utility the user
// (or the AI, when asked, or offered at the end of phase 17) runs
// after some or all of docs/ is populated.
//
// Usage: node build-doc-site.mjs [project-root] [output-path]
//   project-root defaults to the current working directory.
//   output-path defaults to <project-root>/docs/project-overview.html

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderMarkdown, escapeHtml } from './lib/markdown-lite.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MERMAID_JS = readFileSync(join(__dirname, 'lib', 'vendor', 'mermaid.min.js'), 'utf8');

const COPY_ICON = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M3.5 10V3.5a1 1 0 0 1 1-1H10"/></svg>';
const CHECK_ICON = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8.5l3 3 7-7"/></svg>';

// Wraps one source file's rendered HTML in a container that carries the
// file's own raw markdown (base64, UTF-8 safe) for the hover-reveal
// "copy" button — one button per source .md file, since every file in
// this Skill's docs/ (index or item) is already a complete, standalone
// document per rules/document-format.md.
function wrapArtifactBlock(html, rawContent) {
  const b64 = Buffer.from(rawContent, 'utf8').toString('base64');
  return `<div class="artifact-block">${html}<button type="button" class="copy-btn" data-md="${b64}" title="Copy markdown" aria-label="Copy markdown">${COPY_ICON}</button></div>`;
}

// Mirrors rules/document-locations.md exactly: which phases exist, in
// what order, and — for categories that split into an index + item
// files (rules/document-locations.md's hybrid layout) — the index
// filename and the item-file prefix(es) that belong under it.
const PHASES = [
  { dir: '00-calibration', title: '00 · Project Calibration', kind: 'single', file: 'calibration.md' },
  { dir: '01-discovery', title: '01 · Discovery', kind: 'single', file: 'vision.md' },
  { dir: '02-business-analysis', title: '02 · Business Analysis', kind: 'single', file: 'business-analysis.md' },
  { dir: '03-requirements', title: '03 · Requirements Engineering', kind: 'split', groups: [{ index: 'requirements.md', prefix: 'req' }] },
  { dir: '04-user-stories', title: '04 · User Stories', kind: 'split', groups: [{ index: 'user-stories.md', prefix: 'us' }] },
  { dir: '05-use-cases', title: '05 · Use Cases', kind: 'split', groups: [{ index: 'use-cases.md', prefix: 'uc' }] },
  { dir: '06-domain-model', title: '06 · Domain Model', kind: 'split', groups: [{ index: 'domain-model.md', prefix: 'ent' }] },
  { dir: '07-database-design', title: '07 · Database Design', kind: 'split', groups: [{ index: 'database.md', prefix: 'tbl' }] },
  { dir: '08-architecture', title: '08 · Architecture', kind: 'split', groups: [{ index: 'architecture.md', prefix: 'arch' }], extraDir: 'adr' },
  { dir: '09-api-design', title: '09 · API Design', kind: 'split', groups: [{ index: 'api.md', prefix: 'api' }] },
  { dir: '10-frontend-planning', title: '10 · Frontend Planning', kind: 'single', file: 'frontend.md' },
  { dir: '11-security', title: '11 · Security', kind: 'split', groups: [{ index: 'security.md', prefix: 'sec' }, { index: 'risk-register.md', prefix: 'risk' }] },
  { dir: '12-testing', title: '12 · Testing', kind: 'split', groups: [{ index: 'testing.md', prefix: 'test' }] },
  { dir: '13-deployment', title: '13 · Deployment', kind: 'single', file: 'deployment.md' },
  { dir: '14-roadmap', title: '14 · Roadmap', kind: 'single', file: 'roadmap.md' },
  { dir: '15-backlog', title: '15 · Backlog', kind: 'split', groups: [{ index: 'backlog.md', prefix: 'task' }] },
  { dir: '16-implementation-plan', title: '16 · Implementation Plan', kind: 'single', file: 'implementation-plan.md' },
  { dir: '17-review', title: '17 · Architecture Review', kind: 'single', file: 'review-report.md' }
];

function readIfExists(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : null;
}

function listItemFiles(dir, prefix) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.toLowerCase().startsWith(`${prefix}-`) && f.endsWith('.md'))
    .sort();
}

function rewriteMdLink(href) {
  if (/^https?:\/\//.test(href) || href.startsWith('#')) return href;
  if (href.endsWith('.md')) {
    const base = href.split('/').pop().replace(/\.md$/, '');
    return `#${base.toLowerCase()}`;
  }
  return href;
}

// Renders one phase directory into { html, navItems }. navItems is a
// flat list of { id, text, isArtifact } for headings worth surfacing
// in the sidebar (the phase's own top-level artifacts) — not every
// subheading, to keep the nav usable at 100+ artifacts.
function renderPhase(projectRoot, phase) {
  const dir = join(projectRoot, 'docs', phase.dir);
  if (!existsSync(dir)) return null;

  const sections = [];
  const navItems = [];

  function renderFile(content, namespace) {
    const { html, headings } = renderMarkdown(content, { namespace, rewriteLink: rewriteMdLink });
    sections.push(wrapArtifactBlock(html, content));
    for (const h of headings) {
      if (h.isArtifact) navItems.push({ id: h.id, text: h.text, idLabel: h.idLabel, title: h.title });
    }
  }

  if (phase.kind === 'single') {
    const content = readIfExists(join(dir, phase.file));
    if (content === null) return null;
    renderFile(content, phase.dir);
  } else {
    let foundAny = false;
    for (const group of phase.groups) {
      const indexContent = readIfExists(join(dir, group.index));
      if (indexContent === null) continue;
      foundAny = true;
      renderFile(indexContent, `${phase.dir}-${group.prefix}`);
      for (const itemFile of listItemFiles(dir, group.prefix)) {
        const itemContent = readIfExists(join(dir, itemFile));
        if (itemContent !== null) renderFile(itemContent, phase.dir);
      }
    }
    if (phase.extraDir) {
      const extraPath = join(dir, phase.extraDir);
      if (existsSync(extraPath)) {
        const extraFiles = readdirSync(extraPath).filter((f) => f.endsWith('.md')).sort();
        for (const f of extraFiles) {
          foundAny = true;
          renderFile(readFileSync(join(extraPath, f), 'utf8'), phase.dir);
        }
      }
    }
    if (!foundAny) return null;
  }

  return { html: sections.join('\n'), navItems };
}

function renderChangelog(projectRoot) {
  const path = join(projectRoot, 'docs', 'CHANGELOG.md');
  if (!existsSync(path)) return null;
  const content = readFileSync(path, 'utf8');
  const { html } = renderMarkdown(content, { namespace: 'changelog', rewriteLink: rewriteMdLink });
  return { html: wrapArtifactBlock(html, content) };
}

function renderChangeRequests(projectRoot) {
  const dir = join(projectRoot, 'docs', 'change-requests');
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
  if (files.length === 0) return null;
  const sections = [];
  const navItems = [];
  for (const f of files) {
    const content = readFileSync(join(dir, f), 'utf8');
    const { html, headings } = renderMarkdown(content, { namespace: 'change-requests', rewriteLink: rewriteMdLink });
    sections.push(wrapArtifactBlock(html, content));
    for (const h of headings) if (h.isArtifact) navItems.push({ id: h.id, text: h.text, idLabel: h.idLabel, title: h.title });
  }
  return { html: sections.join('\n'), navItems };
}

function buildNav(phaseId, title, navItems) {
  let nav = `<li class="nav-phase"><a href="#${phaseId}">${escapeHtml(title)}</a>`;
  if (navItems.length > 0) {
    nav += '<ul class="nav-items">';
    for (const item of navItems) {
      const label = item.idLabel
        ? `<span class="nav-chip">${escapeHtml(item.idLabel)}</span>${item.title ? ` ${escapeHtml(item.title)}` : ''}`
        : escapeHtml(item.text);
      nav += `<li><a href="#${item.id}">${label}</a></li>`;
    }
    nav += '</ul>';
  }
  nav += '</li>';
  return nav;
}

const PAGE_TEMPLATE = (title, navHtml, contentHtml, mermaidJs) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
:root {
  --bg: #ffffff;
  --bg-sidebar: #f6f5f3;
  --text: #1c1c1c;
  --text-muted: #6b6b6b;
  --border: #e0ddd8;
  --accent: #8a5a3b;
  --code-bg: #f2f0ec;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --bg-sidebar: #222220;
    --text: #e8e6e2;
    --text-muted: #a3a099;
    --border: #3a3835;
    --accent: #d3a17e;
    --code-bg: #262422;
  }
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.65;
}
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
a:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
nav.sidebar {
  width: 300px;
  box-sizing: border-box;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  padding: 24px 16px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
}
nav.sidebar h2 {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin: 0 0 12px 4px;
}
nav.sidebar ul { list-style: none; margin: 0; padding: 0; }
nav.sidebar .nav-chip {
  display: inline-block;
  font-family: ui-monospace, 'SF Mono', 'Cascadia Code', 'Roboto Mono', Menlo, Consolas, monospace;
  font-size: 10px;
  font-weight: 600;
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 3px;
  padding: 0 4px;
  margin-right: 5px;
  vertical-align: middle;
}
nav.sidebar .nav-phase {
  border-left: 3px solid transparent;
}
nav.sidebar .nav-phase.active { border-left-color: var(--accent); background: var(--border); }
nav.sidebar .nav-phase > a {
  display: block;
  padding: 6px 8px;
  border-radius: 6px;
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
}
nav.sidebar .nav-phase > a:hover { background: var(--border); }
nav.sidebar .nav-items { margin: 2px 0 8px 12px; }
nav.sidebar .nav-items a {
  display: block;
  padding: 3px 8px;
  border-radius: 6px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 12px;
  border-left: 2px solid transparent;
}
nav.sidebar .nav-items a:hover { background: var(--border); color: var(--text); }
nav.sidebar .nav-items a.active { color: var(--text); border-left-color: var(--accent); font-weight: 600; }
main {
  margin-left: 300px;
  max-width: 900px;
  padding: 48px 56px 120px;
}
main section { margin-top: 72px; }
main > section:first-child { margin-top: 0; }
main .artifact-block { position: relative; margin-top: 40px; }
main section > .artifact-block:first-child { margin-top: 0; }
main h1, main h2, main h3, main h4 {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 700;
  line-height: 1.3;
  scroll-margin-top: 24px;
}
main h1 { font-size: 26px; margin-top: 0; border-bottom: 2px solid var(--border); padding-bottom: 10px; }
main h2 { font-size: 20px; margin-top: 32px; color: var(--accent); }
main h3 { font-size: 17px; margin-top: 26px; }
main h4 { font-size: 15px; margin-top: 20px; }
main .artifact-id {
  display: inline-block;
  font-family: ui-monospace, 'SF Mono', 'Cascadia Code', 'Roboto Mono', Menlo, Consolas, monospace;
  font-size: 0.6em;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 4px;
  padding: 2px 6px;
  margin-right: 8px;
  vertical-align: middle;
  transform: translateY(-1px);
}
main p.metadata-line { color: var(--text-muted); font-style: italic; font-size: 14px; margin: -6px 0 16px; }
main p.body-text { margin: 16px 0; }
main p.label-line { margin: 20px 0 4px; }
main p.label-line + p.body-text { margin-top: 4px; }
main .table-wrap { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin: 20px 0; }
main table { border-collapse: collapse; width: 100%; margin: 0; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
main th, main td { border: 1px solid var(--border); padding: 6px 10px; text-align: left; vertical-align: top; }
main th { background: var(--bg-sidebar); }
main tr:first-child th, main tr:first-child td { border-top: none; }
main tr:last-child td { border-bottom: none; }
main th:first-child, main td:first-child { border-left: none; }
main th:last-child, main td:last-child { border-right: none; }
main code { background: var(--code-bg); padding: 1px 5px; border-radius: 4px; font-size: 0.9em; }
main pre.code-block { background: var(--code-bg); padding: 14px; border-radius: 8px; overflow-x: auto; }
main pre.code-block code { background: none; padding: 0; }
main pre.mermaid { background: var(--bg); text-align: center; }
main blockquote { border-left: 3px solid var(--accent); margin: 16px 0; padding: 4px 16px; color: var(--text-muted); }
main hr { border: none; border-top: 1px solid var(--border); margin: 32px 0; }
main a { color: var(--accent); }
main ul, main ol { margin: 4px 0 16px; padding-left: 26px; }
main li { margin: 4px 0; }
main li.checklist-item { list-style: none; margin-left: -20px; }
main li.checklist-item input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  margin: 0 8px 0 0;
  border: 1.5px solid var(--accent);
  border-radius: 3px;
  background: var(--bg);
  vertical-align: middle;
  position: relative;
  top: -1px;
  cursor: default;
  opacity: 1;
}
main li.checklist-item input[type="checkbox"]:checked { background: var(--accent); }
main li.checklist-item input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid var(--bg);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.page-header {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 8px;
}
.copy-btn {
  position: absolute;
  top: 2px;
  right: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-sidebar);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  opacity: 0;
  transition: opacity .15s, color .15s, border-color .15s;
}
.artifact-block:hover .copy-btn,
.artifact-block:focus-within .copy-btn {
  opacity: 1;
}
.copy-btn:hover { background: var(--border); color: var(--text); }
.copy-btn.copied { color: var(--accent); border-color: var(--accent); opacity: 1; }
@media print {
  nav.sidebar { display: none; }
  main { max-width: 100%; margin-left: 0; padding: 0; }
  main .artifact-id { color: #000; border-color: #000; }
  .copy-btn { display: none; }
}
@media (max-width: 900px) {
  nav.sidebar { width: 100%; height: auto; position: relative; bottom: auto; }
  main { margin-left: 0; padding: 24px; }
  .copy-btn { opacity: 1; }
}
</style>
</head>
<body>
<nav class="sidebar">
<h2>Contents</h2>
<ul>
${navHtml}
</ul>
</nav>
<main>
<div class="page-header">Generated by software-architect &middot; read-only export of docs/</div>
${contentHtml}
</main>
<script>
// Vendored Mermaid.js (MIT license) — see scripts/lib/vendor/NOTICE.md.
// Inlined so this page renders diagrams fully offline.
${mermaidJs}
</script>
<script>
  if (window.mermaid) {
    mermaid.initialize({ startOnLoad: false, theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default' });
    mermaid.run({ querySelector: '.mermaid' });
  }
  (function () {
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('nav.sidebar .nav-phase, nav.sidebar .nav-items li'));
    var targets = navLinks.map(function (li) {
      var a = li.querySelector('a');
      var id = a ? a.getAttribute('href').slice(1) : null;
      var el = id ? document.getElementById(id) : null;
      return el ? { li: li, a: a, el: el } : null;
    }).filter(Boolean);
    if (!targets.length || !('IntersectionObserver' in window)) return;
    var current = null;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var match = targets.find(function (t) { return t.el === entry.target; });
        if (!match) return;
        if (current) { current.li.classList.remove('active'); current.a.classList.remove('active'); }
        match.li.classList.add('active');
        match.a.classList.add('active');
        current = match;
      });
    }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });
    targets.forEach(function (t) { observer.observe(t.el); });
  })();
  (function () {
    var CHECK_ICON = ${JSON.stringify(CHECK_ICON)};
    function b64ToUtf8(b64) {
      var binary = atob(b64);
      var bytes = Uint8Array.from(binary, function (c) { return c.charCodeAt(0); });
      return new TextDecoder('utf-8').decode(bytes);
    }
    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }
    function showCopied(btn) {
      var original = btn.innerHTML;
      btn.innerHTML = CHECK_ICON;
      btn.classList.add('copied');
      setTimeout(function () {
        btn.innerHTML = original;
        btn.classList.remove('copied');
      }, 1200);
    }
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.copy-btn');
      if (!btn) return;
      var md = b64ToUtf8(btn.getAttribute('data-md'));
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(md).then(function () { showCopied(btn); }, function () {
          fallbackCopy(md);
          showCopied(btn);
        });
      } else {
        fallbackCopy(md);
        showCopied(btn);
      }
    });
  })();
</script>
</body>
</html>
`;

export function buildDocSite(projectRoot, outputPath) {
  const navParts = [];
  const contentParts = [];

  for (const phase of PHASES) {
    const rendered = renderPhase(projectRoot, phase);
    if (!rendered) continue;
    const phaseId = phase.dir;
    navParts.push(buildNav(phaseId, phase.title, rendered.navItems));
    contentParts.push(`<section id="${phaseId}">${rendered.html}</section>`);
  }

  const crRendered = renderChangeRequests(projectRoot);
  if (crRendered) {
    navParts.push(buildNav('change-requests', 'Change Requests', crRendered.navItems));
    contentParts.push(`<section id="change-requests"><h1>Change Requests</h1>${crRendered.html}</section>`);
  }

  const changelogRendered = renderChangelog(projectRoot);
  if (changelogRendered) {
    navParts.push(buildNav('changelog', 'Changelog', []));
    contentParts.push(`<section id="changelog">${changelogRendered.html}</section>`);
  }

  const projectName = basename(resolve(projectRoot));
  const title = `${projectName} — Project Documentation`;
  const html = PAGE_TEMPLATE(title, navParts.join('\n'), contentParts.join('\n'), MERMAID_JS);
  writeFileSync(outputPath, html, 'utf8');
  return { outputPath, phasesRendered: contentParts.length };
}

function main() {
  const [projectRootArg, outputArg] = process.argv.slice(2);
  const projectRoot = projectRootArg || process.cwd();
  const outputPath = outputArg || join(projectRoot, 'docs', 'project-overview.html');
  if (!existsSync(join(projectRoot, 'docs'))) {
    console.error(`No docs/ found under ${projectRoot}`);
    process.exit(1);
  }
  const result = buildDocSite(projectRoot, outputPath);
  console.log(`Built ${result.outputPath} (${result.phasesRendered} section${result.phasesRendered === 1 ? '' : 's'}).`);
  console.log('Fully self-contained — Mermaid is inlined, no internet connection needed to view it.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
