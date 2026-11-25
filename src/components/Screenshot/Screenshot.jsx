import { SHOT_SIZE } from '../../data/tooldeck'
import './Screenshot.css'

/**
 * A product screenshot inside a minimal, monochrome browser frame.
 * Pass one image (`src` + `alt`) or several (`images`, each {src, alt})
 * with `active` to cross-fade between them; all are stacked in the same
 * box so switching never shifts the layout.
 */
export default function Screenshot({ src, alt, images, active = 0, caption, id }) {
  const list = images || [{ src, alt }]

  return (
    <figure className="shot" id={id}>
      <div className="shot__frame">
        <div className="shot__bar" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="shot__screen">
          {list.map((img, i) => (
            <img
              key={img.src}
              src={img.src}
              alt={i === active ? img.alt : ''}
              aria-hidden={i === active ? undefined : true}
              width={SHOT_SIZE.width}
              height={SHOT_SIZE.height}
              loading="lazy"
              decoding="async"
              className={`shot__img ${i === active ? 'is-active' : ''}`}
            />
          ))}
        </div>
      </div>
      {caption && <figcaption className="shot__caption">{caption}</figcaption>}
    </figure>
  )
}
