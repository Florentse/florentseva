import { client } from '@/sanity/lib/client'
import WorksPageClient from '@/components/WorksPageClient'

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
}`

export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { works, services } = await client.fetch(WORKS_PAGE_QUERY)

  return <WorksPageClient works={works} services={services} locale={locale} />
}