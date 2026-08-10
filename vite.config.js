import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// `base` must match the path the site is served from. It now runs on the custom
// domain https://balearstudio.com/, i.e. the domain root — not the old
// /balearstudio/ project-page subpath. Set a trailing-slash path here only if the
// site ever moves back under a subfolder.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
