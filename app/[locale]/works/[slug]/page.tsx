// app/[locale]/works/[slug]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import styles from "./page.module.css";

const WORK_PAGE_QUERY = `*[_type == "work" && slug.current == $slug][0]{
  title,
  heroDescription,
  heroImage,
  services[]->{ title },
  client->{ name },
  year,
  role,
  stack,
  liveUrl,
  overviewBody,
  kinescopeVideoUrl,
  scopeOfWork,
  gallery
}`;

type ScopeItem = {
  heading?: Record<string, string>;
  description?: Record<string, string>;
};

function formatLiveUrlLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const work = await client.fetch(WORK_PAGE_QUERY, { slug });

  if (!work) {
    notFound();
  }

  const services: { title?: Record<string, string> }[] = work.services ?? [];
  const scopeOfWork: ScopeItem[] = work.scopeOfWork ?? [];
  const gallery: any[] = work.gallery ?? [];

  return (
    <div className="page-wrapper">
      <header>{/* Header */}</header>

      <main>
        <section id="work-hero" className={`${styles.heroSection} pb-small`}>
          <Link
            href={`/${locale}/works`}
            className="text-size-base text-color-secondary"
          >
            / {locale === "ru" ? "Все работы" : "All works"}
          </Link>

          <div className={styles.heroGrid}>
            <h1>{work.title}</h1>

            <div className={styles.heroRight}>
              <p>{work.heroDescription?.[locale]}</p>

              {services.length > 0 && (
                <div className={styles.servicesList}>
                  {services.map((service, index) => (
                    <span
                      key={index}
                      className="text-size-small text-color-secondary text-transform-uppercase"
                    >
                      {service.title?.[locale]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {work.heroImage && (
            <div className={styles.heroImageWrap}>
              <img
                src={urlFor(work.heroImage).url()}
                alt={work.title}
                className={styles.heroImage}
              />
            </div>
          )}
          <div className={styles.metaGrid}>
            {work.client?.name && (
              <div className={styles.metaItem}>
                <span className="text-size-small text-color-secondary text-transform-uppercase">
                  {locale === "ru" ? "Клиент" : "Client"}
                </span>
                <p className="text-size-base">{work.client.name}</p>
              </div>
            )}
            {work.year && (
              <div className={styles.metaItem}>
                <span className="text-size-small text-color-secondary text-transform-uppercase">
                  {locale === "ru" ? "Год" : "Year"}
                </span>
                <p className="text-size-base">{work.year}</p>
              </div>
            )}
            {work.role && (
              <div className={styles.metaItem}>
                <span className="text-size-small text-color-secondary text-transform-uppercase">
                  {locale === "ru" ? "Роль" : "Role"}
                </span>
                <p className="text-size-base">{work.role}</p>
              </div>
            )}
            {work.stack && (
              <div className={styles.metaItem}>
                <span className="text-size-small text-color-secondary text-transform-uppercase">
                  Stack
                </span>
                <p className="text-size-base ">{work.stack}</p>
              </div>
            )}
            {work.liveUrl && (
              <div className={styles.metaItem}>
                <span className="text-size-small text-color-tertiary text-transform-uppercase">
                  Live
                </span>
                <a
                  href={work.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-icon"
                  data-icon="arrow_outward"
                >
                  {formatLiveUrlLabel(work.liveUrl)}
                </a>
              </div>
            )}
          </div>
        </section>

        <section className="pt-small">
          <div className={styles.sectionGrid}>
            <h2 className="text-size-large">
              {locale === "ru" ? "О проекте" : "Overview"}
            </h2>

            <div className={styles.overviewContent}>
              <PortableText value={work.overviewBody?.[locale] ?? []} />

              {work.kinescopeVideoUrl && (
                <div className={styles.videoWrap}>
                  <iframe
                    src={work.kinescopeVideoUrl}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className={styles.video}
                  />
                </div>
              )}
            </div>

            <div className="hide-tablet"></div>

            <h2 className="text-size-large">
              {locale === "ru" ? "Состав работ" : "Scope of work"}
            </h2>

            <div className={styles.scopeList}>
              {scopeOfWork.map((item, index) => (
                <div key={index} className={styles.scopeItem}>
                  <h3 className="text-size-base font-weight-bold">
                    {item.heading?.[locale]}
                  </h3>
                  <p className="text-color-secondary">
                    {item.description?.[locale]}
                  </p>
                </div>
              ))}
            </div>

            <div className="hide-tablet"></div>

            <div className="hide-mobile"></div>

            {gallery.length > 0 && (
              <div className={styles.galleryList}>
                {gallery.map((image, index) => (
                  <div key={index} className={styles.galleryImageWrap}>
                    <img
                      src={urlFor(image).width(1600).url()}
                      alt=""
                      className={styles.galleryImage}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
