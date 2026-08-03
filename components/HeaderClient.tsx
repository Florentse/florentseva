"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";
import styles from "./Header.module.css";

type NavItem = {
  label: Record<string, string>;
  url: string;
};

type HeaderClientProps = {
  logoText?: string;
  navItems: NavItem[];
  locale: string;
};

export default function HeaderClient({
  logoText,
  navItems,
  locale,
}: HeaderClientProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    let observer: IntersectionObserver | null = null;
    const intersecting = new Set<Element>();

    function setup() {
      observer?.disconnect();
      intersecting.clear();

      const sections = document.querySelectorAll('main [data-theme="alt"]');
      if (sections.length === 0) {
        setIsInverted(false);
        return;
      }

      const headerHeight = headerEl!.offsetHeight;
      const lineFromBottom = Math.max(window.innerHeight - headerHeight - 1, 0);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              intersecting.add(entry.target);
            } else {
              intersecting.delete(entry.target);
            }
          });
          setIsInverted(intersecting.size > 0);
        },
        {
          rootMargin: `-${headerHeight}px 0px -${lineFromBottom}px 0px`,
          threshold: 0,
        },
      );

      sections.forEach((section) => observer!.observe(section));
    }

    setup();
    window.addEventListener("resize", setup);

    return () => {
      window.removeEventListener("resize", setup);
      observer?.disconnect();
    };
  }, [pathname]);

  function getHref(url: string) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    return url === "/" ? prefix || "/" : `${prefix}${url}`;
  }

  function isActive(url: string) {
    return pathname === getHref(url);
  }

  return (
    <header ref={headerRef} data-theme={isInverted ? "alt" : undefined} className={styles.header}>
      <Link href={getHref("/")} className={styles.logo}>
        {logoText}
      </Link>

      <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ""}`}>
        {navItems.map((item) => (
          <Link
            key={item.url}
            href={getHref(item.url)}
            className={`${styles.navLink} ${isActive(item.url) ? styles.navLinkActive : ""}`}
            onClick={() => setIsOpen(false)}
          >
            {item.label?.[locale]}
          </Link>
        ))}
      </nav>

      <button
        className={styles.menuButton}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={styles.menuIcon}>menu</span>
        <span className={styles.menuIcon}>close</span>
      </button>
    </header>
  );
}