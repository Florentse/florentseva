"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { urlFor } from "@/sanity/lib/image";
import styles from "./ArticleCard.module.css";

type ArticleCardProps = {
  title: React.ReactNode;
  slug: string;
  coverImage?: any;
  categoryTitle?: string;
  publishedAt?: string;
  locale: string;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function ArticleCard({
  title,
  slug,
  coverImage,
  categoryTitle,
  publishedAt,
  locale,
}: ArticleCardProps) {
  const t = useTranslations("common");

  return (
    <Link href={`/${locale}/blog/${slug}`} className={styles.articleCard}>
      <div className={styles.imageWrap}>
        {coverImage && (
          <img
            src={urlFor(coverImage).url()}
            alt={typeof title === "string" ? title : slug}
            className={styles.image}
          />
        )}
      </div>

      <div className={styles.textWrap}>
        <div className={styles.articleCardTop}>
          {categoryTitle && (
            <span className="text-size-small text-color-secondary text-transform-uppercase">
              {categoryTitle}
            </span>
          )}
          {publishedAt && (
            <span className="text-size-small text-color-secondary">
              {formatDate(publishedAt)}
            </span>
          )}
        </div>

        <h3 className="text-size-base">{title}</h3>
        <div className={styles.cardArrowIcon}>
          <span className="material-symbols-outlined text-color-secondary">arrow_outward</span>
        </div>
      </div>
    </Link>
  );
}
