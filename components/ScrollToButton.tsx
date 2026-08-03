"use client";

import type { ReactNode } from "react";

type ScrollToButtonProps = {
  targetId: string;
  className?: string;
  children: ReactNode;
};

export default function ScrollToButton({ targetId, className, children }: ScrollToButtonProps) {
  function handleClick() {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
