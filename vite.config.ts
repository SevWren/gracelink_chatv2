import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/gracelink_chatv2/', // Corresponds to GitHub repository name for Pages deployment
  build: {
    outDir: 'dist',
  }
})