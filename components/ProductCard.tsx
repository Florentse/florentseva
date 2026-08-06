//components/ProductCard.tsx

"use client";

import { useTranslations } from "next-intl";
import { urlFor } from "@/sanity/lib/image";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  title: string;
  description?: string;
  coverImage?: any;
  category?: string;
  slug: string;
  url?: string;
};

export default function ProductCard({
  title,
  description,
  coverImage,
  category,
  slug,
  url,
}: ProductCardProps) {
  const t = useTranslations("common");

  // Products hosted on this site link to their own page; `url` is only for
  // products that live elsewhere (opens in a new tab instead).
  const isExternal = Boolean(url);
  const href = url || `/products/${slug}`;

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={styles.productCard}
    >
      <div className={styles.cardImageWrap}>
        {coverImage && (
          <img
            src={urlFor(coverImage).url()}
            alt={title}
            className={styles.cardImage}
          />
        )}
      </div>
      <div className={styles.cardInfoWrap}>
        <span className="text-size-small text-color-secondary text-transform-uppercase">
          {category}
        </span>
        <h3 className="font-weight-bold">{title}</h3>
        <p>{description}</p>
        <div className="text-size-base link-icon">{t("learnMore")}</div>
      </div>
    </a>
  );
}
