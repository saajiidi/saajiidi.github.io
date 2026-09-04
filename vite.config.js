import { defineConfig } from 'vite';
import { cpSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export default defineConfig({
  root: '.',
  // NOTE: no public/ dir in this repo — static assets live at ./img, ./sounds, ./manifest.json.
  // publicDir:false means Vite copies nothing, so this plugin ships them to dist/ on build.
  publicDir: false,
  plugins: [
    {
      name: 'copy-static-to-dist',
      closeBundle() {
        const out = join(process.cwd(), 'dist');
        mkdirSync(out, { recursive: true });
        for (const entry of ['img', 'sounds', 'manifest.json']) {
          try { cpSync(entry, join(out, entry), { recursive: true }); }
          catch (err) { console.warn(`[copy-static] skip ${entry}: ${err.message}`); }
        }
      }
    },
    {
      name: 'disable-stdin-shortcuts',
      configureServer(server) {
        process.stdin.pause();
        process.stdin.on('error', (err) => {
          console.warn('[VITE] Suppressed stdin error:', err.message);
        });
        process.on('uncaughtException', (err) => {
          if (err && (err.code === 'UNKNOWN' || err.syscall === 'read')) {
            console.warn('[VITE] Suppressed filesystem read stream error:', err.message);
          } else {
            console.error('[VITE] Uncaught Exception:', err);
          }
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        themeTactical: 'theme-tactical.html',
        themeSketchbook: 'theme-sketchbook.html',
        resume: 'resume.html'
      },
    },
  },
  css: {
    devSourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      usePolling: true,
      interval: 500,
      ignored: [
        '**/.git/**',
        '**/node_modules/**',
        '**/.idea/**',
        '**/.vscode/**',
        '**/*.tmp',
        '**/~*'
      ]
    }
  },
});
