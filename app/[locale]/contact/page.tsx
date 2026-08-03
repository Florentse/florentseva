// app/[locale]/contact/page.tsx

import { client } from "@/sanity/lib/client";
import ContactFormField, { type FormField } from "@/components/ContactFormField";
import styles from "./page.module.css";

const CONTACT_PAGE_QUERY = `*[_id == "contact"][0]{
  title,
  intro,
  contactMethods,
  formHeading,
  formDescription,
  formFields,
  privacyLabel,
  submitLabel
}`;

type ContactMethod = {
  label?: Record<string, string>;
  value?: Record<string, string>;
  description?: Record<string, string>;
  ctaLabel?: Record<string, string>;
  url?: string;
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const contact = await client.fetch(CONTACT_PAGE_QUERY);

  const contactMethods: ContactMethod[] = contact?.contactMethods ?? [];
  const formFields: FormField[] = contact?.formFields ?? [];

  return (
    <div className="page-wrapper">
      <header>{/* Header */}</header>

      <main>
        <section id="contact-hero" className={`${styles.hero} pt-large pb-small`}>
          <div className={styles.heroGrid}>
            <h1>{contact?.title?.[locale]}</h1>
            <div className="max-width-small">
              <p>{contact?.intro?.[locale]}</p>
            </div>
          </div>
        </section>

        <section id="contact-methods" className={`${styles.methodsSection} pt-small`}>
          <div className={styles.methodsGrid}>
            {contactMethods.map((method, index) => (
              <div key={index} className={`${styles.methodCard} flex-col gap-small inner-padding-regular`}>
                <span className="text-size-small text-color-tertiary text-transform-uppercase">
                  {method.label?.[locale]}
                </span>
                <p className="font-weight-bold">{method.value?.[locale]}</p>
                <p className="text-color-secondary">{method.description?.[locale]}</p>
                <a href={method.url} className="link-icon" data-icon="chevron_forward">
                  {method.ctaLabel?.[locale]}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section id="contact-form" className={`${styles.formSection} pt-small`}>
          <div className={styles.formGrid}>
            <div className="flex-col gap-small">
              <h2 className="text-size-large">{contact?.formHeading?.[locale]}</h2>
              <div className="max-width-small">
                <p>{contact?.formDescription?.[locale]}</p>
              </div>
            </div>

            <form className={styles.form}>
              {formFields.map((field) => (
                <ContactFormField
                  key={field.fieldId}
                  field={field}
                  locale={locale}
                  fieldClassName={styles.field}
                  fieldFullClassName={styles.fieldFull}
                />
              ))}

              <div className={styles.formFooter}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="privacyAccepted" required />
                  <span>{contact?.privacyLabel?.[locale]}</span>
                </label>

                <button type="submit" className="button-filled">
                  {contact?.submitLabel?.[locale]}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
