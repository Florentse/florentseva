import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.listItem()
        .title('Home')
        .child(S.document().schemaType('home').documentId('home')),
      S.divider(),
      S.documentTypeListItem('work').title('Works'),
      S.documentTypeListItem('client').title('Clients'),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('serviceCategory').title('Service Categories'),
      S.documentTypeListItem('product').title('Products'),
      S.documentTypeListItem('article').title('Blog'),
      S.divider(),
      S.listItem()
        .title('About')
        .child(S.document().schemaType('about').documentId('about')),
      S.listItem()
        .title('Contact')
        .child(S.document().schemaType('contact').documentId('contact')),
      S.listItem()
        .title('Privacy Policy')
        .child(S.document().schemaType('privacyPolicy').documentId('privacyPolicy')),
    ])