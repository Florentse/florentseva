"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";
import { OPEN_CONSENT_SETTINGS_EVENT } from "@/lib/cookieConsent";
import styles from "./Footer.module.css";

type FooterNavItem = {
  label: Record<string, string>;
  url: string;
};

type FooterClientProps = {
  locale: string;
  logoText?: string;
  footerNavItems: FooterNavItem[];
};

// Swaps the current path's locale segment, preserving the rest of the path —
// e.g. /services/web-design (en) <-> /ru/services/web-design.
function getOtherLocaleHref(pathname: string, currentLocale: string): string {
  const otherLocale = currentLocale === "ru" ? "en" : "ru";
  const isRuPrefixed = pathname === "/ru" || pathname.startsWith("/ru/");
  const withoutPrefix = isRuPrefixed ? pathname.slice(3) || "/" : pathname;

  if (otherLocale === routing.defaultLocale) {
    return withoutPrefix;
  }
  return withoutPrefix === "/" ? `/${otherLocale}` : `/${otherLocale}${withoutPrefix}`;
}

export default function FooterClient({ locale, logoText, footerNavItems }: FooterClientProps) {
  const pathname = usePathname();
  const footerRef = useRef<HTMLElement>(null);
  const otherLocale = locale === "ru" ? "en" : "ru";

  // next-intl can't tell "explicitly requesting the default locale" apart
  // from "no locale specified" on a bare (prefix-less) URL — with the
  // NEXT_LOCALE cookie already set to the other locale, it resolves that
  // ambiguity by trusting the cookie and keeps serving the old locale.
  // Setting the cookie here first, before navigating, removes the ambiguity.
  function handleLocaleSwitch(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    document.cookie = `NEXT_LOCALE=${otherLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.href = getOtherLocaleHref(pathname, locale);
  }

  useEffect(() => {
    const lastSection = document.querySelector("main")?.lastElementChild;
    const isAlt = lastSection?.getAttribute("data-theme") === "alt";

    if (isAlt) {
      footerRef.current?.setAttribute("data-theme", "alt");
    } else {
      footerRef.current?.removeAttribute("data-theme");
    }
  }, [pathname]);

  function getHref(url: string) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    return url === "/" ? prefix || "/" : `${prefix}${url}`;
  }

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.footerBottom}>
        <div className={styles.brandCol}>
          <Link href={getHref("/")} className={styles.logo}>
            {logoText}
          </Link>

          <a
            href={getOtherLocaleHref(pathname, locale)}
            className={styles.langSwitch}
            onClick={handleLocaleSwitch}
          >
            {otherLocale.toUpperCase()}
          </a>

          <button
            type="button"
            className={styles.cookieSettingsButton}
            aria-label={locale === "ru" ? "Настройки cookie" : "Cookie settings"}
            onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_SETTINGS_EVENT))}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              cookie
            </span>
          </button>
        </div>

        <nav className={styles.footerNav}>
          {footerNavItems.map((item) => (
            <Link key={item.url} href={getHref(item.url)} className={styles.footerNavLink}>
              {item.label?.[locale]}
            </Link>
          ))}
        </nav>

        <p className={`text-color-secondary ${styles.copyright}`}>
          © 2020 - {new Date().getFullYear()} Florentseva Dev
        </p>
      </div>
    </footer>
  );
}
