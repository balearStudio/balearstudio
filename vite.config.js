import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// `base` must match the GitHub Pages project path (repo served at
// https://crisconh.github.io/balearstudio/). Override with a trailing-slash
// path if the repo is renamed or moved to a custom domain / user site.
export default defineConfig({
  plugins: [react()],
  base: '/balearstudio/',
})
