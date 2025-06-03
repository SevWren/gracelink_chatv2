import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/gracelink_chat/', // IMPORTANT: Replace 'gracelink_chat' with your GitHub repository name
  build: {
    outDir: 'dist',
  }
})
