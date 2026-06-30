import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Static SPA build — deployable to ArvanCloud (object storage/CDN or static host).
// Relative base so it works from any sub-path on the CDN.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'نکسا متریکا — Nexa Metrica',
        short_name: 'نکسا متریکا',
        description: 'پلتفرم آنالیز فوتبال هوش‌مصنوعی‌محور',
        lang: 'fa',
        dir: 'rtl',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#0d0f12',
        theme_color: '#0d0f12',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,svg,png,ico}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/],
        // Apply a new build on the very next reload instead of waiting for every
        // tab to close — stops users from being stuck on a stale cached version.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // Never serve a cached API response; always hit the network.
        runtimeCaching: [
          {
            urlPattern: /\/api\//,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
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
