import { getTranslations } from "next-intl/server";
import styles from "./ServiceCard.module.css";

type ServiceCardProps = {
  number: number;
  title: string;
  description?: string;
  minPrice?: number;
  slug: string;
};

export default async function ServiceCard({
  number,
  title,
  description,
  minPrice,
  slug,
}: ServiceCardProps) {
  const t = await getTranslations("common");

  return (
    <a href={`/services/${slug}`} className={`${styles.card} grid-2 gap-regular`}>
      <div className="flex-row gap-regular">
        <span className="title-style-h3 font-weight-bold text-color-tertiary">
          {String(number).padStart(2, "0")}
        </span>
        <h3 className="font-weight-bold">{title}</h3>
      </div>
      <div className="flex-col gap-regular">
        {description && <p>{description}</p>}
        {minPrice !== undefined && (
          <p>
            {t("startingFrom")} ${minPrice}
          </p>
        )}
        <span className="link-icon">{t("learnMore")}</span>
      </div>
    </a>
  );
}