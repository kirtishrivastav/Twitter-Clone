import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',  // Ensure this is the correct path to your index.html
  build: {
    outDir: 'dist',
  },
});
