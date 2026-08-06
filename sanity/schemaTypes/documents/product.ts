import { defineType, defineField } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "main", title: "Main" },
    { name: "card", title: "Card" },
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "desc" }],
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
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "productCategory" }],
    }),

    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      group: "card",
      options: { hotspot: true },
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
      group: "card",
    }),

    defineField({
      name: "url",
      title: "Product URL",
      type: "url",
    }),

    defineField({
      name: "price",
      title: "Price ($)",
      description: "Starting price in USD — used for Google's Product/Offer rich results.",
      type: "number",
      group: "card",
    }),

    defineField({
      name: "searchKeywords",
      title: "Search Keywords",
      description:
        "Extra words that should surface this product in site search, without changing the visible title/description (e.g. \"website\", \"webflow\", \"template\").",
      type: "array",
      of: [{ type: "localeString" }],
      group: "main",
    }),

    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Higher numbers appear first",
      group: "card",
    }),
  ],

  preview: {
    select: {
      title: "title.en",
      media: "coverImage",
      sortOrder: "sortOrder",
    },
  },
});
