#!/usr/bin/env node
/**
 * Post-build checks for the React rebuild. Fails (exit 1) if the build would regress
 * the existing site's SEO, CSP or public files.
 *
 *  1. dist/index.html carries the exact SEO contract of the existing site
 *     (title, canonical, every name/property meta tag, CSP, JSON-LD) — see seo-contract.json,
 *     extracted verbatim from index.html on redesign/v2-credibility @ cebc227.
 *  2. No inline executable scripts or inline <style> (CSP is script-src/style-src 'self').
 *  3. Every file in public/ is present in dist/ byte-for-byte.
 *  4. No data: URIs in built CSS/JS asset URLs (CSP img-src/font-src 'self').
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const publicDir = join(root, 'public')
const contract = JSON.parse(readFileSync(join(root, 'scripts/seo-contract.json'), 'utf8'))

const failures = []
let passed = 0
const check = (ok, label) => (ok ? passed++ : failures.push(label))

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')

if (!existsSync(join(dist, 'index.html'))) {
  console.error('✗ dist/index.html not found — run `npm run build` first')
  process.exit(1)
}
const html = readFileSync(join(dist, 'index.html'), 'utf8')
const head = html.slice(0, html.indexOf('</head>'))

// 1. SEO contract
const title = head.match(/<title>([\s\S]*?)<\/title>/)?.[1]
check(title === contract.title, `title: expected "${contract.title}", got "${title}"`)

const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
check(canonical === contract.canonical, `canonical: expected ${contract.canonical}, got ${canonical}`)

const csp = head.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1]
check(csp === contract.csp, `CSP changed or missing: ${csp}`)

const metas = Object.fromEntries(
  [...head.matchAll(/<meta (?:name|property)="([^"]+)" content="([^"]*)"/g)].map((m) => [m[1], m[2]]),
)
for (const [key, value] of Object.entries(contract.meta)) {
  check(metas[key] !== undefined && decode(metas[key]) === decode(value), `meta ${key} missing or changed`)
}

const ldBlocks = [...head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
check(ldBlocks.length === 1, `expected exactly 1 JSON-LD block, found ${ldBlocks.length}`)
try {
  const ld = JSON.parse(ldBlocks[0]?.[1] ?? 'null')
  check(JSON.stringify(ld) === JSON.stringify(contract.jsonld), 'JSON-LD content changed')
} catch {
  failures.push('JSON-LD is not valid JSON')
}

// 2. CSP-safe markup: every executable <script> has a same-origin src; no inline <style>
for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
  const attrs = m[1] ?? ''
  if (/type="application\/ld\+json"/.test(attrs)) continue
  const src = attrs.match(/src="([^"]+)"/)?.[1]
  check(Boolean(src) && src.startsWith('/') && !src.startsWith('//'), `inline or cross-origin script: <script${attrs}>`)
  check((m[2] ?? '').trim() === '', `script with inline body: <script${attrs}>`)
}
check(!/<style[\s>]/.test(html), 'inline <style> element found')

// 3. public/ copied byte-for-byte
const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex')
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
for (const file of walk(publicDir)) {
  const rel = relative(publicDir, file)
  const out = join(dist, rel)
  check(existsSync(out) && sha(out) === sha(file), `public/${rel} missing from dist or modified`)
}

// 4. No data: URIs in built assets
for (const file of walk(join(dist, 'assets')).filter((f) => /\.(css|js)$/.test(f))) {
  check(!/url\(\s*["']?data:/.test(readFileSync(file, 'utf8')), `data: URI in ${relative(dist, file)}`)
}

if (failures.length) {
  console.error(`✗ verify-build: ${failures.length} failed, ${passed} passed`)
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log(`✓ verify-build: all ${passed} checks passed`)
