"use client";

import { useState } from "react";
import ScrollToButton from "./ScrollToButton";
import styles from "./SitemapBuilderBlock.module.css";

export type SitemapPageItem = {
  name?: Record<string, string>;
  description?: Record<string, string>;
  alwaysIncluded?: boolean;
};

export type SitemapTier = {
  title?: Record<string, string>;
  price?: number;
  maxPages?: number;
  timeline?: Record<string, string>;
};

export type SitemapBuilderBlockData = {
  _key?: string;
  heading?: Record<string, string>;
  intro?: Record<string, string>;
  pages?: SitemapPageItem[];
  tiers?: SitemapTier[];
};

type SitemapBuilderBlockProps = {
  block: SitemapBuilderBlockData;
  locale: string;
  id?: string;
  className?: string;
};

// The tiers are authored smallest-to-largest — the first one whose maxPages
// covers the selected count is the match; an empty maxPages (the last tier)
// is the unlimited catch-all for anything bigger.
function matchTier(tiers: SitemapTier[], pageCount: number): SitemapTier | undefined {
  if (tiers.length === 0) return undefined;
  return tiers.find((tier) => typeof tier.maxPages === "number" && pageCount <= tier.maxPages) ?? tiers[tiers.length - 1];
}

export default function SitemapBuilderBlock({ block, locale, id, className }: SitemapBuilderBlockProps) {
  const pages = block.pages ?? [];
  const tiers = block.tiers ?? [];
  const [checked, setChecked] = useState<boolean[]>(() => pages.map((page) => Boolean(page.alwaysIncluded)));

  if (pages.length === 0) return null;

  function toggle(index: number) {
    if (pages[index]?.alwaysIncluded) return;
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)));
  }

  const selectedCount = checked.filter(Boolean).length;
  const matchedTier = matchTier(tiers, selectedCount);

  return (
    <div id={id} className={className}>
      {block.heading?.[locale] && <h2>{block.heading[locale]}</h2>}
      {block.intro?.[locale] && (
        <p className="text-color-secondary">{block.intro[locale]}</p>
      )}

      <div className={styles.layout}>
        <ul className={styles.pageList}>
          {pages.map((page, index) => (
            <li key={index} className={styles.pageItem}>
              <label
                className={`${styles.pageLabel} ${page.alwaysIncluded ? styles.pageLabelLocked : ""}`}
              >
                <input
                  type="checkbox"
                  checked={checked[index] ?? false}
                  disabled={Boolean(page.alwaysIncluded)}
                  onChange={() => toggle(index)}
                />
                <span>
                  <span className={styles.pageName}>{page.name?.[locale]}</span>
                  <span className={`text-color-secondary ${styles.pageDescription}`}>
                    {page.description?.[locale]}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>

        <div className={styles.result} data-theme="alt">
          <div className={styles.resultTop}>
            <p className="text-size-small text-color-tertiary text-transform-uppercase">
              {locale === "ru" ? "Ваш сайт" : "Your site"}
            </p>
            <p className={styles.pageCount}>
              {selectedCount} {locale === "ru" ? "стр." : selectedCount === 1 ? "page" : "pages"}
            </p>
          </div>

          {matchedTier && (
            <>
              <div className={styles.resultBlock}>
                <p className="font-weight-bold">{matchedTier.title?.[locale]}</p>
                {matchedTier.price !== undefined && (
                  <p className="text-color-secondary">
                    {locale === "ru" ? "Подходит тариф от" : "Fits the tier from"} ${matchedTier.price}
                  </p>
                )}
              </div>

              {matchedTier.timeline?.[locale] && (
                <div className={styles.resultBlock}>
                  <p className="text-size-small text-color-tertiary text-transform-uppercase">
                    {locale === "ru" ? "Ориентировочный срок" : "Estimated timeline"}
                  </p>
                  <p className="font-weight-bold">{matchedTier.timeline[locale]}</p>
                </div>
              )}
            </>
          )}

          <ScrollToButton targetId="order-form" className="button-filled">
            {locale === "ru" ? "Получить точную смету" : "Get a precise quote"}
          </ScrollToButton>
        </div>
      </div>
    </div>
  );
}
