//app/[locale]/services/page.tsx

import { client } from "@/sanity/lib/client";
import ServicesPageClient from "@/components/ServicesPageClient";

const SERVICES_PAGE_QUERY = `{
  "page": *[_type == "servicesPage"][0]{ intro },
  "categories": *[_type == "serviceCategory"] | order(sortOrder asc) {
    _id,
    title,
    services[]->{ title, slug, shortDescription, pricing }
  }
}`;

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { page, categories } = await client.fetch(SERVICES_PAGE_QUERY)

  return (
    <ServicesPageClient
      intro={page?.intro}
      categories={categories}
      locale={locale}
    />
  )
}