import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { prerenderMeta } from './scripts/prerender-meta.js';
import { devSave } from './scripts/dev-save.js';

export default defineConfig({
  plugins: [react(), tailwindcss(), prerenderMeta(), devSave()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  server: { port: 5173 },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Big libraries in their own files: they download in parallel with the app and stay
        // cached between deploys, since they change far less often than our code.
        // Only libraries needed at start-up are named here; lazy imports (the exporters) keep their own chunks.
        manualChunks(id) {
          if (id.includes('/node_modules/three/build/')) return 'three';
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          return undefined;
        },
      },
    },
  },
});
