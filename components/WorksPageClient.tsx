"use client";

import { useState } from "react";
import WorkSliderCard from "./WorkSliderCard";
import styles from "./WorksPageClient.module.css";

type WorksPageClientProps = {
  works: any[];
  services: any[];
  locale: string;
};

export default function WorksPageClient({
  works,
  services,
  locale,
}: WorksPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const sortedServices = [...services].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  const serviceCounts = sortedServices.reduce<Record<string, number>>(
    (acc, service) => {
      const slug = service.slug.current;
      acc[slug] = works.filter((work) =>
        work.services?.some((s: any) => s.slug.current === slug),
      ).length;
      return acc;
    },
    {},
  );

  const visibleServices = sortedServices.filter(
    (service) => serviceCounts[service.slug.current] > 0,
  );

  const filteredWorks = activeFilter
    ? works.filter((work) =>
        work.services?.some((s: any) => s.slug.current === activeFilter),
      )
    : works;

  return (
    <div className="page-wrapper">
      <header>{/* Header */}</header>

      <main>
        <section id="works-listing" className={styles.worksListingSection}>
          <div className={styles.worksGrid}>
            <h1 className={styles.worksHeading}>
              {locale === "ru" ? "Работы" : "Works"}
            </h1>

            <aside className={`${styles.worksAside} filterList`}>
              <button
                onClick={() => setActiveFilter(null)}
                className={`filterButton ${!activeFilter ? "filterButtonActive" : ""}`}
              >
                {locale === "ru" ? "Все" : "All"}
              </button>
              {visibleServices.map((service) => (
                <button
                  key={service.slug.current}
                  onClick={() => setActiveFilter(service.slug.current)}
                  className={`filterButton ${activeFilter === service.slug.current ? "filterButtonActive" : ""}`}
                >
                  {service.title?.[locale]} ({serviceCounts[service.slug.current]})
                </button>
              ))}
            </aside>

            <div className={`${styles.worksList} flex-col gap-huge`}>
              {filteredWorks.map((work) => (
                <WorkSliderCard
                  key={work.slug.current}
                  title={work.title}
                  slug={work.slug.current}
                  cardImages={work.cardImages}
                  cardDescription={work.cardDescription?.[locale]}
                  services={work.services?.map((s: any) => s.title?.[locale])}
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