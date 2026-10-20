import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
