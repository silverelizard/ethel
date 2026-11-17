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
          '/bottles': 'http://localhost:8000',
          '/categories': 'http://localhost:8000',
          '/sub_categories': 'http://localhost:8000',
          '/storage': 'http://localhost:8000',
        },
  },
})
