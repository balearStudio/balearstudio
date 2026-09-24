#!/usr/bin/env node
// Captures screenshots (+ a short scroll video) of every portfolio project and writes optimised
// media to public/projects/<slug>/ (cover, gallery-NN, video, poster — see src/data/projects).
//
//   node scripts/capture-projects.mjs                    all projects
//   node scripts/capture-projects.mjs darrod-tennis      only these slugs
//   node scripts/capture-projects.mjs --no-video         skip video capture
//   node scripts/capture-projects.mjs --optimise-only    re-encode the raw files in .capture/
//
// Raw captures are kept in .capture/<slug>/ (gitignored) so the optimise step can be re-run alone.
// Predicasa is behind a login: PREDICASA_EMAIL / PREDICASA_PASSWORD are read from .env.local
// (gitignored), used only to sign in, and never logged or written anywhere.
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { chromium } from 'playwright'
import { encodeVideo, kb, optimiseImage, writePoster } from './optimise-media.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const RAW = path.join(ROOT, '.capture')
const OUT = path.join(ROOT, 'public', 'projects')

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 390, height: 844 }
const VIDEO_SIZE = { width: 1280, height: 800 }

// `stops` are the fractions of the scrollable height where the gallery screenshots are taken.
// `existing` projects are not captured from a URL: their PNGs are only re-encoded (cover first).
const PROJECTS = {
  predicasa: { login: true, video: 'predicasa' },
  'darrod-tennis': { url: 'https://darrodtennis.dev.balearstudio.com/es/', stops: [0.3, 0.6], video: 'scroll' },
  'a2-dental': { url: 'https://dental-a2.dev.balearstudio.com/', stops: [0.3, 0.6], video: 'scroll' },
  rmelendi: { url: 'https://balearstudio.github.io/rmelendi/', stops: [0.3, 0.6], video: 'scroll' },
  'panes-patagonia': { url: 'http://panespatagonia.dev.balearstudio.com/', stops: [0.35, 0.7], video: 'scroll' },
  melani: { url: 'https://centromelanicosta.com', stops: [0.3, 0.6], video: 'scroll' },
  finai: { existing: ['finaivicenc_main.png', 'finaivicenc2.png'], video: null },
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ---- page helpers -------------------------------------------------------------------------

async function dismissBanners(page) {
  const label = /^(aceptar( todo| todas)?( las cookies)?|acepto|accept( all)?|entendido|de acuerdo|got it|ok)$/i
  for (const button of await page.getByRole('button').all()) {
    const text = ((await button.innerText().catch(() => '')) || '').trim()
    if (label.test(text) && (await button.isVisible().catch(() => false))) {
      await button.click({ timeout: 2000 }).catch(() => {})
      await sleep(400)
    }
  }
}

async function open(page, url) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
  await sleep(1500)
  await dismissBanners(page)
}

const scrollHeight = (page) => page.evaluate(() => document.documentElement.scrollHeight)

// Scrolls the whole page once so scroll-triggered reveals and lazy images have fired.
async function warmUp(page) {
  const height = await scrollHeight(page)
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((to) => window.scrollTo(0, to), y)
    await sleep(80)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(500)
}

// Eased scroll to `y` over `ms` (runs in the page so the recording is smooth).
function smoothScroll(page, y, ms) {
  return page.evaluate(
    ([to, duration]) =>
      new Promise((resolve) => {
        const from = window.scrollY
        const start = performance.now()
        const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration)
          window.scrollTo(0, from + (to - from) * ease(t))
          t < 1 ? requestAnimationFrame(tick) : resolve()
        }
        requestAnimationFrame(tick)
      }),
    [Math.round(y), ms],
  )
}

async function scrollToHeading(page, text, offset = 90) {
  await page.evaluate(
    ([t, off]) => {
      const el = [...document.querySelectorAll('h1,h2,h3')].find((e) => e.textContent.trim().startsWith(t))
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - off)
    },
    [text, offset],
  )
  await sleep(1200)
}

// Absolute scroll position that puts the section nearest to `y` just under the sticky header.
function snapToSection(page, y) {
  return page.evaluate((target) => {
    const header = document.querySelector('header')
    const offset = header ? header.getBoundingClientRect().height : 0
    const tops = [...document.querySelectorAll('section')]
      .filter((el) => el.offsetHeight > 400)
      .map((el) => el.getBoundingClientRect().top + window.scrollY - offset)
    if (!tops.length) return target
    return tops.reduce((best, top) => (Math.abs(top - target) < Math.abs(best - target) ? top : best))
  }, y)
}

