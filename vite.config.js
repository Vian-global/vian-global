import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure SPA fallback for react-router client-side routing
  preview: {
    port: 4173,
  },
})
