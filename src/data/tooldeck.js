import { asset } from './asset'

/* ToolDeck screenshots, taken from the local demo tenant ("Empresa Demo S.L.",
   fictitious users and sample data). 2000×1250 webp, 16:10. The interface is
   Spanish-only for now, so every language shows the same images; the alt text
   is translated in translations.js. */
export const SHOT_SIZE = { width: 2000, height: 1250 }

export const stepShots = [
  asset('/tooldeck/paso-1-editor.webp'),
  asset('/tooldeck/paso-2-formulario.webp'),
  asset('/tooldeck/paso-3-resultado.webp'),
]

export const usageShot = asset('/tooldeck/consumo.webp')

/* Demo request: a plain mailto (no backend). Subject and body come from the
   active language so the email arrives in the visitor's language. */
export const EMAIL = 'info@balearstudio.com'

export const demoMailto = (t) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(t('contact.mailSubject'))}` +
  `&body=${encodeURIComponent(t('contact.mailBody').replace(/\n/g, '\r\n'))}`
