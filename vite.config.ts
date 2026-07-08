import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Critical for hosting in a subdirectory like /Tracer/
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});