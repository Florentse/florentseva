import { defineType, defineField } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  groups: [
    { name: "main", title: "Main" },
    { name: "content", title: "Content" },
    { name: "pricing", title: "Pricing" },
    { name: "products", title: "Ready-made Products" },
    { name: "cases", title: "Case Studies" },
    { name: "faq", title: "FAQ" },
    { name: "articles", title: "Articles" },
    { name: "related", title: "Related" },
    { name: "form", title: "Contact Form" },
  ],
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
      group: "main",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (Rule) => Rule.required(),
      group: "main",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      description:
        "Controls the order of services in filters and listings (ascending)",
      type: "number",
      group: "main",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      description:
        "Used in the service card, on the service page, and as SEO description",
      type: "localeText",
      group: "main",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "serviceCategory" }],
      group: "main",
    }),

    defineField({
      name: "opportunity",
      title: "The Opportunity",
      type: "array",
      of: [{ type: "headingParagraphItem" }],
      group: "content",
    }),
    defineField({
      name: "solutions",
      title: "Solutions & Capabilities",
      type: "array",
      of: [{ type: "headingParagraphItem" }],
      group: "content",
    }),
    defineField({
      name: "stages",
      title: "Stages of Work",
      description: "Ordered list",
      type: "array",
      of: [{ type: "headingParagraphItem" }],
      group: "content",
    }),
    defineField({
      name: "outcomes",
      title: "Outcomes",
      type: "localeText",
      group: "content",
    }),
    defineField({
      name: "customSections",
      title: "Custom Sections",
      description:
        'Unique content blocks specific to this service (checklists, product links, etc.) — extend the "of" array with new block types as new section kinds appear.',
      type: "array",
      of: [
        { type: "checklistBlock" },
        { type: "productLinkBlock" },
        { type: "connectionsGridBlock" },
        { type: "liveDemoBlock" },
        {type: 'pageAnatomyBlock'},
        {type: 'sitemapBuilderBlock'},
        {type: 'scopeBuilderBlock'},
      ],
      group: "content",
    }),

    defineField({
      name: "pricing",
      title: "Pricing Tiers",
      description:
        "Up to 3 tiers. The lowest price here is shown as the starting price on the card.",
      type: "array",
      of: [
        {
          type: "object",
          name: "pricingTier",
          fields: [
            defineField({ name: "title", title: "Tier Title", type: "string" }),
            defineField({ name: "price", title: "Price", type: "number" }),
            defineField({
              name: "description",
              title: "Description",
              description: 'Short subtitle, e.g. "1 page, up to 8 sections"',
              type: "localeString",
            }),
            defineField({
              name: "features",
              title: "Features",
              type: "array",
              of: [{ type: "localeString" }],
            }),
            defineField({
              name: "deliveryLabel",
              title: "Delivery Label",
              description: 'e.g. "Delivery in ~2 weeks"',
              type: "localeString",
            }),
            defineField({
              name: "highlighted",
              title: "Highlighted",
              description: "Visually emphasize this tier as the recommended option.",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "price" },
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
      group: "pricing",
    }),

    defineField({
      name: "readyMadeProducts",
      title: "Ready-made Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      group: "products",
    }),

    defineField({
      name: "caseStudies",
      title: "Case Studies",
      type: "array",
      of: [{ type: "reference", to: [{ type: "work" }] }],
      group: "cases",
    }),

    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [{ type: "faqItem" }],
      group: "faq",
    }),
    defineField({
      name: "relatedArticles",
      title: "Related Articles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "article" }] }],
      group: "articles",
    }),
    defineField({
      name: "relatedServices",
      title: "Related Services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      group: "related",
    }),
    defineField({
      name: "contactForm",
      title: "Contact Form",
      type: "object",
      group: "form",
      fields: [
        defineField({
          name: "formId",
          title: "Form ID",
          description:
            "Unique stable ID for this form — used to route submissions in automations (Zapier/Make).",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "localeString",
        }),
        defineField({
          name: "subheading",
          title: "Subheading",
          type: "localeText",
        }),
        defineField({
          name: "fields",
          title: "Fields",
          type: "array",
          of: [{ type: "formField" }],
        }),
        defineField({
          name: "privacyLabel",
          title: "Privacy Consent Label",
          type: "localeString",
        }),
        defineField({
          name: "submitLabel",
          title: "Submit Button Label",
          type: "localeString",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "slug.current",
    },
  },
});
