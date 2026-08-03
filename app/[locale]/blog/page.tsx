//app/[locale]/blog/page.tsx


import { client } from "@/sanity/lib/client";
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
}`

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { articles, categories } = await client.fetch(BLOG_PAGE_QUERY)

  return <BlogPageClient articles={articles} categories={categories} locale={locale} />
}