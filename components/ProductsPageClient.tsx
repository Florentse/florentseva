"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import styles from "./ProductsPageClient.module.css";

type Product = {
  title?: Record<string, string>;
  slug: { current: string };
  url?: string;
  description?: Record<string, string>;
  coverImage?: unknown;
  category?: { title?: Record<string, string>; slug?: { current: string } };
};

type Category = {
  title?: Record<string, string>;
  slug: { current: string };
  sortOrder?: number;
};

type ProductsPageClientProps = {
  products: Product[];
  categories: Category[];
  locale: string;
};

export default function ProductsPageClient({
  products,
  categories,
  locale,
}: ProductsPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const sortedCategories = [...categories].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  const categoryCounts = sortedCategories.reduce<Record<string, number>>((acc, category) => {
    const slug = category.slug.current;
    acc[slug] = products.filter((product) => product.category?.slug?.current === slug).length;
    return acc;
  }, {});

  const visibleCategories = sortedCategories.filter(
    (category) => categoryCounts[category.slug.current] > 0,
  );

  const filteredProducts = activeFilter
    ? products.filter((product) => product.category?.slug?.current === activeFilter)
    : products;

  return (
    <div className="page-wrapper">
      <header>{/* Header */}</header>

      <main>
        <section id="products-listing" className={styles.productsListing}>
          <h1>{locale === "ru" ? "Продукты" : "Products"}</h1>

          <div className={styles.productsLayout}>
            <aside className={`${styles.productsAside} filterList`}>
              <button
                onClick={() => setActiveFilter(null)}
                className={`filterButton ${!activeFilter ? "filterButtonActive" : ""}`}
              >
                {locale === "ru" ? "Все" : "All"}
              </button>
              {visibleCategories.map((category) => (
                <button
                  key={category.slug.current}
                  onClick={() => setActiveFilter(category.slug.current)}
                  className={`filterButton ${activeFilter === category.slug.current ? "filterButtonActive" : ""}`}
                >
                  {category.title?.[locale]} ({categoryCounts[category.slug.current]})
                </button>
              ))}
            </aside>

            <div className={`${styles.productsList} flex-col gap-huge`}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.slug.current}
                  title={product.title?.[locale] ?? ""}
                  description={product.description?.[locale]}
                  category={product.category?.title?.[locale]}
                  coverImage={product.coverImage}
                  slug={product.slug.current}
                  url={product.url}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
