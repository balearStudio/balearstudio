// Media optimisation helpers used by capture-projects.mjs.
//   images: sharp -> AVIF + WebP at 1600w and 800w, each under IMAGE_MAX_BYTES
//   video:  ffmpeg-static -> H.264 MP4 + VP9 WebM, no audio, 1280w, each under VIDEO_MAX_BYTES
import { execFile } from 'node:child_process'
import { mkdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'
import ffmpegPath from 'ffmpeg-static'
import sharp from 'sharp'

const run = promisify(execFile)

export const IMAGE_MAX_BYTES = 250 * 1000
export const VIDEO_MAX_BYTES = 1.5 * 1000 * 1000
export const IMAGE_WIDTHS = [1600, 800]

const ENCODERS = {
  avif: (img, quality) => img.avif({ quality, effort: 5 }),
  webp: (img, quality) => img.webp({ quality, effort: 5 }),
}
const START_QUALITY = { avif: 60, webp: 78 }

// Writes <outDir>/<name>.{avif,webp} (1600w) and <name>-800.{avif,webp}.
// Lowers the quality until each file fits IMAGE_MAX_BYTES. Never enlarges the source.
export async function optimiseImage(src, outDir, name) {
  mkdirSync(outDir, { recursive: true })
  const written = []
  for (const width of IMAGE_WIDTHS) {
    const suffix = width === IMAGE_WIDTHS[0] ? '' : `-${width}`
    for (const format of Object.keys(ENCODERS)) {
      const file = path.join(outDir, `${name}${suffix}.${format}`)
      let quality = START_QUALITY[format]
      for (;;) {
        const base = sharp(src).resize({ width, withoutEnlargement: true })
        const info = await ENCODERS[format](base, quality).toFile(file)
        if (info.size <= IMAGE_MAX_BYTES || quality <= 30) {
          if (info.size > IMAGE_MAX_BYTES) console.warn(`  ! ${file} is ${kb(info.size)} (over budget at q${quality})`)
          written.push({ file, size: info.size })
          break
        }
        quality -= 5
      }
    }
  }
  return written
}

// A 1280w WebP of the cover, shown while the video loads.
export async function writePoster(src, outDir) {
  const file = path.join(outDir, 'poster.webp')
  let quality = 78
  for (;;) {
    const info = await sharp(src).resize({ width: 1280, withoutEnlargement: true }).webp({ quality }).toFile(file)
    if (info.size <= IMAGE_MAX_BYTES || quality <= 30) return { file, size: info.size }
    quality -= 5
  }
}

const VIDEO_CODECS = {
  mp4: (crf) => ['-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart'],
  webm: (crf) => ['-c:v', 'libvpx-vp9', '-crf', String(crf), '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2'],
}
const START_CRF = { mp4: 26, webm: 34 }

// Trims `src` (a Playwright .webm recording) from `start` for `duration` seconds and writes
// <outDir>/video.mp4 and video.webm, raising the CRF until each fits VIDEO_MAX_BYTES.
export async function encodeVideo(src, outDir, { start = 0, duration }) {
  mkdirSync(outDir, { recursive: true })
  const written = []
  for (const format of Object.keys(VIDEO_CODECS)) {
    const file = path.join(outDir, `video.${format}`)
    let crf = START_CRF[format]
    for (;;) {
      const args = [
        '-y', '-loglevel', 'error',
        '-ss', start.toFixed(2), '-i', src, '-t', duration.toFixed(2),
        '-an', '-vf', 'scale=1280:-2:flags=lanczos,fps=30',
        ...VIDEO_CODECS[format](crf),
        file,
      ]
      await run(ffmpegPath, args)
      const size = statSync(file).size
      if (size <= VIDEO_MAX_BYTES || crf >= 50) {
        if (size > VIDEO_MAX_BYTES) console.warn(`  ! ${file} is ${kb(size)} (over budget at crf ${crf})`)
        written.push({ file, size })
        break
      }
      crf += 2
    }
  }
  return written
}

export const kb = (bytes) => `${Math.round(bytes / 1000)} KB`
