"use client";

import { useState } from "react";
import ScrollToButton from "./ScrollToButton";
import styles from "./ScopeBuilderBlock.module.css";

export type ScopeItem = {
  name?: Record<string, string>;
  description?: Record<string, string>;
  alwaysIncluded?: boolean;
};

export type ScopeTier = {
  title?: Record<string, string>;
  price?: number;
  maxFeatures?: number;
  timeline?: Record<string, string>;
};

export type ScopeBuilderBlockData = {
  _key?: string;
  heading?: Record<string, string>;
  intro?: Record<string, string>;
  items?: ScopeItem[];
  tiers?: ScopeTier[];
};

type ScopeBuilderBlockProps = {
  block: ScopeBuilderBlockData;
  locale: string;
  id?: string;
  className?: string;
};

// The tiers are authored smallest-to-largest — the first one whose
// maxFeatures covers the selected count is the match; an empty maxFeatures
// (the last tier) is the unlimited catch-all for anything bigger.
function matchTier(tiers: ScopeTier[], featureCount: number): ScopeTier | undefined {
  if (tiers.length === 0) return undefined;
  return (
    tiers.find((tier) => typeof tier.maxFeatures === "number" && featureCount <= tier.maxFeatures) ??
    tiers[tiers.length - 1]
  );
}

export default function ScopeBuilderBlock({ block, locale, id, className }: ScopeBuilderBlockProps) {
  const items = block.items ?? [];
  const tiers = block.tiers ?? [];
  const [checked, setChecked] = useState<boolean[]>(() => items.map((item) => Boolean(item.alwaysIncluded)));

  if (items.length === 0) return null;

  function toggle(index: number) {
    if (items[index]?.alwaysIncluded) return;
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
        <ul className={styles.itemList}>
          {items.map((item, index) => (
            <li key={index} className={styles.item}>
              <label
                className={`${styles.itemLabel} ${item.alwaysIncluded ? styles.itemLabelLocked : ""}`}
              >
                <input
                  type="checkbox"
                  checked={checked[index] ?? false}
                  disabled={Boolean(item.alwaysIncluded)}
                  onChange={() => toggle(index)}
                />
                <span>
                  <span className={styles.itemName}>{item.name?.[locale]}</span>
                  <span className={`text-color-secondary ${styles.itemDescription}`}>
                    {item.description?.[locale]}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>

        <div className={styles.result} data-theme="alt">
          <div className={styles.resultTop}>
            <p className="text-size-small text-color-tertiary text-transform-uppercase">
              {locale === "ru" ? "Ваш MVP" : "Your MVP"}
            </p>
            <p className={styles.featureCount}>
              {selectedCount} {locale === "ru" ? "функц." : selectedCount === 1 ? "feature" : "features"}
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
