#!/usr/bin/env node
/**
 * Content-parity check: proves src/content/ preserves the existing site WORD FOR WORD.
 *
 * Baseline: index.html on main @ bd1dab3 (override with PARITY_BASE=<commit>), read via `git show`.
 *
 *  1. Visible text   — every text node in the original <body> exists verbatim in src/content, and every
 *                      string in src/content exists in the original (text, attribute, or page-script
 *                      literal). Nothing lost, nothing invented.
 *  2. Headings       — every original h1/h2/h3 is present.
 *  3. Links          — every original <a> (href, new-tab, download, link text) maps 1:1 to a content link.
 *  4. Accessibility  — every alt text and aria-label is present.
 *  5. Structure      — section ids and order; contact-form fields, labels, messages and recipient.
 *  6. Metadata       — built dist/index.html vs original <head>: lang, title, every name/property meta,
 *                      canonical, icon, Permissions-Policy, JSON-LD (deep-equal). CSP and the font
 *                      request differ by design (approved in v2 Stage 1) and are reported, not failed.
 *
 * Approved content changes (scripts/approved-changes.json) are the ONLY allowed differences: approved
 * removals may be missing from content, approved additions may be absent from the original. Each approved
 * change must actually be applied, otherwise the check fails.
 *
 * Exit code 1 on any failure. A JSON report is written to dist/parity-report.json when dist/ exists.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'parse5'
import { content, sectionOrder } from '../src/content/index.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const BASE = process.env.PARITY_BASE ?? 'bd1dab3'

const norm = (s) => s.replace(/\s+/g, ' ').trim()

/* Presentational separators the original markup puts inside text nodes. Each is documented and counted. */
const PRESENTATIONAL_RULES = [
  { id: 'leading-middot', description: 'Leading "· " before the organisation location (experience)', re: /^· / },
]
/* Content changes the site owner explicitly approved (see scripts/approved-changes.json). */
const approved = JSON.parse(readFileSync(new URL('./approved-changes.json', import.meta.url), 'utf8')).changes
const approvedAdds = new Map(approved.filter((c) => c.type === 'add').map((c) => [norm(c.text), c]))
const approvedRemovals = new Map(approved.filter((c) => c.type === 'remove').map((c) => [norm(c.text), c]))
/* Content keys that hold element types, not copy. */
const NON_TEXT_KEYS = new Set(['type'])

// ---------- helpers ----------
const squash = (s) => s.replace(/\s+/g, '')
const attr = (n, name) => n.attrs?.find((a) => a.name === name)?.value
const hasAttr = (n, name) => Boolean(n.attrs?.some((a) => a.name === name))
const SKIP = new Set(['script', 'style', 'noscript', 'svg', 'template'])

function walk(node, fn, ancestors = []) {
  fn(node, ancestors)
  for (const c of node.childNodes ?? []) walk(c, fn, [...ancestors, node])
}
function find(node, pred) {
  let hit
  walk(node, (n) => { if (!hit && pred(n)) hit = n })
  return hit
}
function findAll(node, pred) {
  const out = []
  walk(node, (n) => { if (pred(n)) out.push(n) })
  return out
}
function textOf(node) {
  let s = ''
  walk(node, (n, anc) => {
    if (n.nodeName === '#text' && !anc.some((a) => SKIP.has(a.nodeName))) s += n.value
  })
  return norm(s)
}
const counter = (items) => items.reduce((m, k) => m.set(k, (m.get(k) ?? 0) + 1), new Map())

const results = []
const record = (area, ok, detail, info) => results.push({ area, ok, detail, info })

// ---------- original page ----------
let originalHtml
try {
  originalHtml = execFileSync('git', ['show', `${BASE}:index.html`], { cwd: root, encoding: 'utf8' })
} catch {
  console.error(`✗ Cannot read index.html at ${BASE}. In CI use actions/checkout with fetch-depth: 0.`)
  process.exit(1)
}
const doc = parse(originalHtml)
const html = find(doc, (n) => n.nodeName === 'html')
const head = find(doc, (n) => n.nodeName === 'head')
const body = find(doc, (n) => n.nodeName === 'body')

