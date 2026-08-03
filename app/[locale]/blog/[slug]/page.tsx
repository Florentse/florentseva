import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import ArticlePageClient from "@/components/ArticlePageClient";

const ARTICLE_PAGE_QUERY = `*[_type == "article" && slug.current == $slug][0]{
  title,
  metaDescription,
  publishedAt,
  coverImage,
  category->{ title, slug },
  sections[]{
    heading,
    content
  }
}`;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await client.fetch(ARTICLE_PAGE_QUERY, { slug });

  if (!article) {
    notFound();
  }

  return <ArticlePageClient article={article} locale={locale} />;
}