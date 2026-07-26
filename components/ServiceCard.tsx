import styles from "./ServiceCard.module.css";

type ServiceCardProps = {
  number: number;
  title: string;
  description?: string;
  minPrice?: number;
  slug: string;
};

export default function ServiceCard({
  number,
  title,
  description,
  minPrice,
  slug,
}: ServiceCardProps) {
  return (
    <a
      href={`/services/${slug}`}
      className={`${styles.card} grid-2 gap-regular`}
    >
      <div className="flex-row gap-regular">
        <span className="heading-style-h3 font-weight-bold text-color-tertiary">
          {String(number).padStart(2, "0")}
        </span>
        <h3 className="font-weight-bold">{title}</h3>
      </div>
      <div className="flex-col gap-regular">
        {description && <p>{description}</p>}
        {minPrice !== undefined && <p>Starting from ${minPrice}</p>}
        <span className="link-icon">Learn more</span>
      </div>
    </a>
  );
}
