import { type SchemaTypeDefinition } from 'sanity'

import { localeString } from './objects/localeString'
import { localeText } from './objects/localeText'
import { localePortableText } from './objects/localePortableText'
import { headingParagraphItem } from './objects/headingParagraphItem'
import { faqItem } from './objects/faqItem' 
import { service } from './documents/service'
import { serviceCategory } from './documents/serviceCategory'
import { work } from './documents/work'
import { client } from './documents/client'
import { article } from './documents/article'
import { product } from './documents/product' 
import { home } from './documents/home' 
import { about} from './documents/about' 
import { contact } from './documents/contact'
import { privacyPolicy } from './documents/privacyPolicy'
import { siteSettings } from './documents/siteSettings'
import { seo } from './objects/seo'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [localeString, localeText, localePortableText, seo, headingParagraphItem, faqItem, service, serviceCategory, work, client, article, product, home, about, contact, privacyPolicy, siteSettings ],
}