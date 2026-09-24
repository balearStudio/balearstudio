/* Files live in public/ and are served from Vite's base path (currently `/`,
   the root of balearstudio.com). Resolve every public asset through this helper
   so the base prefix is always applied and the paths keep working if the site is
   ever served from a subfolder again. */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