// Text nodes of <body>, in order
const originalText = []
walk(body, (n, anc) => {
  if (n.nodeName !== '#text' || anc.some((a) => SKIP.has(a.nodeName))) return
  const t = norm(n.value)
  if (t) originalText.push(t)
})

// Attribute values (hrefs, ids, src, alt, aria-label, for, name) and accessible names
const originalAttrValues = new Set()
const accessibleNames = []
walk(body, (n) => {
  for (const a of n.attrs ?? []) {
    if (['href', 'id', 'src', 'alt', 'aria-label', 'for', 'name'].includes(a.name)) originalAttrValues.add(norm(a.value))
    if (a.name === 'alt' || a.name === 'aria-label') accessibleNames.push(norm(a.value))
  }
})

// String literals in the page's own inline script (runtime copy such as form messages)
const scriptLiterals = new Set()
for (const s of findAll(body, (n) => n.nodeName === 'script' && !attr(n, 'type'))) {
  const code = (s.childNodes ?? []).map((c) => c.value ?? '').join('')
  for (const m of code.matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
    try { const v = norm(JSON.parse(`"${m[1]}"`)); if (v) scriptLiterals.add(v) } catch { /* ignore */ }
  }
}

// ---------- content ----------
const contentStrings = [] // { path, key, value }
const contentLinks = [] // objects with an href
;(function collect(v, path, key) {
  if (typeof v === 'string') { contentStrings.push({ path, key, value: norm(v) }); return }
  if (Array.isArray(v)) { v.forEach((x, i) => collect(x, `${path}[${i}]`, key)); return }
  if (v && typeof v === 'object') {
    if (typeof v.href === 'string') contentLinks.push({ path, obj: v })
    for (const [k, x] of Object.entries(v)) collect(x, path ? `${path}.${k}` : k, k)
  }
})(content, '', '')
const contentTextSet = new Set(contentStrings.filter((s) => !NON_TEXT_KEYS.has(s.key)).map((s) => s.value))

// ---------- 1. Visible text ----------
const ruleHits = Object.fromEntries(PRESENTATIONAL_RULES.map((r) => [r.id, []]))
const missing = []
const removedByApproval = []
for (const t of originalText) {
  if (contentTextSet.has(t)) continue
  const rule = PRESENTATIONAL_RULES.find((r) => r.re.test(t) && contentTextSet.has(t.replace(r.re, '')))
  if (rule) { ruleHits[rule.id].push(t); continue }
  if (approvedRemovals.has(t)) { removedByApproval.push(t); continue }
  missing.push(t)
}
record('Visible text: original → content', missing.length === 0,
  missing.length ? `${missing.length} original text node(s) not found: ${JSON.stringify(missing)}` :
  `${originalText.length} text nodes (${new Set(originalText).size} distinct) all present`,
  [...Object.entries(ruleHits).filter(([, v]) => v.length).map(([k, v]) => `rule ${k}: ${v.length} node(s) ${JSON.stringify(v)}`),
   ...(removedByApproval.length ? [`approved removals: ${JSON.stringify(removedByApproval)}`] : [])].join('; ') || undefined)

// Text with a documented presentational separator removed is also an original string.
const ruleStripped = PRESENTATIONAL_RULES.flatMap((r) => ruleHits[r.id].map((t) => t.replace(r.re, '')))
const allowed = new Set([...originalText, ...ruleStripped, ...originalAttrValues, ...scriptLiterals])
const invented = contentStrings.filter((s) => !NON_TEXT_KEYS.has(s.key) && s.value && !allowed.has(s.value) && !approvedAdds.has(s.value))
const addedByApproval = contentStrings.filter((s) => approvedAdds.has(s.value) && !allowed.has(s.value)).map((s) => `${s.path}="${s.value}"`)
record('Visible text: content → original (nothing invented)', invented.length === 0,
  invented.length ? `${invented.length} content string(s) not in the original: ${JSON.stringify(invented.map((s) => `${s.path}="${s.value}"`))}` :
  `${contentStrings.length} content strings all traced to the original page or to an approved change`,
  addedByApproval.length ? `approved additions: ${JSON.stringify(addedByApproval)}` : undefined)

