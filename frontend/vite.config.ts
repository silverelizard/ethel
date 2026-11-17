import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: process.env.VITE_USE_MOCKS === 'true'
      ? undefined
      : {
          '/api': 'http://localhost:8000',
        },
  },
})
