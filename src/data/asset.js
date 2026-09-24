/* Files live in public/ and are served from Vite's base path (currently `/`,
   the root of balearstudio.com). Resolve every public asset through this helper
   so the base prefix is always applied and the paths keep working if the site is
   ever served from a subfolder again. */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

/* Responsive sources for an optimised image. `src` is the full-size .webp; the
   optimise step (scripts/optimise-media.mjs) also writes `-800` variants and
   AVIF twins next to it. `fullWidth` is the width of the full-size file. */
export function responsiveImage(src, fullWidth) {
  const base = src.replace(/\.webp$/, '')
  return {
    src,
    avifSrcSet: `${base}-800.avif 800w, ${base}.avif ${fullWidth}w`,
    webpSrcSet: `${base}-800.webp 800w, ${base}.webp ${fullWidth}w`,
  }
}