// Every approved change must be applied — no stale approvals.
const notApplied = [
  ...[...approvedAdds.values()].filter((c) => !contentTextSet.has(norm(c.text))).map((c) => `${c.id}: addition not in content`),
  ...[...approvedRemovals.values()].filter((c) => contentTextSet.has(norm(c.text))).map((c) => `${c.id}: removed text still in content`),
  ...[...approvedRemovals.values()].filter((c) => !originalText.includes(norm(c.text))).map((c) => `${c.id}: removal does not exist on the original page`),
]
record('Approved content changes', notApplied.length === 0,
  notApplied.length ? notApplied.join('; ') : `${approved.length} approved change(s), all applied: ${approved.map((c) => `${c.id} (${c.type}, ${c.date})`).join(', ')}`)

const oCount = counter(originalText.map((t) => PRESENTATIONAL_RULES.reduce((x, r) => (ruleHits[r.id].includes(x) ? x.replace(r.re, '') : x), t)))
const cCount = counter(contentStrings.map((s) => s.value))
const multiplicity = [...oCount].filter(([t, n]) => !approvedRemovals.has(t) && (cCount.get(t) ?? 0) < n).map(([t, n]) => `"${t}" ×${n} on page, ×${cCount.get(t) ?? 0} in content`)
record('Visible text: repeated strings', true, `${multiplicity.length} string(s) appear more often on the page than in content (reused via shared content, informational)`,
  multiplicity.length ? multiplicity.join('; ') : undefined)

// ---------- 2. Headings ----------
const headings = findAll(body, (n) => ['h1', 'h2', 'h3'].includes(n.nodeName)).map((n) => ({ level: n.nodeName, text: textOf(n) }))
const h1Composed = `${content.hero.name.lead} ${content.hero.name.accent}`
const missingHeadings = headings.filter((h) => !contentTextSet.has(h.text) && !(h.level === 'h1' && h.text === h1Composed))
const byLevel = counter(headings.map((h) => h.level))
record('Headings', missingHeadings.length === 0,
  missingHeadings.length ? `missing: ${JSON.stringify(missingHeadings)}` :
  `all ${headings.length} present (h1 ×${byLevel.get('h1') ?? 0}, h2 ×${byLevel.get('h2') ?? 0}, h3 ×${byLevel.get('h3') ?? 0})`)

// ---------- 3. Links ----------
const originalLinks = findAll(body, (n) => n.nodeName === 'a').map((a) => {
  const rel = attr(a, 'rel') ?? ''
  return {
    href: attr(a, 'href'),
    external: attr(a, 'target') === '_blank' && rel.includes('noopener') && rel.includes('noreferrer'),
    download: hasAttr(a, 'download'),
    text: squash(textOf(a)),
  }
})
const linkCandidates = ({ obj }) => {
  const parts = [obj.label, obj.value, (obj.key ?? '') + (obj.value ?? ''), (obj.mark ?? '') + (obj.name ?? '')]
  return new Set(parts.filter(Boolean).map(squash))
}
const pool = contentLinks.map((l) => ({ ...l, used: false }))
const unmatchedOriginal = []
for (const o of originalLinks) {
  const hit = pool.find((c) => !c.used && c.obj.href === o.href && Boolean(c.obj.external) === o.external &&
    Boolean(c.obj.download) === o.download && linkCandidates(c).has(o.text))
  if (hit) hit.used = true
  else unmatchedOriginal.push(o)
}
const unmatchedContent = pool.filter((c) => !c.used).map((c) => `${c.path} → ${c.obj.href}`)
record('Links', unmatchedOriginal.length === 0 && unmatchedContent.length === 0,
  unmatchedOriginal.length || unmatchedContent.length
    ? `unmatched original: ${JSON.stringify(unmatchedOriginal)}; unmatched content: ${JSON.stringify(unmatchedContent)}`
    : `all ${originalLinks.length} links matched 1:1 (href, link text, new-tab + rel, download) — ${originalLinks.filter((l) => l.external).length} external, ${originalLinks.filter((l) => l.download).length} download`)

