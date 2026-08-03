//components/ServiceCard.tsx

"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("common");

  return (
    <a href={`/services/${slug}`} className={styles.card}>
      <div className="flex-row gap-regular">
        <span className="title-style-h3 font-weight-bold text-color-tertiary">
          {String(number).padStart(2, "0")}
        </span>
        <h3 className="font-weight-bold">{title}</h3>
      </div>
      <div className="flex-col gap-regular max-width-medium">
        {description && <p>{description}</p>}
        {minPrice !== undefined && (
          <p>
            {t("startingFrom")} ${minPrice}
          </p>
        )}
        <div className={styles.cardArrowIcon}>
          <span className="material-symbols-outlined text-color-secondary">arrow_outward</span>
        </div>
      </div>
    </a>
  );
}