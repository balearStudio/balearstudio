import { asset } from '../asset'

export default {
  slug: 'predicasa',
  order: 1,
  featured: true,
  year: '2025',
  status: 'live',
  url: 'https://predicasa.com',
  sector: 'ai-app',
  services: ['design', 'webapp', 'ai'],
  stack: ['React', 'Vite', 'Supabase', 'Leaflet'],
  media: {
    cover: asset('/projects/predicasa/cover.webp'),
    video: asset('/projects/predicasa/video.mp4'),
    poster: asset('/projects/predicasa/poster.webp'),
    gallery: [
      asset('/projects/predicasa/cover.webp'),
      asset('/projects/predicasa/gallery-01.webp'),
      asset('/projects/predicasa/gallery-02.webp'),
      asset('/projects/predicasa/gallery-03.webp'),
    ],
  },
  copy: {
    es: {
      name:
        'Predicasa',
      category:
        'Aplicación con IA',
      summary:
        'Valoración con IA de cada anuncio inmobiliario de Mallorca.',
      description:
        'Aplicación web con IA para el sector inmobiliario en Mallorca. Estima el precio de cada anuncio, lo compara con lo que se firma ante notario en la zona y calcula su rentabilidad de alquiler, para saber si un precio es justo antes de llamar.',
      challenge:
        'Los portales inmobiliarios solo muestran el precio que pide el vendedor. Comprar en Mallorca exige saber si ese precio es razonable, y hacerlo a mano, anuncio por anuncio, no escala.',
      solution:
        'Una aplicación web que reúne los anuncios de Idealista y Fotocasa en un solo listado y agrupa los duplicados. Un modelo de precios entrenado con el histórico del mercado estima cada inmueble, y se contrasta con los precios de cierre ante notario y los alquileres declarados de la zona. Se puede buscar describiendo lo que se quiere en una frase, como se lo diríamos a un agente.',
      result:
        'Cada anuncio muestra su desviación frente al modelo, en euros y en porcentaje, y su rentabilidad bruta estimada. Todo el mercado, más de 17.000 anuncios activos, se vuelve a valorar cada noche sin intervención manual.',
    },
    ca: {
      name:
        'Predicasa',
      category:
        'Aplicació amb IA',
      summary:
        'Valoració amb IA de cada anunci immobiliari de Mallorca.',
      description:
        'Aplicació web amb IA per al sector immobiliari a Mallorca. Estima el preu de cada anunci, el compara amb el que se signa davant de notari a la zona i calcula la seva rendibilitat de lloguer, per saber si un preu és just abans de trucar.',
      challenge:
        'Els portals immobiliaris només mostren el preu que demana el venedor. Comprar a Mallorca exigeix saber si aquest preu és raonable, i fer-ho a mà, anunci per anunci, no escala.',
      solution:
        'Una aplicació web que reuneix els anuncis d\'Idealista i Fotocasa en un sol llistat i n\'agrupa els duplicats. Un model de preus entrenat amb l\'històric del mercat estima cada immoble, i es contrasta amb els preus de tancament davant de notari i els lloguers declarats de la zona. Es pot cercar descrivint el que es vol en una frase, com ho diríem a un agent.',
      result:
        'Cada anunci mostra la seva desviació respecte al model, en euros i en percentatge, i la seva rendibilitat bruta estimada. Tot el mercat, més de 17.000 anuncis actius, es torna a valorar cada nit sense intervenció manual.',
    },
    en: {
      name:
        'Predicasa',
      category:
        'AI application',
      summary:
        'AI valuation of every property listing in Mallorca.',
      description:
        'An AI web app for the Mallorca property market. It estimates the price of every listing, compares it with what actually gets signed at the notary in that area and works out its rental yield, so you know if a price is fair before you call.',
      challenge:
        'Property portals only show the price the seller is asking. Buying in Mallorca means knowing whether that price is reasonable, and checking listing by listing by hand does not scale.',
      solution:
        'A web app that brings the Idealista and Fotocasa listings into one list and groups the duplicates. A price model trained on the market\'s history estimates each property, and the result is set against notary closing prices and declared rents in the area. You can search by describing what you want in a sentence, the way you would tell an agent.',
      result:
        'Every listing shows its gap to the model in euros and as a percentage, plus its estimated gross rental yield. The whole market, over 17,000 active listings, is revalued every night with no manual work.',
    },
  },
}
