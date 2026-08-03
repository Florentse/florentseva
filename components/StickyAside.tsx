"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type StickyAsideProps = {
  className?: string;
  children: ReactNode;
  /** Id of the section whose top touching the viewport top marks max height. */
  triggerId: string;
};

export default function StickyAside({ className, children, triggerId }: StickyAsideProps) {
  const asideRef = useRef<HTMLElement>(null);
  const naturalHeightRef = useRef<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const asideEl = asideRef.current;
    const container = asideEl?.parentElement;
    const triggerEl = document.getElementById(triggerId);
    if (!asideEl || !container || !triggerEl) return;

    function measureNatural() {
      const previous = asideEl!.style.height;
      asideEl!.style.height = "";
      naturalHeightRef.current = asideEl!.getBoundingClientRect().height;
      asideEl!.style.height = previous;
    }

    function update() {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (!isDesktop) {
        setHeight(null);
        return;
      }

      if (naturalHeightRef.current === null) measureNatural();
      const natural = naturalHeightRef.current ?? 0;

      const stickyTop = parseFloat(getComputedStyle(asideEl!).top) || 0;
      const viewportHeight = window.innerHeight;
      const maxHeight = viewportHeight - stickyTop;

      // Grow from `natural` to `maxHeight` as the trigger section's top travels
      // from the bottom of the viewport (progress 0) up to the viewport's top (progress 1).
      const triggerTop = triggerEl!.getBoundingClientRect().top;
      const growProgress = Math.min(Math.max(1 - triggerTop / viewportHeight, 0), 1);

      let target = natural + (maxHeight - natural) * growProgress;

      // Once fully grown (sticky is now engaged), shrink back toward `natural`
      // as the bottom of the content column approaches, so the aside never overflows it.
      if (growProgress >= 1) {
        const containerRect = container!.getBoundingClientRect();
        const remainingInContainer = containerRect.bottom - stickyTop;
        target = Math.min(Math.max(remainingInContainer, natural), maxHeight);
      }

      setHeight(target);
    }

    let rafId: number | null = null;
    function onScrollOrResize() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        update();
      });
    }

    measureNatural();
    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [triggerId]);

  return (
    <aside
      ref={asideRef}
      className={className}
      style={height !== null ? { height: `${height}px` } : undefined}
    >
      {children}
    </aside>
  );
}
