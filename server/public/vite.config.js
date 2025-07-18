import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // listens on all interfaces
    port: 5173,  // optional, specify your port explicitly if you want
  },
})