// ---------- 4. Accessible names ----------
const missingNames = accessibleNames.filter((n) => !contentTextSet.has(n))
record('Accessible names (alt, aria-label)', missingNames.length === 0,
  missingNames.length ? `missing: ${JSON.stringify(missingNames)}` : `all ${accessibleNames.length} present: ${JSON.stringify(accessibleNames)}`)

// ---------- 5. Structure ----------
const originalSections = findAll(body, (n) => n.nodeName === 'section').map((n) => attr(n, 'id'))
const sameSet = (x, y) => JSON.stringify([...x].sort()) === JSON.stringify([...y].sort())
{
  const approvedOrder = approved.find((c) => c.type === 'reorder-sections')?.order
  const expected = approvedOrder ?? originalSections
  const ok = sameSet(originalSections, sectionOrder) && JSON.stringify(expected) === JSON.stringify([...sectionOrder])
  record('Section ids and order', ok,
    ok ? `${sectionOrder.join(' → ')}${approvedOrder ? ` (approved reorder; original: ${originalSections.join(' → ')})` : ''}`
       : `content ${JSON.stringify(sectionOrder)} vs expected ${JSON.stringify(expected)} (original ${JSON.stringify(originalSections)})`)
}
{
  const nav = find(body, (n) => n.nodeName === 'nav')
  const originalNav = findAll(nav, (n) => n.nodeName === 'a').map((a) => attr(a, 'href'))
  const contentNav = content.site.nav.links.map((l) => l.href)
  const approvedNav = approved.find((c) => c.type === 'reorder-nav')?.order
  const expected = approvedNav ?? originalNav
  const ok = sameSet(originalNav, contentNav) && JSON.stringify(expected) === JSON.stringify(contentNav)
  record('Navigation links and order', ok,
    ok ? `${contentNav.join(' · ')}${approvedNav ? ` (approved reorder; original: ${originalNav.join(' · ')})` : ''}`
       : `content ${JSON.stringify(contentNav)} vs expected ${JSON.stringify(expected)}`)
}

const form = find(body, (n) => attr(n, 'id') === 'contactForm')
const formProblems = []
for (const f of content.contact.form.fields) {
  const el = find(form, (n) => attr(n, 'id') === f.id)
  const label = find(form, (n) => n.nodeName === 'label' && attr(n, 'for') === f.id)
  const type = el?.nodeName === 'textarea' ? 'textarea' : attr(el ?? {}, 'type')
  if (!el) formProblems.push(`${f.id} missing in original`)
  else {
    if (type !== f.type) formProblems.push(`${f.id} type ${type} vs ${f.type}`)
    if (attr(el, 'name') !== f.name) formProblems.push(`${f.id} name`)
    if (hasAttr(el, 'required') !== Boolean(f.required)) formProblems.push(`${f.id} required`)
    if (textOf(label ?? {}) !== f.label) formProblems.push(`${f.id} label`)
  }
}
const originalFieldCount = findAll(form, (n) => ['input', 'textarea', 'select'].includes(n.nodeName)).length
if (originalFieldCount !== content.contact.form.fields.length) formProblems.push(`field count ${originalFieldCount} vs ${content.contact.form.fields.length}`)
const submit = find(form, (n) => n.nodeName === 'button' && attr(n, 'type') === 'submit')
if (textOf(submit ?? {}) !== content.contact.form.submit) formProblems.push('submit label')
const scriptSource = findAll(body, (n) => n.nodeName === 'script' && !attr(n, 'type')).map((s) => s.childNodes?.[0]?.value ?? '').join('\n')
if (!scriptSource.includes(`mailto:${content.contact.form.recipient}`)) formProblems.push('mailto recipient')
for (const m of Object.values(content.contact.form.messages)) if (!scriptLiterals.has(m)) formProblems.push(`message "${m}" not in original script`)
record('Contact form', formProblems.length === 0, formProblems.length ? formProblems.join('; ') :
  `${originalFieldCount} fields (id, name, type, required, label), submit label, mailto recipient and both status messages match`)

