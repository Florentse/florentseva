"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { matchesSearch } from "@/sanity/lib/search-utils";

type SearchDoc = {
  // Work.title is a plain string; service/product/article titles are
  // localized objects ({ en, ru }) — resolveTitle() below handles both.
  title?: string | Record<string, string>;
  slug?: { current: string };
  cardDescription?: Record<string, string>;
  shortDescription?: Record<string, string>;
  description?: Record<string, string>;
  metaDescription?: Record<string, string>;
  // Editor-authored synonyms that should surface a doc without changing its
  // visible title/description (e.g. "website" for a Webflow template).
  searchKeywords?: Record<string, string>[];
  // Products hosted elsewhere (e.g. a marketplace template) link out via
  // `url` instead of the internal product page — see ProductCard.tsx.
  url?: string;
};

function resolveTitle(title: SearchDoc["title"], locale: string): string {
  if (!title) return "";
  return typeof title === "string" ? title : (title[locale] ?? "");
}

type HomeSearchProps = {
  locale: string;
  works: SearchDoc[];
  services: SearchDoc[];
  products: SearchDoc[];
  articles: SearchDoc[];
};

const MAX_PER_GROUP = 4;

export default function HomeSearch({ locale, works, services, products, articles }: HomeSearchProps) {
  const [inputValue, setInputValue] = useState("");

  const groups = useMemo(() => {
    const query = inputValue.trim();
    if (query.length < 2) return [];

    function matchGroup(label: string, basePath: string, docs: SearchDoc[], extraText: keyof SearchDoc) {
      const items = docs
        .filter((doc) =>
          matchesSearch(query, [
            resolveTitle(doc.title, locale),
            (doc[extraText] as Record<string, string> | undefined)?.[locale] ?? "",
            // Slugs often carry meaningful words a plain title/description
            // wouldn't (e.g. "nexon-webflow-template") — split on hyphens so
            // they match as whole words rather than one run-together token.
            doc.slug?.current?.replace(/-/g, " ") ?? "",
            ...(doc.searchKeywords?.map((keyword) => keyword[locale] ?? "") ?? []),
          ]),
        )
        .slice(0, MAX_PER_GROUP)
        .map((doc) => ({
          title: resolveTitle(doc.title, locale),
          // A product with an external `url` (e.g. a marketplace template)
          // links out there instead of to its internal page — same fallback
          // as ProductCard.
          href: doc.url || `${basePath}/${doc.slug?.current}`,
          isExternal: Boolean(doc.url),
        }));
      return { label, items };
    }

    return [
      matchGroup(locale === "ru" ? "Услуги" : "Services", "/services", services, "shortDescription"),
      matchGroup(locale === "ru" ? "Продукты" : "Products", "/products", products, "description"),
      matchGroup(locale === "ru" ? "Статьи" : "Articles", "/blog", articles, "metaDescription"),
      matchGroup(locale === "ru" ? "Работы" : "Works", "/works", works, "cardDescription"),
    ].filter((group) => group.items.length > 0);
  }, [inputValue, locale, works, services, products, articles]);

  function handleReset() {
    setInputValue("");
  }

  return (
    <div className="search-wrapper">
      <div className="search-container">
        <span className="material-symbols-outlined search-icon">search</span>
        <input
          className="search-input"
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={
            locale === "ru"
              ? "Поиск по работам, услугам, продуктам, статьям..."
              : "Search works, services, products, articles ..."
          }
        />
        {inputValue && (
          <button className="search-reset-button" onClick={handleReset}>
            ✕
          </button>
        )}
      </div>

      {groups.length > 0 && (
        <div className="searchHintGroups">
          {groups.map((group) => (
            <div key={group.label} className="searchHintGroup">
              <span className="text-size-small text-transform-uppercase searchHintGroupLabel">
                {group.label}
              </span>
              {group.items.map((item) =>
                item.isExternal ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="searchHintButton"
                  >
                    {item.title}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href} className="searchHintButton">
                    {item.title}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
