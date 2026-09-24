import { asset } from '../asset'

export default {
  slug: 'predicasa',
  order: 1,
  featured: true,
  year: '2025',
  status: 'live',
  url: 'https://predicasa.com',
  sector: 'ai-app',
  services: [], // TODO (P3)
  stack: [], // TODO (P3)
  media: {
    cover: asset('/predicasa_main.png'),
    video: asset('/predicasa-video.mp4'),
    poster: asset('/predicasa_main.png'),
    gallery: [
      asset('/predicasa_main.png'),
      asset('/predicasa2.png'),
      asset('/predicasa3.png'),
      asset('/predicasa4.png'),
      asset('/predicasa5.png'),
    ],
  },
  copy: {
    es: {
      name: 'Predicasa',
      category: 'Aplicación con IA',
      summary: 'Predicción de precios de vivienda en Mallorca con IA.',
      description:
        'Plataforma que predice precios de vivienda en Mallorca sobre una gran base de datos, detectando oportunidades y valorando si un precio es competitivo frente al mercado.',
    },
    ca: {
      name: 'Predicasa',
      category: 'Aplicació amb IA',
      summary: "Predicció de preus d'habitatge a Mallorca amb IA.",
      description:
        "Plataforma que prediu preus d'habitatge a Mallorca sobre una gran base de dades, detectant oportunitats i valorant si un preu és competitiu respecte al mercat.",
    },
    en: {
      name: 'Predicasa',
      category: 'AI application',
      summary: 'AI-powered housing price prediction for Mallorca.',
      description:
        'A platform that predicts housing prices in Mallorca over a large database, surfacing opportunities and telling you whether a price is competitive against the market.',
    },
  },
}
