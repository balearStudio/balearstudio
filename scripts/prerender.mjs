// Post-build static-site generation. Runs after both Vite builds
// (`vite build` and `vite build --ssr src/entry-server.jsx --outDir dist-ssr`).
// Renders every page (home + one case study per public project, in each
// language) with react-dom/server and writes real HTML into dist/: Spanish at
// the root, Catalan and English under /ca/ and /en/. Also writes sitemap.xml
// and robots.txt. No headless browser and no extra SSG dependency.
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const distDir = resolve(root, 'dist')
const ssrDir = resolve(root, 'dist-ssr')

const { render, PAGES, buildSitemap, robotsTxt } = await import(
  pathToFileURL(resolve(ssrDir, 'entry-server.js')).href
)

const template = await readFile(resolve(distDir, 'index.html'), 'utf-8')
for (const marker of ['<!--app-head-->', '<!--app-html-->', '<html lang="es">']) {
  if (!template.includes(marker)) throw new Error(`index.html is missing ${marker}`)
}

for (const { lang: code, slug, path } of PAGES) {
  const { appHtml, headHtml } = render(code, slug)

  // A function replacer, so "$" sequences in the markup aren't treated as patterns.
  const html = template
    .replace('<html lang="es">', `<html lang="${code}">`)
    .replace(/<title>.*?<\/title>\s*/s, '')
    .replace('<!--app-head-->', () => headHtml)
    .replace('<!--app-html-->', () => appHtml)

  const outDir = resolve(distDir, path.replace(/^\//, ''))
  await mkdir(outDir, { recursive: true })
  await writeFile(resolve(outDir, 'index.html'), html, 'utf-8')
}

await writeFile(resolve(distDir, 'sitemap.xml'), buildSitemap(), 'utf-8')
await writeFile(resolve(distDir, 'robots.txt'), robotsTxt, 'utf-8')
await rm(ssrDir, { recursive: true, force: true })

console.log(`Prerendered ${PAGES.length} pages: ${PAGES.map((p) => p.path).join(' ')}`)
