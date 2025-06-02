/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.vitest': 'undefined',
  },
  test: {
    includeSource: ['src/**/*.{js,ts,jsx,tsx}'],
    exclude: ['tests/**/*', 'node_modules/**/*'],
    environment: 'happy-dom',
    globals: true
  },
})