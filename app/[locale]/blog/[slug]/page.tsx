import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { SITE_URL } from "@/lib/siteUrl";
import ArticlePageClient from "@/components/ArticlePageClient";

const ARTICLE_PAGE_QUERY = `*[_type == "article" && slug.current == $slug][0]{
  title,
  slug,
  metaDescription,
  publishedAt,
  coverImage,
  category->{ title, slug },
  sections[]{
    heading,
    content
  }
}`;

const getArticle = cache(async (slug: string) => client.fetch(ARTICLE_PAGE_QUERY, { slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  const name = article.title?.[locale] ?? article.title?.en;
  const title = `${locale === "ru" ? "Блог" : "Blog"} | ${name}`;
  const description = article.metaDescription?.[locale] ?? article.metaDescription?.en;
  const categoryName = article.category?.title?.[locale];
  const keywords = [name, categoryName, locale === "ru" ? "блог" : "blog"].filter(
    (value): value is string => Boolean(value),
  );
  const url =
    locale === "ru" ? `${SITE_URL}/ru/blog/${slug}` : `${SITE_URL}/blog/${slug}`;
  const imageUrl = article.coverImage
    ? urlFor(article.coverImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/blog/${slug}`,
        ru: `${SITE_URL}/ru/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "florentseva",
      type: "article",
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const name = article.title?.[locale] ?? article.title?.en;
  const description = article.metaDescription?.[locale] ?? article.metaDescription?.en;
  const baseUrl = locale === "ru" ? `${SITE_URL}/ru` : SITE_URL;
  const pageUrl = `${baseUrl}/blog/${slug}`;
  const imageUrl = article.coverImage
    ? urlFor(article.coverImage).width(1200).height(630).url()
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: name,
    description,
    url: pageUrl,
    image: imageUrl,
    datePublished: article.publishedAt,
    inLanguage: locale === "ru" ? "ru" : "en",
    author: { "@type": "Person", name: "Tatiana Florentseva" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticlePageClient article={article} locale={locale} />
    </>
  );
}
