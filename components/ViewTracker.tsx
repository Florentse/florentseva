"use client";

import { useEffect } from "react";

type ViewTrackerProps = {
  type: "article" | "service";
  slug?: string;
};

// Fire-and-forget view count, recorded once per page load. Nothing is shown
// on the page yet — see the `viewCount` field's description in the schema.
export default function ViewTracker({ type, slug }: ViewTrackerProps) {
  useEffect(() => {
    if (!slug) return;
    fetch("/api/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug }),
    }).catch(() => {});
  }, [type, slug]);

  return null;
}
