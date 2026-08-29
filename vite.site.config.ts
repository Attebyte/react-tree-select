import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Copy public/_redirects into hosting/ for Cloudflare Pages SPA fallback
  publicDir: 'public',
  build: {
    copyPublicDir: true,
    outDir: 'hosting'
  }
})
