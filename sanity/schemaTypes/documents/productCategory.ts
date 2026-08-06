import { defineType, defineField } from "sanity";

export const productCategory = defineType({
  name: "productCategory",
  title: "Product Category",
  type: "document",
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      description: "Controls the order of categories in filters and listings (ascending)",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "sortOrder" },
  },
});