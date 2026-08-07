import styles from './WorkCard.module.css'
import { urlFor } from '@/sanity/lib/image'

type WorkCardProps = {
  title: string
  slug: string
  cardImage?: any
  service?: string
}

export default function WorkCard({ title, slug, cardImage, service }: WorkCardProps) {
  return (
    <a href={`/works/${slug}`} className={`${styles.card} flex-col gap-regular`}>
      <div className={styles.cardImageWrap}>
        {cardImage && (
          <img
            src={urlFor(cardImage).url()}
            alt={title}
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.cardTextWrap}>
      {service && (
        <span className="text-size-small text-color-secondary text-transform-uppercase">
          {service}
        </span>
      )}
      <h3 className="text-size-large">{title}</h3>
      </div>
    </a>
  )
}