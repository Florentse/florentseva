import { type SchemaTypeDefinition } from 'sanity'

import { localeString } from './objects/localeString'
import { localeText } from './objects/localeText'
import { localePortableText } from './objects/localePortableText'
import { headingParagraphItem } from './objects/headingParagraphItem'
import { formField } from './objects/formField'
import { checklistBlock } from './objects/checklistBlock'
import { productLinkBlock } from './objects/productLinkBlock'
import { liveDemoBlock } from './objects/liveDemoBlock'
import { pageAnatomyBlock } from './objects/pageAnatomyBlock'
import { sitemapBuilderBlock } from './objects/sitemapBuilderBlock'
import { scopeBuilderBlock } from './objects/scopeBuilderBlock'
import { storeQuizBlock } from './objects/storeQuizBlock'
import { serviceCategory } from './documents/serviceCategory'
import { service } from './documents/service'
import { client } from './documents/client'
import { work } from './documents/work'
import { blogCategory } from './documents/blogCategory'
import { articleSection,  connectionsGridBlock } from './objects/articleSection'
import { article } from './documents/article'
import { productCategory } from './documents/productCategory'
import { product } from './documents/product' 
import { home } from './documents/home' 
import { servicesPage } from './documents/servicesPage'
import { about} from './documents/about' 

import { privacyPolicy } from './documents/privacyPolicy'
import { cookiesPolicy } from './documents/cookiesPolicy'
import { siteSettings } from './documents/siteSettings'


import { faqItem } from './objects/faqItem'
import { contact } from './documents/contact'
import { seo } from './objects/seo'
import { contactPerson } from './documents/contactPerson'
import { formRequest } from './documents/formRequest'



export const schema: { types: SchemaTypeDefinition[] } = {
  types: [localeString, localeText, localePortableText, seo, headingParagraphItem, formField, faqItem, checklistBlock, productLinkBlock, liveDemoBlock, pageAnatomyBlock, sitemapBuilderBlock, scopeBuilderBlock, service, serviceCategory, work, client, blogCategory, articleSection,  connectionsGridBlock, article, productCategory, product, home, servicesPage, about, contact, privacyPolicy, cookiesPolicy, siteSettings, contactPerson, formRequest, storeQuizBlock ],
}