const shot = (page, file) => page.screenshot({ path: file })

// ---- Predicasa (login required) -----------------------------------------------------------

async function login(browser) {
  try {
    process.loadEnvFile(path.join(ROOT, '.env.local'))
  } catch {}
  const { PREDICASA_EMAIL: email, PREDICASA_PASSWORD: password } = process.env
  if (!email || !password) throw new Error('PREDICASA_EMAIL / PREDICASA_PASSWORD missing from .env.local')
  const context = await browser.newContext({ viewport: DESKTOP })
  const page = await context.newPage()
  await page.goto('https://predicasa.com', { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button:has-text("Entrar en la beta")')
  await page.waitForSelector('input[placeholder^="Toda Mallorca"]', { timeout: 30000 })
  // The session lives only in memory: recordings start already signed in, so no login (and no
  // typed credentials) ever appears on screen.
  const state = await context.storageState()
  await context.close()
  return state
}

async function searchPalma(page) {
  await page.fill('input[placeholder^="Toda Mallorca"]', '')
  await page.locator('input[placeholder^="Toda Mallorca"]').pressSequentially('Palma', { delay: 140 })
  await sleep(700)
  await page.click('button:has-text("Buscar")')
  await page.waitForURL('**/listings**', { timeout: 30000 })
  await page.waitForSelector('a[href^="/listings/"]')
  await sleep(2500)
}

async function capturePredicasa(browser, dir, { video }) {
  const state = await login(browser)

  const desktop = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 2, storageState: state })
  const page = await desktop.newPage()
  await page.goto('https://predicasa.com', { waitUntil: 'networkidle' })
  await sleep(2500)
  await shot(page, path.join(dir, 'cover.png'))
  await searchPalma(page)
  await shot(page, path.join(dir, 'gallery-01.png'))
  const listing = await page.locator('a[href^="/listings/"]').first().getAttribute('href')
  await page.goto(`https://predicasa.com${listing}`, { waitUntil: 'networkidle' })
  await sleep(2500)
  await scrollToHeading(page, 'Análisis de precio')
  await shot(page, path.join(dir, 'gallery-02.png'))
  await desktop.close()

  const mobile = await browser.newContext({
    viewport: MOBILE, deviceScaleFactor: 3, isMobile: true, hasTouch: true, storageState: state,
  })
  const mpage = await mobile.newPage()
  await mpage.goto(`https://predicasa.com${listing}`, { waitUntil: 'networkidle' })
  await sleep(2500)
  await scrollToHeading(mpage, 'Análisis de precio', 60)
  await shot(mpage, path.join(dir, 'gallery-03.png'))
  await mobile.close()

  if (video) {
    // Journey: home -> search "Palma" -> results -> first listing -> price analysis and verdict.
    const rec = path.join(dir, 'rec')
    rmSync(rec, { recursive: true, force: true })
    const context = await browser.newContext({
      viewport: VIDEO_SIZE, storageState: state, recordVideo: { dir: rec, size: VIDEO_SIZE },
    })
    const t0 = Date.now()
    const vpage = await context.newPage()
    await vpage.goto('https://predicasa.com', { waitUntil: 'networkidle' })
    const start = (Date.now() - t0) / 1000
    await sleep(1000)
    await searchPalma(vpage)
    await vpage.locator('a[href^="/listings/"]').first().click()
    await vpage.waitForURL('**/listings/*')
    await vpage.waitForLoadState('networkidle')
    await sleep(1400)
    await smoothScroll(vpage, 620, 1500)
    await sleep(1800)
    await smoothScroll(vpage, 1250, 1500)
    await sleep(1600)
    const end = (Date.now() - t0) / 1000
    await context.close()
    keepRecording(rec, dir, { start, duration: end - start })
  }
}

// ---- Generic marketing sites ---------------------------------------------------------------

