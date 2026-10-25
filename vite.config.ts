import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Dev-server-only fix: Vite's dev server doesn't resolve a request for a nested public/
 * directory (e.g. /faq/) to that directory's index.html the way a real static host does.
 * `public/faq/index.html` only loads at the exact /faq/index.html URL in `npm run dev`,
 * while /faq/ silently falls through to the SPA fallback and serves the app's own index.html
 * instead. Production (and `vite preview`, which was used to confirm this) serves /faq/
 * correctly already, so this exists purely to make local dev match that.
 */
function publicDirIndexFallback(): Plugin {
  return {
    name: 'public-dir-index-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0]
        if (!pathname || !pathname.endsWith('/') || pathname === '/') {
          next()
          return
        }
        const publicDir = server.config.publicDir
        const filePath = path.join(publicDir, pathname, 'index.html')
        // path.join uses the OS-native separator (backslashes on Windows), but publicDir is a
        // forward-slash path, comparing them directly with startsWith silently never matches.
        // path.relative handles the separator difference correctly.
        const relative = path.relative(publicDir, filePath)
        const isInsidePublicDir = relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative)
        if (isInsidePublicDir && fs.existsSync(filePath)) {
          res.setHeader('Content-Type', 'text/html')
          fs.createReadStream(filePath).pipe(res)
          return
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), publicDirIndexFallback()],
  server: {
    port: 5174,
    // Proxies to the smart-goal-crafter-api dev server (run separately, default port 3000) so
    // the browser sees a same-origin request — no CORS headers needed on that server, and the
    // frontend code never hardcodes its host. Production will need its own equivalent (a
    // rewrite rule on whatever host serves the built app), once the API has a deployed home.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
