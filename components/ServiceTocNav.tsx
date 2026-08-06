"use client";

import { useEffect, useState } from "react";
import { scrollToSection } from "@/lib/scrollToSection";
import styles from "./ServiceTocNav.module.css";

type NavItem = {
  id: string;
  label: string;
};

type ServiceTocNavProps = {
  items: NavItem[];
  className?: string;
};

export default function ServiceTocNav({ items, className }: ServiceTocNavProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items.length]);

  function handleClick(id: string) {
    scrollToSection(id);
  }

  return (
    <ul className={`${styles.list} filterList ${className ?? ""}`}>
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            className={`filterButton ${activeId === item.id ? "filterButtonActive" : ""}`}
            onClick={() => handleClick(item.id)}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
