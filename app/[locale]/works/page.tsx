import { cache } from "react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/siteUrl";
import WorksPageClient from "@/components/WorksPageClient";

const WORKS_PAGE_QUERY = `{
  "works": *[_type == "work"] | order(sortOrder desc) {
    title,
    slug,
    cardImages,
    cardDescription,
    services[]->{ title, slug }
  },
  "services": *[_type == "service"] | order(title.en asc) {
    title,
    slug,
     sortOrder
  }
}`;

type WorkDoc = {
  title: string;
  slug: { current: string };
  services?: { title?: Record<string, string>; slug: { current: string } }[];
};

type ServiceDoc = {
  title?: Record<string, string>;
  slug: { current: string };
};

const getWorksData = cache(async (): Promise<{ works: WorkDoc[]; services: ServiceDoc[] }> =>
  client.fetch(WORKS_PAGE_QUERY),
);

// Categories with at least one actual work in them — same logic as the
// aside filter in WorksPageClient, so the description matches what's shown.
function getUsedCategoryNames(works: WorkDoc[], services: ServiceDoc[], locale: string): string[] {
  const usedSlugs = new Set(
    works.flatMap((work) => (work.services ?? []).map((service) => service.slug.current)),
  );
  return services
    .filter((service) => usedSlugs.has(service.slug.current))
    .map((service) => service.title?.[locale])
    .filter((title): title is string => Boolean(title));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { works, services } = await getWorksData();
  const categoryNames = getUsedCategoryNames(works, services, locale);
  const categoryList = categoryNames.join(locale === "ru" ? ", " : ", ");

  const title = locale === "ru" ? "Работы" : "Works";

  const description =
    locale === "ru"
      ? `Портфолио веб-дизайна и разработки: ${categoryList || "проекты"}. Кейсы сайтов на Webflow и Next.js — от дизайна и UX до вёрстки, анимации и запуска.`
      : `Web design and development portfolio: ${categoryList || "projects"}. Case studies of Webflow and Next.js websites — from design and UX to build, animation, and launch.`;

  const keywords = [
    ...categoryNames,
    locale === "ru" ? "портфолио" : "portfolio",
    locale === "ru" ? "веб-дизайн" : "web design",
    locale === "ru" ? "веб-разработка" : "web development",
    "Webflow",
    "Next.js",
    locale === "ru" ? "кейсы" : "case studies",
  ];

  const url = locale === "ru" ? `${SITE_URL}/ru/works` : `${SITE_URL}/works`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/works`,
        ru: `${SITE_URL}/ru/works`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "florentseva",
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { works, services } = await getWorksData();

  const baseUrl = locale === "ru" ? `${SITE_URL}/ru` : SITE_URL;
  const pageUrl = `${baseUrl}/works`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: locale === "ru" ? "Работы" : "Works",
    url: pageUrl,
    inLanguage: locale === "ru" ? "ru" : "en",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: works.map((work, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/works/${work.slug.current}`,
        name: work.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorksPageClient works={works} services={services} locale={locale} />
    </>
  );
}
