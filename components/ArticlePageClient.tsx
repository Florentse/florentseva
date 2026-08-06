"use client";

import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import { SITE_URL } from "@/lib/siteUrl";
import ServiceTocNav from "./ServiceTocNav";
import ViewTracker from "./ViewTracker";
import styles from "./ArticlePageClient.module.css";

type ArticleSection = {
  heading?: Record<string, string>;
  content?: Record<string, PortableTextBlock[]>;
};

type Article = {
  title?: Record<string, string>;
  slug?: { current: string };
  metaDescription?: Record<string, string>;
  publishedAt?: string;
  coverImage?: SanityImageSource;
  category?: { title?: Record<string, string> };
  sections?: ArticleSection[];
};

type ArticlePageClientProps = {
  article: Article;
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
  const slug = article.slug?.current as string | undefined;
  const title = article.title?.[locale] ?? "";
  const coverImage = article.coverImage;

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(
        locale === "ru" ? "ru-RU" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : null;

  const pageUrl = slug ? `${SITE_URL}/${locale}/blog/${slug}` : SITE_URL;
  const shareLinks = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`,
    },
  ];

  return (
    <div className="page-wrapper">
      <ViewTracker type="article" slug={slug} />
      <header>{/* Header */}</header>

      <main>
        <section id="article-hero" className={styles.heroSection}>
          <div className={styles.heroTopRow}>
            <Link
              href={`/${locale}/blog`}
              className="text-size-base text-color-tertiary"
            >
              / {locale === "ru" ? "Все посты" : "All posts"}
            </Link>
            <div className={styles.metaRow}>
              {article.category?.title?.[locale] && (
                <span className="text-size-small text-color-secondary text-transform-uppercase">
                  {article.category.title[locale]}
                </span>
              )}
              {formattedDate && (
                <span className="text-size-small text-color-secondary">
                  {formattedDate}
                </span>
              )}
            </div>
          </div>
          <div className={styles.heroContent}>
            <div className={styles.heroHeadingWrap}>
              <h1>{title}</h1>
            </div>

            {coverImage && (
              <div className={styles.coverWrap}>
                <img
                  src={urlFor(coverImage).width(1600).height(700).url()}
                  alt={title}
                  className={styles.cover}
                />
              </div>
            )}
          </div>
        </section>

        <section id="article-body" className={styles.articleBody}>
          <div className={styles.layout}>
            <aside className={styles.aside}>
              <div className="text-size-large text-color-secondary">
                {locale === "ru" ? "Содержание" : "Content"}
              </div>
              <ServiceTocNav
                className={styles.toc}
                items={sections.map((section, index) => ({
                  id: `section-${index}`,
                  label: section.heading?.[locale] ?? "",
                }))}
              />
            </aside>

            <article className={styles.content}>
              {sections.map((section, index) => (
                <section
                  key={index}
                  id={`section-${index}`}
                  className={styles.section}
                >
                  <h2 className="title-style-h3">{section.heading?.[locale]}</h2>
                  <PortableText
                    value={section.content?.[locale] ?? []}
                    components={portableTextComponents}
                  />
                </section>
              ))}

              <div className={styles.shareRow}>
                <span className="text-size-small text-color-tertiary text-transform-uppercase">
                  {locale === "ru" ? "Поделиться" : "Share"}
                </span>
                <div className={styles.shareButtons}>
                  {shareLinks.map((share) => (
                    <a
                      key={share.name}
                      href={share.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.shareButton}
                    >
                      {share.name}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
