//components/ServicesPageClient.tsx

"use client";

import { useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import styles from "./ServicesPageClient.module.css";

type ServicesPageClientProps = {
  intro?: Record<string, string>;
  categories: any[];
  locale: string;
};

export default function ServicesPageClient({
  intro,
  categories,
  locale,
}: ServicesPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const totalCount = categories.reduce(
    (sum, category) => sum + (category.services?.length ?? 0),
    0,
  );

  const visibleCategories = activeCategory
    ? categories.filter((category) => category._id === activeCategory)
    : categories;

  let itemNumber = 0;

  return (
    <div className="page-wrapper">
      <header>{/* Header */}</header>

      <main>
        <section className="pt-large" id="services-intro">
          <div className="max-width-large">
            <p className="title-style-h2 text-color-primary">{intro?.[locale]}</p>
          </div>
        </section>

        <section className="pt-small" id="services-listing">
          <div className={styles.servicesHeader}>
            <h1 className="text-size-large">
              {locale === "ru" ? "Услуги" : "Services"}
            </h1>
            <div className={`${styles.filterList} filterList`}>
              <button
                onClick={() => setActiveCategory(null)}
                className={`filterButton ${!activeCategory ? "filterButtonActive" : ""}`}
              >
                {locale === "ru" ? "Все" : "All"} ({totalCount})
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setActiveCategory(category._id)}
                  className={`filterButton ${activeCategory === category._id ? "filterButtonActive" : ""}`}
                >
                  {category.title?.[locale]} ({category.services?.length ?? 0})
                </button>
              ))}
            </div>
          </div>

          <div className={styles.serviceCategoriesList}>
            {visibleCategories.map((category) => (
              <div key={category._id} className={styles.serviceCategoriesItem}>
                <h2 className="text-size-small text-transform-uppercase">{category.title?.[locale]}</h2>

                <div className={styles.serviceCardsList}>
                  {category.services?.map((service: any) => {
                    itemNumber += 1;
                    const prices =
                      service.pricing
                        ?.map((tier: any) => tier.price)
                        .filter(Boolean) ?? [];
                    const minPrice = prices.length
                      ? Math.min(...prices)
                      : undefined;

                    return (
                      <ServiceCard
                        key={service.slug.current}
                        number={itemNumber}
                        title={service.title?.[locale]}
                        description={service.shortDescription?.[locale]}
                        minPrice={minPrice}
                        slug={service.slug.current}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