async function captureSite(browser, dir, { url, stops, video }, { withVideo }) {
  const desktop = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 2 })
  const page = await desktop.newPage()
  await open(page, url)
  await warmUp(page)
  await shot(page, path.join(dir, 'cover.png'))
  const max = (await scrollHeight(page)) - DESKTOP.height
  for (const [i, fraction] of stops.entries()) {
    await smoothScroll(page, await snapToSection(page, max * fraction), 700)
    await sleep(1200)
    await shot(page, path.join(dir, `gallery-0${i + 1}.png`))
  }
  await desktop.close()

  const mobile = await browser.newContext({ viewport: MOBILE, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
  const mpage = await mobile.newPage()
  await open(mpage, url)
  await shot(mpage, path.join(dir, `gallery-0${stops.length + 1}.png`))
  await mobile.close()

  if (withVideo && video === 'scroll') {
    const rec = path.join(dir, 'rec')
    rmSync(rec, { recursive: true, force: true })
    const context = await browser.newContext({ viewport: VIDEO_SIZE, recordVideo: { dir: rec, size: VIDEO_SIZE } })
    const t0 = Date.now()
    const vpage = await context.newPage()
    await open(vpage, url)
    await warmUp(vpage)
    const start = (Date.now() - t0) / 1000
    await sleep(900)
    const distance = Math.min((await scrollHeight(vpage)) - VIDEO_SIZE.height, 4200)
    await smoothScroll(vpage, distance, 8500)
    await sleep(700)
    const end = (Date.now() - t0) / 1000
    await context.close()
    keepRecording(rec, dir, { start, duration: end - start })
  }
}

// Moves the single Playwright recording in `rec` to <dir>/recording.webm and records the trim.
function keepRecording(rec, dir, trim) {
  const [file] = readdirSync(rec).filter((f) => f.endsWith('.webm'))
  renameSync(path.join(rec, file), path.join(dir, 'recording.webm'))
  rmSync(rec, { recursive: true, force: true })
  writeFileSync(path.join(dir, 'recording.json'), JSON.stringify(trim))
}

// ---- optimise ------------------------------------------------------------------------------

async function optimise(slug, config) {
  const raw = path.join(RAW, slug)
  const out = path.join(OUT, slug)
  mkdirSync(out, { recursive: true })
  const report = []

  const sources = config.existing
    ? config.existing.map((name, i) => [i === 0 ? 'cover' : `gallery-0${i}`, path.join(ROOT, 'public', name)])
    : readdirSync(raw)
        .filter((f) => /^(cover|gallery-\d+)\.png$/.test(f))
        .sort()
        .map((f) => [f.replace('.png', ''), path.join(raw, f)])

  for (const [name, src] of sources) {
    if (!existsSync(src)) {
      // The re-encoded wedding PNGs are deleted after the first run; the optimised copies stay.
      console.log(`  - ${name}: source ${path.basename(src)} is gone, keeping the existing output`)
      continue
    }
    report.push(...(await optimiseImage(src, out, name)))
    if (name === 'cover') report.push(await writePoster(src, out))
  }

  const recording = path.join(raw, 'recording.webm')
  if (config.video && existsSync(recording)) {
    const trim = JSON.parse(readFileSync(path.join(raw, 'recording.json'), 'utf8'))
    report.push(...(await encodeVideo(recording, out, { start: Math.max(0, trim.start - 0.3), duration: trim.duration + 0.3 })))
  }
  for (const { file, size } of report) console.log(`  ${path.relative(ROOT, file)}  ${kb(size)}`)
  if (!config.video) rmSync(path.join(out, 'poster.webp'), { force: true })
}

// ---- main ----------------------------------------------------------------------------------

const { values, positionals } = parseArgs({
  options: { 'no-video': { type: 'boolean' }, 'optimise-only': { type: 'boolean' } },
  allowPositionals: true,
})
const slugs = positionals.length ? positionals : Object.keys(PROJECTS)
for (const slug of slugs) if (!PROJECTS[slug]) throw new Error(`Unknown project "${slug}". Known: ${Object.keys(PROJECTS).join(', ')}`)

const needsCapture = !values['optimise-only'] && slugs.some((s) => !PROJECTS[s].existing)
const browser = needsCapture ? await chromium.launch() : null
try {
  for (const slug of slugs) {
    const config = PROJECTS[slug]
    const dir = path.join(RAW, slug)
    if (!config.existing && !values['optimise-only']) {
      console.log(`\n[${slug}] capturing`)
      mkdirSync(dir, { recursive: true })
      const withVideo = !values['no-video']
      if (config.login) await capturePredicasa(browser, dir, { video: withVideo })
      else await captureSite(browser, dir, config, { withVideo })
    }
    console.log(`[${slug}] optimising`)
    await optimise(slug, config)
  }
} finally {
  await browser?.close()
}
