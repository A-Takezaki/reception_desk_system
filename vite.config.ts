/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.vitest': 'undefined',
  },
  build: {
    outDir: 'dist'
  },
    server: {
    watch: {
      usePolling: true,
      // オプション: ポーリング間隔をミリ秒で指定する場合
      // interval: 100,  
    },
    // HMR の挙動をカスタマイズしたい場合はさらにここに
    // hmr: { overlay: true },
  },
  test: {
    includeSource: ['src/**/*.{js,ts,jsx,tsx}'],
    exclude: ['tests/**/*', 'node_modules/**/*'],
    environment: 'happy-dom',
    globals: true
  },
})