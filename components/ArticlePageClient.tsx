"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import styles from "./ArticlePageClient.module.css";

type ArticlePageClientProps = {
  article: any;
  locale: string;
};

const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const isExternal = value?.href?.startsWith("http");
      return (
        <a
          className={styles.link}
          href={value?.href}
          target={isExternal ? "_blank" : undefined}
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
  },
};

export default function ArticlePageClient({
  article,
  locale,
}: ArticlePageClientProps) {
  const sections = article.sections ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(
              entry.target as HTMLElement,
            );
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sections.length]);

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(
        locale === "ru" ? "ru-RU" : "en-US",
        { year: "numeric", month: "long", day: "numeric" },
      )
    : null;

  return (
    <div className="page-wrapper">
      <header>{/* Header */}</header>

      <main>
        <section className={styles.articleHero}>
          <div className="container">
            <div
              className={`${styles.breadcrumbs} text-size-small text-color-tertiary`}
            >
              <Link href={`/${locale}`}>
                {locale === "ru" ? "Главная" : "Home"}
              </Link>{" "}
              /{" "}
              <Link href={`/${locale}/blog`}>
                {locale === "ru" ? "Все посты" : "All posts"}
              </Link>{" "}
              /
            </div>

            <div className={styles.metaRow}>
              {article.category && (
                <span className="text-size-small text-color-tertiary text-transform-uppercase">
                  {article.category.title?.[locale]}
                </span>
              )}
              {formattedDate && (
                <span className="text-size-small text-color-tertiary">
                  {formattedDate}
                </span>
              )}
            </div>

            <h1 className={styles.title}>{article.title?.[locale]}</h1>

            {article.coverImage && (
              <div className={styles.coverWrap}>
                <img
                  src={urlFor(article.coverImage).url()}
                  alt={article.title?.[locale]}
                  className={styles.cover}
                />
              </div>
            )}
          </div>
        </section>

        <section className={styles.articleBody}>
          <div className={`container ${styles.layout}`}>
            <aside className={styles.aside}>
              <div className="text-size-small text-color-tertiary text-transform-uppercase">
                {locale === "ru" ? "На этой странице" : "On this page"}
              </div>
              <ol className={styles.toc}>
                {sections.map((section: any, index: number) => (
                  <li key={index}>
                    <a
                      href={`#section-${index}`}
                      className={
                        index === activeIndex
                          ? styles.tocLinkActive
                          : styles.tocLink
                      }
                    >
                      {section.heading?.[locale]}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <article className={styles.content}>
              {sections.map((section: any, index: number) => (
                <section
                  key={index}
                  id={`section-${index}`}
                  ref={(el) => {
                    sectionRefs.current[index] = el;
                  }}
                  className={styles.section}
                >
                  <h2>{section.heading?.[locale]}</h2>
                  <PortableText
                    value={section.content?.[locale] ?? []}
                    components={portableTextComponents}
                  />
                </section>
              ))}
            </article>
          </div>
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}