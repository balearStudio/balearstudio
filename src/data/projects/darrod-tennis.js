import { asset } from '../asset'

export default {
  slug: 'darrod-tennis',
  order: 2,
  featured: true,
  year: '2026',
  status: 'preview', // set to 'live' and fill `url` when the site launches
  url: null,
  sector: 'web',
  services: ['design', 'development', 'booking', 'multilingual'],
  stack: ['Next.js', 'React'],
  media: {
    coverSize: [1600, 1000], // [width, height] of the full-size cover, for the <img> box
    gallerySizes: [[1600, 1000], [1600, 1000], [1600, 1000], [1170, 2532]], // [width, height] of each `gallery` entry
    cover: asset('/projects/darrod-tennis/cover.webp'),
    video: asset('/projects/darrod-tennis/video.mp4'),
    poster: asset('/projects/darrod-tennis/poster.webp'),
    gallery: [
      asset('/projects/darrod-tennis/cover.webp'),
      asset('/projects/darrod-tennis/gallery-01.webp'),
      asset('/projects/darrod-tennis/gallery-02.webp'),
      asset('/projects/darrod-tennis/gallery-03.webp'),
    ],
  },
  copy: {
    es: {
      name:
        'Darrod Tennis Academy',
      category:
        'Web para academia de tenis',
      summary:
        'Web con reservas en línea para una academia de tenis y pádel en Gran Canaria.',
      description:
        'Web para academia de tenis y pádel en Maspalomas, Gran Canaria: programas, equipo de entrenadores y reserva de clases con un único calendario, en español e inglés.',
      challenge:
        'Una academia con cuatro pistas, cinco entrenadores y varios programas necesitaba una web que explicara su metodología y facilitara reservar una clase.',
      solution:
        'Una web de estilo editorial con vídeo aéreo de las pistas reales. Tres programas bien diferenciados (Junior Tennis, Tennis Pro y Coaching), el equipo, los jugadores acompañados en competición y un formulario de reserva con calendario único: el alumno elige franja y la academia confirma con el entrenador adecuado.',
      result:
        'Programas, precio, equipo y resultados quedan a una pantalla de distancia, y reservar se reduce a elegir una franja. La web funciona en español e inglés.',
    },
    ca: {
      name:
        'Darrod Tennis Academy',
      category:
        'Web per a acadèmia de tennis',
      summary:
        'Web amb reserves en línia per a una acadèmia de tennis i pàdel a Gran Canària.',
      description:
        'Web per a acadèmia de tennis i pàdel a Maspalomas, Gran Canària: programes, equip d\'entrenadors i reserva de classes amb un únic calendari, en castellà i anglès.',
      challenge:
        'Una acadèmia amb quatre pistes, cinc entrenadors i diversos programes necessitava una web que expliqués la seva metodologia i facilités reservar una classe.',
      solution:
        'Una web d\'estil editorial amb vídeo aeri de les pistes reals. Tres programes ben diferenciats (Junior Tennis, Tennis Pro i Coaching), l\'equip, els jugadors acompanyats en competició i un formulari de reserva amb calendari únic: l\'alumne tria franja i l\'acadèmia confirma amb l\'entrenador adequat.',
      result:
        'Programes, preu, equip i resultats queden a una pantalla de distància, i reservar es redueix a triar una franja. La web funciona en castellà i anglès.',
    },
    en: {
      name:
        'Darrod Tennis Academy',
      category:
        'Tennis academy website',
      summary:
        'A website with online booking for a tennis and padel academy in Gran Canaria.',
      description:
        'Website for a tennis and padel academy in Maspalomas, Gran Canaria: programmes, coaching team and class booking through a single calendar, in Spanish and English.',
      challenge:
        'An academy with four courts, five coaches and several programmes needed a website that explained its method and made booking a class easy.',
      solution:
        'An editorial-style site built around aerial footage of the real courts. Three clearly separated programmes (Junior Tennis, Tennis Pro and Coaching), the team, the players supported in competition and a booking form with a single calendar: students pick a slot and the academy confirms with the right coach.',
      result:
        'Programmes, pricing, team and results sit one screen apart, and booking comes down to picking a slot. The site works in Spanish and English.',
    },
  },
}
