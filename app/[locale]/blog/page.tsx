//app/[locale]/blog/page.tsx

import { cache } from "react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { SITE_URL } from "@/lib/siteUrl";
import BlogPageClient from "@/components/BlogPageClient";

const BLOG_PAGE_QUERY = `{
  "articles": *[_type == "article"] | order(publishedAt desc) {
    title,
    slug,
    coverImage,
    publishedAt,
    metaDescription,
    category->{ title, slug }
  },
  "categories": *[_type == "blogCategory"] | order(sortOrder asc) {
    title,
    slug,
    sortOrder
  }
}`;

type ArticleDoc = {
  title?: Record<string, string>;
  slug: { current: string };
  coverImage?: unknown;
  publishedAt?: string;
  metaDescription?: Record<string, string>;
  category?: { title?: Record<string, string>; slug?: { current: string } };
};

type CategoryDoc = {
  title?: Record<string, string>;
  slug: { current: string };
  sortOrder?: number;
};

const getBlogData = cache(async (): Promise<{ articles: ArticleDoc[]; categories: CategoryDoc[] }> =>
  client.fetch(BLOG_PAGE_QUERY),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { categories } = await getBlogData();

  const categoryNames = (categories ?? [])
    .map((category) => category.title?.[locale])
    .filter((title): title is string => Boolean(title));

  const title = locale === "ru" ? "Блог" : "Blog";

  const description =
    locale === "ru"
      ? `Статьи о веб-дизайне и разработке: ${categoryNames.join(", ") || "Webflow, Next.js, UX"}. Практические советы, разборы кейсов и гайды по созданию сайтов.`
      : `Articles on web design and development: ${categoryNames.join(", ") || "Webflow, Next.js, UX"}. Practical tips, case study breakdowns, and guides on building websites.`;

  const keywords = [
    ...categoryNames,
    locale === "ru" ? "блог веб-разработки" : "web development blog",
    locale === "ru" ? "веб-дизайн" : "web design",
    "Webflow",
    "Next.js",
  ];

  const url = locale === "ru" ? `${SITE_URL}/ru/blog` : `${SITE_URL}/blog`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/blog`,
        ru: `${SITE_URL}/ru/blog`,
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

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { articles, categories } = await getBlogData();

  const baseUrl = locale === "ru" ? `${SITE_URL}/ru` : SITE_URL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: locale === "ru" ? "Блог" : "Blog",
    url: `${baseUrl}/blog`,
    inLanguage: locale === "ru" ? "ru" : "en",
    blogPost: articles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title?.[locale],
      description: article.metaDescription?.[locale],
      url: `${baseUrl}/blog/${article.slug.current}`,
      image: article.coverImage ? urlFor(article.coverImage).width(1200).height(630).url() : undefined,
      datePublished: article.publishedAt,
      author: { "@type": "Person", name: "Tatiana Florentseva" },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPageClient articles={articles} categories={categories} locale={locale} />
    </>
  );
}
