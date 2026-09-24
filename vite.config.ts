import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * The production Content-Security-Policy lives in index.html and ships unchanged in every build.
 * The dev server needs inline scripts (React Refresh / HMR preamble), so the CSP meta tag is
 * removed from the page served by `vite dev` only. `apply: 'serve'` means this never runs in `vite build`.
 */
function stripCspInDevServer(): Plugin {
  return {
    name: 'strip-csp-in-dev-server',
    apply: 'serve',
    transformIndexHtml(html) {
      return html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\s*/, '')
    },
  }
}

export default defineConfig({
  // User site (peerzadafaizan.github.io) is served from the domain root.
  base: '/',
  plugins: [react(), tailwindcss(), stripCspInDevServer()],
  build: {
    target: 'es2022',
    // CSP allows img-src/font-src 'self' only — never inline assets as data: URIs.
    assetsInlineLimit: 0,
    sourcemap: false,
  },
})
