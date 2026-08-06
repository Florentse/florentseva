"use client";

import { useState } from "react";
import ScrollToButton from "./ScrollToButton";
import styles from "./ChecklistBlock.module.css";

export type ChecklistBlockData = {
  _key?: string;
  heading?: Record<string, string>;
  intro?: Record<string, string>;
  items?: Record<string, string>[];
  lowScoreHeading?: Record<string, string>;
  lowScoreText?: Record<string, string>;
  highScoreHeading?: Record<string, string>;
  highScoreText?: Record<string, string>;
};

type ChecklistBlockProps = {
  block: ChecklistBlockData;
  locale: string;
  id?: string;
  className?: string;
  itemListClassName?: string;
};

// Content is authored as e.g. "1 of 8 — the file needs a system" — the count is
// just an example value from whoever wrote it; we recompute it live and keep the rest.
const SCORE_PREFIX_PATTERN = /^\d+\s*(of|из)\s*\d+\s*[—-]\s*/iu;

function stripScorePrefix(text: string) {
  return text.replace(SCORE_PREFIX_PATTERN, "");
}

export default function ChecklistBlock({
  block,
  locale,
  id,
  className,
  itemListClassName,
}: ChecklistBlockProps) {
  const items = block.items ?? [];
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));

  function toggle(index: number) {
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)));
  }

  const checkedCount = checked.filter(Boolean).length;
  const total = items.length;
  const allChecked = total > 0 && checkedCount === total;

  const lowHeadingSuffix = stripScorePrefix(block.lowScoreHeading?.[locale] ?? "");
  const lowHeading = `${checkedCount} ${locale === "ru" ? "из" : "of"} ${total} — ${lowHeadingSuffix}`;

  return (
    <div id={id} className={className}>
      {block.heading?.[locale] && <h2>{block.heading[locale]}</h2>}
      {block.intro?.[locale] && (
        <p className="text-color-secondary">{block.intro[locale]}</p>
      )}

      <ul className={itemListClassName ?? styles.list}>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            <label className={styles.itemLabel}>
              <input
                type="checkbox"
                checked={checked[index] ?? false}
                onChange={() => toggle(index)}
              />
              <span>{item[locale]}</span>
            </label>
          </li>
        ))}
      </ul>

      <div className={styles.resultCard} data-theme="alt">
        {allChecked ? (
          <>
            <h3>{block.highScoreHeading?.[locale]}</h3>
            <p className="text-color-secondary">{block.highScoreText?.[locale]}</p>
          </>
        ) : (
          <>
            <h3>{lowHeading}</h3>
            <p className="text-color-secondary">{block.lowScoreText?.[locale]}</p>
            <ScrollToButton targetId="order-form" className="button-filled">
              {locale === "ru" ? "Заказать услугу" : "Order service"}
            </ScrollToButton>
          </>
        )}
      </div>
    </div>
  );
}
