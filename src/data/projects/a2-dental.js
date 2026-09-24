import { asset } from '../asset'

export default {
  slug: 'a2-dental',
  order: 3,
  featured: true,
  year: '2026',
  status: 'preview', // set to 'live' and fill `url` when the site launches
  url: null,
  sector: 'web',
  services: ['design', 'development', 'multilingual'],
  stack: ['HTML', 'CSS', 'JavaScript'],
  media: {
    cover: asset('/projects/a2-dental/cover.webp'),
    video: asset('/projects/a2-dental/video.mp4'),
    poster: asset('/projects/a2-dental/poster.webp'),
    gallery: [
      asset('/projects/a2-dental/cover.webp'),
      asset('/projects/a2-dental/gallery-01.webp'),
      asset('/projects/a2-dental/gallery-02.webp'),
      asset('/projects/a2-dental/gallery-03.webp'),
    ],
  },
  copy: {
    es: {
      name:
        'A2 Dental',
      category:
        'Web para clínica dental',
      summary:
        'Web en tres idiomas para una clínica dental en Portals, Calvià.',
      description:
        'Web para clínica dental en Portals (Calvià), junto a Puerto Portals: tratamientos, equipo y contacto en español, inglés y alemán, pensada para que un paciente nuevo entienda qué ofrece la clínica y pida cita.',
      challenge:
        'Una clínica con once especialidades necesitaba explicar sus tratamientos con claridad, con un tono cercano y en tres idiomas, sin abrumar a quien llega por primera vez.',
      solution:
        'Una web limpia y cálida que destaca el tratamiento estrella, el diseño digital de sonrisa, y ordena el resto por necesidad: implantes, Invisalign, odontología conservadora, cirugía, periodoncia, bruxismo, odontopediatría y radiología digital. Tiene versión en español, inglés y alemán, modo claro y oscuro y las acreditaciones del equipo a la vista.',
      result:
        'Un paciente nuevo ve en la primera pantalla dónde está la clínica (a 200 m de Puerto Portals), cuánta experiencia tiene y cómo pedir cita.',
    },
    ca: {
      name:
        'A2 Dental',
      category:
        'Web per a clínica dental',
      summary:
        'Web en tres idiomes per a una clínica dental a Portals, Calvià.',
      description:
        'Web per a clínica dental a Portals (Calvià), al costat de Puerto Portals: tractaments, equip i contacte en castellà, anglès i alemany, pensada perquè un pacient nou entengui què ofereix la clínica i demani cita.',
      challenge:
        'Una clínica amb onze especialitats necessitava explicar els seus tractaments amb claredat, amb un to proper i en tres idiomes, sense aclaparar qui hi arriba per primera vegada.',
      solution:
        'Una web neta i càlida que destaca el tractament estrella, el disseny digital de somriure, i ordena la resta per necessitat: implants, Invisalign, odontologia conservadora, cirurgia, periodòncia, bruxisme, odontopediatria i radiologia digital. Té versió en castellà, anglès i alemany, mode clar i fosc i les acreditacions de l\'equip a la vista.',
      result:
        'Un pacient nou veu a la primera pantalla on és la clínica (a 200 m de Puerto Portals), quanta experiència té i com demanar cita.',
    },
    en: {
      name:
        'A2 Dental',
      category:
        'Dental clinic website',
      summary:
        'A three-language website for a dental clinic in Portals, Calvià.',
      description:
        'Website for a dental clinic in Portals (Calvià), next to Puerto Portals: treatments, team and contact in Spanish, English and German, designed so a new patient understands what the clinic offers and can book an appointment.',
      challenge:
        'A clinic with eleven specialities needed to explain its treatments clearly, in a friendly tone and in three languages, without overwhelming a first-time visitor.',
      solution:
        'A clean, warm site that puts the star treatment, digital smile design, up front and sorts the rest by need: implants, Invisalign, conservative dentistry, surgery, periodontics, bruxism, paediatric dentistry and digital radiology. It comes in Spanish, English and German, with light and dark modes and the team\'s accreditations in plain view.',
      result:
        'A new patient sees on the first screen where the clinic is (200 m from Puerto Portals), how much experience it has and how to book.',
    },
  },
}