// ---------- 6. Metadata + JSON-LD ----------
const builtPath = join(root, 'dist', 'index.html')
const usingDist = existsSync(builtPath)
const built = parse(readFileSync(usingDist ? builtPath : join(root, 'index.html'), 'utf8'))
const headInfo = (d) => {
  const h = find(d, (n) => n.nodeName === 'head')
  const metas = {}
  const httpEquiv = {}
  for (const m of findAll(h, (n) => n.nodeName === 'meta')) {
    const k = attr(m, 'name') ?? attr(m, 'property')
    if (k) metas[k] = attr(m, 'content')
    const he = attr(m, 'http-equiv')
    if (he) httpEquiv[he] = attr(m, 'content')
  }
  const linkBy = (rel) => { const l = find(h, (n) => n.nodeName === 'link' && attr(n, 'rel') === rel); return l ? { href: attr(l, 'href'), type: attr(l, 'type') } : null }
  const ld = findAll(h, (n) => n.nodeName === 'script' && attr(n, 'type') === 'application/ld+json').map((s) => JSON.parse(s.childNodes?.[0]?.value ?? 'null'))
  const fonts = findAll(h, (n) => n.nodeName === 'link' && (attr(n, 'href') ?? '').startsWith('https://fonts.googleapis.com/css2')).map((l) => attr(l, 'href'))
  return {
    lang: attr(find(d, (n) => n.nodeName === 'html'), 'lang'),
    title: textOf(find(h, (n) => n.nodeName === 'title') ?? {}),
    metas, httpEquiv, canonical: linkBy('canonical'), icon: linkBy('icon'), ld, fonts,
    charset: find(h, (n) => n.nodeName === 'meta' && hasAttr(n, 'charset')) ? 'present' : 'missing',
  }
}
const o = headInfo(doc)
const b = headInfo(built)
const metaProblems = []
if (o.lang !== b.lang) metaProblems.push(`lang ${o.lang} vs ${b.lang}`)
if (o.title !== b.title) metaProblems.push('title')
if (o.charset !== b.charset) metaProblems.push('charset')
for (const k of new Set([...Object.keys(o.metas), ...Object.keys(b.metas)])) if (o.metas[k] !== b.metas[k]) metaProblems.push(`meta ${k}`)
if (JSON.stringify(o.canonical) !== JSON.stringify(b.canonical)) metaProblems.push('canonical')
if (JSON.stringify(o.icon) !== JSON.stringify(b.icon)) metaProblems.push('icon')
if (o.httpEquiv['Permissions-Policy'] !== b.httpEquiv['Permissions-Policy']) metaProblems.push('Permissions-Policy')
record('Metadata (title, meta, canonical, icon, lang, Permissions-Policy)', metaProblems.length === 0,
  metaProblems.length ? metaProblems.join('; ') : `title + ${Object.keys(o.metas).length} name/property meta tags + canonical + icon + lang identical (${usingDist ? 'dist/index.html' : 'index.html template'})`)
const ldEqual = JSON.stringify(o.ld) === JSON.stringify(b.ld)
record('JSON-LD', ldEqual, ldEqual ? `${o.ld.length} block, @graph of ${o.ld[0]?.['@graph']?.length ?? 0} nodes, deep-equal` : 'JSON-LD differs')

const intentional = []
if (o.httpEquiv['Content-Security-Policy'] !== b.httpEquiv['Content-Security-Policy'])
  intentional.push('CSP: inline-script/style hashes replaced by script-src \'self\' (approved in v2 Stage 1)')
if (JSON.stringify(o.fonts) !== JSON.stringify(b.fonts)) intentional.push('Google Fonts request trimmed to 5 weights (approved in v2 Stage 1)')
record('Head differences (intentional, not failures)', true, intentional.length ? intentional.join('; ') : 'none')

// ---------- report ----------
const failed = results.filter((r) => !r.ok)
console.log(`\nContent parity vs ${BASE}:index.html\n`)
for (const r of results) {
  console.log(`${r.ok ? '✓' : '✗'} ${r.area}\n    ${r.detail}${r.info ? `\n    info: ${r.info}` : ''}`)
}
console.log(`\n${failed.length ? '✗' : '✓'} content-parity: ${results.length - failed.length}/${results.length} checks passed`)
if (existsSync(join(root, 'dist'))) {
  writeFileSync(join(root, 'dist', 'parity-report.json'), JSON.stringify({ base: BASE, results }, null, 2))
}
process.exit(failed.length ? 1 : 0)
