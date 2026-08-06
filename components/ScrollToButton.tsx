"use client";

import type { ReactNode } from "react";
import { scrollToSection } from "@/lib/scrollToSection";

type ScrollToButtonProps = {
  targetId: string;
  className?: string;
  children: ReactNode;
};

export default function ScrollToButton({ targetId, className, children }: ScrollToButtonProps) {
  return (
    <button type="button" className={className} onClick={() => scrollToSection(targetId)}>
      {children}
    </button>
  );
}
