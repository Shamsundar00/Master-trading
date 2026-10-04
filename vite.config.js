import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Public URL of the page — used for canonical / Open Graph tags in index.html.
// Override at build time: VITE_SITE_URL=https://marketacademy.in/<folder>/ npm run build
process.env.VITE_SITE_URL ??= 'https://marketacademy.in/expert-trading-workshop/'

// base './' emits relative asset URLs, so the same build works from any
// marketacademy.in sub-folder or from a subdomain root.
// Set VITE_BASE=/<folder>/ if absolute asset paths are preferred.
export default defineConfig({
  base: process.env.VITE_BASE || './',
  plugins: [react(), tailwindcss()],
})
