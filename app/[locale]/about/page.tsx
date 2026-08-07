// app/[locale]/about/page.tsx

import { cache } from "react";
import type { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { SITE_URL } from "@/lib/siteUrl";
import { nbspDeep } from "@/lib/nbsp";
import styles from "./page.module.css";

const ABOUT_PAGE_QUERY = `*[_id == "about"][0]{
  title,
  intro,
  photo,
  stats,
  inShortItems,
  awards,
  testimonials[]{
    quote,
    authorName,
    authorRole,
    note,
    client->{name},
    work->{title}
  }
}`;

const getAboutData = cache(async () => nbspDeep(await client.fetch(ABOUT_PAGE_QUERY)));

type Stat = {
  value?: string;
  label?: Record<string, string>;
};

type AboutSectionItem = {
  heading?: Record<string, string>;
  body?: Record<string, any[]>;
};

type Award = {
  year?: string;
  title?: string;
  projectName?: string;
  platform?: string;
  image?: any;
  url?: string;
};

type Testimonial = {
  quote?: Record<string, string>;
  authorName?: string;
  authorRole?: Record<string, string>;
  note?: Record<string, string>;
  client?: { name?: string };
  work?: { title?: string };
};

function getPortableTextComponents(photo: any): PortableTextComponents {
  return {
    marks: {
      link: ({ children, value }) => {
        const isExternal = value?.href?.startsWith("http");
        return (
          <a
            href={value?.href}
            target={isExternal ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            {children}
          </a>
        );
      },
      hoverPhoto: ({ children }) => (
        <span className={styles.hoverPhotoTrigger}>
          {children}
          {photo && (
            <span className={styles.hoverPhotoPreview}>
              <img
                src={urlFor(photo).width(240).height(300).url()}
                alt=""
                className={styles.hoverPhotoImage}
              />
            </span>
          )}
        </span>
      ),
    },
  };
}

function testimonialByline(testimonial: Testimonial, locale: string) {
  const parts = [
    testimonial.authorName,
    testimonial.authorRole?.[locale],
    testimonial.client?.name,
    testimonial.work?.title,
    testimonial.note?.[locale],
  ];
  return parts.filter(Boolean).join(", ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const about = await getAboutData();

  const title = locale === "ru" ? "Обо мне" : "About";
  const description =
    about?.intro?.[locale] ??
    (locale === "ru"
      ? "Веб-разработчик и дизайнер, специализирующаяся на Webflow и Next.js. Опыт, подход к работе и отзывы клиентов."
      : "Web developer and designer specializing in Webflow and Next.js. Background, approach, and client testimonials.");
  const keywords = [
    locale === "ru" ? "обо мне" : "about",
    locale === "ru" ? "веб-разработчик" : "web developer",
    locale === "ru" ? "веб-дизайнер" : "web designer",
    "Webflow",
    "Next.js",
    "Tatiana Florentseva",
  ];

  const url = locale === "ru" ? `${SITE_URL}/ru/about` : `${SITE_URL}/about`;
  const imageUrl = about?.photo ? urlFor(about.photo).width(1200).height(630).url() : undefined;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/about`,
        ru: `${SITE_URL}/ru/about`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "florentseva",
      type: "profile",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const about = await getAboutData();

  const stats: Stat[] = about?.stats ?? [];
  const inShortItems: AboutSectionItem[] = about?.inShortItems ?? [];
  const awards: Award[] = about?.awards ?? [];
  const testimonials: Testimonial[] = about?.testimonials ?? [];
  const portableTextComponents = getPortableTextComponents(about?.photo);

  const baseUrl = locale === "ru" ? `${SITE_URL}/ru` : SITE_URL;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Tatiana Florentseva",
    url: `${baseUrl}/about`,
    jobTitle: locale === "ru" ? "Веб-разработчик и дизайнер" : "Web Developer & Designer",
    image: about?.photo ? urlFor(about.photo).width(1200).height(630).url() : undefined,
    description: about?.intro?.[locale],
  };

  return (
    <div className="page-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header>{/* Header */}</header>

      <main>
        <section id="about-hero" className={`${styles.hero} pt-large`}>
          <div className={styles.heroGrid}>
            <h1>{about?.title?.[locale]}</h1>
            <div className={styles.heroContent}>
              <p>{about?.intro?.[locale]}</p>
            </div>
          </div>

          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <p className="title-style-h2">{stat.value}</p>
                <p className="text-color-secondary">{stat.label?.[locale]}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about-in-short" className={`${styles.section} pt-small`}>
          <div className={styles.sectionGrid}>
            <h2 className="text-size-large">
              {locale === "ru" ? "В кратце" : "In short"}
            </h2>

            <div className={styles.inShortList}>
              {inShortItems.map((item, index) => (
                <div key={index} className={styles.inShortItem}>
                  <h3>{item.heading?.[locale]}</h3>
                  <PortableText
                    value={item.body?.[locale] ?? []}
                    components={portableTextComponents}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {awards.length > 0 && (
          <section id="about-awards" className={`${styles.section} pt-small`}>
            <div className={styles.sectionGrid}>
              <h2 className="text-size-large">
                {locale === "ru" ? "Награды" : "Awards"}
              </h2>

              <div className={styles.awardsList}>
                {awards.map((award, index) => (
                  <div key={index} className={styles.awardRow}>
                    <p className="text-color-secondary">{award.year}</p>
                    <p className="font-weight-bold">{award.title}</p>
                    <p className="text-color-secondary">
                      {award.projectName}
                    </p>
                    {award.image && (
                      <div className={styles.awardImageWrap}>
                        <img
                          src={urlFor(award.image).width(160).height(160).url()}
                          alt=""
                          className={styles.awardImage}
                        />
                      </div>
                    )}
                    {award.url ? (
                      <a
                        href={award.url}
                        className="link-icon"
                        data-icon="chevron_forward"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {award.platform}
                      </a>
                    ) : (
                      <span className="text-color-secondary">
                        {award.platform}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {testimonials.length > 0 && (
          <section id="about-testimonials" className={`${styles.section} pt-small`}>
            <div className={styles.sectionGrid}>
              <h2 className="text-size-large">
                {locale === "ru" ? "Отзывы" : "What people say"}
              </h2>

              <div className={styles.testimonialsList}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className={styles.testimonialItem}>
                    <p>{testimonial.quote?.[locale]}</p>
                    <p className=" text-color-tertiary">
                      — {testimonialByline(testimonial, locale)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
