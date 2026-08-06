"use client";

import { useState } from "react";
import styles from "./PageAnatomyBlock.module.css";

export type PageAnatomyItem = {
  name?: Record<string, string>;
  description?: Record<string, string>;
  includedInBase?: boolean;
};

export type PageAnatomyBlockData = {
  _key?: string;
  heading?: Record<string, string>;
  intro?: Record<string, string>;
  items?: PageAnatomyItem[];
};

type PageAnatomyBlockProps = {
  block: PageAnatomyBlockData;
  locale: string;
  id?: string;
  className?: string;
};

// Authors write the tab label and the panel heading as one string — e.g.
// "Hero: the 5-second test" — the tab shows the part before the colon,
// the panel shows the whole line.
function getTabLabel(name: string) {
  const colonIndex = name.indexOf(":");
  return colonIndex === -1 ? name : name.slice(0, colonIndex).trim();
}

export default function PageAnatomyBlock({ block, locale, id, className }: PageAnatomyBlockProps) {
  const items = block.items ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  if (items.length === 0) return null;

  return (
    <div id={id} className={className}>
      {block.heading?.[locale] && <h2>{block.heading[locale]}</h2>}
      {block.intro?.[locale] && (
        <p className="text-color-secondary">{block.intro[locale]}</p>
      )}

      <div className={styles.layout}>
        <div className={styles.tabs} role="tablist">
          {items.map((item, index) => {
            const name = item.name?.[locale] ?? "";
            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                className={[
                  styles.tab,
                  item.includedInBase ? styles.tabBase : styles.tabExtension,
                  index === activeIndex ? styles.tabActive : "",
                ].join(" ")}
                onClick={() => setActiveIndex(index)}
              >
                {getTabLabel(name)}
              </button>
            );
          })}
        </div>

        {activeItem && (
          <div className={styles.panel} data-theme="alt">
            <div className={styles.panelTop}>
              <span className={styles.panelIndex}>
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className={styles.panelBadge}>
                {activeItem.includedInBase
                  ? locale === "ru"
                    ? "Базовый пакет"
                    : "Base package"
                  : locale === "ru"
                    ? "Расширение"
                    : "Extension"}
              </span>
            </div>

            <div className={styles.panelBody}>
              <h3>{activeItem.name?.[locale]}</h3>
              <p className="text-color-secondary">{activeItem.description?.[locale]}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
