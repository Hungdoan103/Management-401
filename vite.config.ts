import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// The production build is inlined into ONE html file (dist/index.html) so the deck can be
// opened by double-click and presented fully offline - no server, no internet needed.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  server: { port: 5173, open: false },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 6000,
  },
})
