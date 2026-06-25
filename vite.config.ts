import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static SPA build — deployable to ArvanCloud (object storage/CDN or static host).
// Relative base so it works from any sub-path on the CDN.
export default defineConfig({
  plugins: [react()],
  base: './',
  // The ported i18n table (engine.ts) intentionally repeats a couple of keys
  // (last value wins, exactly as the approved prototype behaved). Silence the
  // cosmetic esbuild warning without changing that behavior.
  esbuild: {
    logOverride: { 'duplicate-object-key': 'silent' },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
