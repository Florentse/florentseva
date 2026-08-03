//components/BlogPageClient.tsx

"use client";

import { useMemo, useState } from "react";
import ArticleCard from "./ArticleCard";
import styles from "./BlogPageClient.module.css";
import { buildHints, highlightText, matchesSearch } from "@/sanity/lib/search-utils";

type BlogPageClientProps = {
  articles: any[];
  categories: any[];
  locale: string;
};

export default function BlogPageClient({
  articles,
  categories,
  locale,
}: BlogPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [hints, setHints] = useState<string[]>([]);

  const getArticleTexts = (article: any) => [
    article.title?.[locale] ?? "",
    article.metaDescription?.[locale] ?? "",
  ];

  const sortedCategories = [...categories].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  const categoryCounts = sortedCategories.reduce<Record<string, number>>(
    (acc, category) => {
      const slug = category.slug.current;
      acc[slug] = articles.filter(
        (article) => article.category?.slug?.current === slug,
      ).length;
      return acc;
    },
    {},
  );

  const visibleCategories = sortedCategories.filter(
    (category) => categoryCounts[category.slug.current] > 0,
  );

  const filteredArticles = appliedSearch
    ? articles.filter((article) => matchesSearch(appliedSearch, getArticleTexts(article)))
    : activeFilter
      ? articles.filter((article) => article.category?.slug?.current === activeFilter)
      : articles;

  const appliedQueryWords = useMemo(
    () => appliedSearch.toLowerCase().split(/\s+/).filter(Boolean),
    [appliedSearch],
  );

  function handleCategoryClick(slug: string | null) {
    setActiveFilter(slug);
    setAppliedSearch("");
    setInputValue("");
    setHints([]);
  }

  function handleInputChange(value: string) {
    setInputValue(value);

    if (!value.trim()) {
      setHints([]);
      if (appliedSearch) {
        setAppliedSearch("");
        setActiveFilter(null);
      }
      return;
    }

    const texts = articles.flatMap(getArticleTexts);
    setHints(buildHints(value, texts));
  }

  function handleHintClick(hint: string) {
    setInputValue(hint);
    setAppliedSearch(hint);
    setHints([]);
    setActiveFilter(null);
  }

  function handleSearchReset() {
    setInputValue("");
    setAppliedSearch("");
    setHints([]);
    setActiveFilter(null);
  }

  return (
    <div className="page-wrapper">
      <header>{/* Header */}</header>

      <main>
        <section id="blog-listing" className={styles.blogListingSection}>
          <div className={styles.blogTopGrid}>
            <h1 className={styles.blogHeading}>
              {locale === "ru" ? "Блог" : "Blog"}
            </h1>

            <aside className={`${styles.blogAside} filterList`}>
              <button
                onClick={() => handleCategoryClick(null)}
                className={`filterButton ${!activeFilter ? "filterButtonActive" : ""}`}
              >
                {locale === "ru" ? "Все" : "All"} ({articles.length})
              </button>
              {visibleCategories.map((category) => (
                <button
                  key={category.slug.current}
                  onClick={() => handleCategoryClick(category.slug.current)}
                  className={`filterButton ${activeFilter === category.slug.current ? "filterButtonActive" : ""}`}
                >
                  {category.title?.[locale]} (
                  {categoryCounts[category.slug.current]})
                </button>
              ))}
            </aside>
          </div>

          <div className="search-wrapper">
            <div className="search-container">
              <span className="material-symbols-outlined search-icon">search</span>
              <input
              className="search-input"
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={locale === "ru" ? "Поиск..." : "Search..."}
              />
              {appliedSearch && (
                <button className="search-reset-button" onClick={handleSearchReset}>
                  ✕
                </button>
              )}
            </div>

            {hints.length > 0 && (
              <div className="searchHints">
                {hints.map((hint) => (
                  <button
                    key={hint}
                    className="searchHintButton"
                    onClick={() => handleHintClick(hint)}
                  >
                    {hint}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.blogList}>
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.slug.current}
                title={
                  appliedSearch
                    ? highlightText(article.title?.[locale], appliedQueryWords)
                    : article.title?.[locale]
                }
                slug={article.slug.current}
                coverImage={article.coverImage}
                categoryTitle={article.category?.title?.[locale]}
                publishedAt={article.publishedAt}
                locale={locale}
              />
            ))}
          </div>
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}