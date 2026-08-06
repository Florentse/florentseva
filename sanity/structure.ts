import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.listItem()
        .title("Home")
        .child(S.document().schemaType("home").documentId("home")),
      S.divider(),
      S.listItem()
        .title("Works")
        .child(
          S.documentTypeList("work")
            .title("Works")
            .defaultOrdering([{ field: "sortOrder", direction: "desc" }]),
        ),
      S.documentTypeListItem("client").title("Clients"),
      S.listItem()
        .title("Services")
        .child(
          S.documentTypeList("service")
            .title("Services")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
        ),
      S.documentTypeListItem("serviceCategory").title("Service Categories"),
      S.documentTypeListItem("product").title("Products"),
      S.listItem()
        .title("Product Categories")
        .child(
          S.documentTypeList("productCategory")
            .title("Product Categories")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
        ),
      S.listItem()
        .title("Blog")
        .child(
          S.documentTypeList("article")
            .title("Blog")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Blog Categories")
        .child(
          S.documentTypeList("blogCategory")
            .title("Blog Categories")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Services Page")
        .child(
          S.document().schemaType("servicesPage").documentId("servicesPage"),
        ),
      S.listItem()
        .title("About")
        .child(S.document().schemaType("about").documentId("about")),
      S.listItem()
        .title("Contact")
        .child(S.document().schemaType("contact").documentId("contact")),
      S.listItem()
        .title("Privacy Policy")
        .child(
          S.document().schemaType("privacyPolicy").documentId("privacyPolicy"),
        ),
      S.divider(),

      S.listItem()
        .title("Contacts")
        .child(
          S.documentTypeList("contactPerson")
            .title("Contacts")
            .defaultOrdering([{ field: "firstSeenAt", direction: "desc" }]),
        ),

      S.listItem()
        .title("Requests")
        .child(
          S.documentTypeList("formRequest")
            .title("Requests")
            .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
        ),
    ]);
