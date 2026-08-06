import { NextResponse, type NextRequest } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";

export const runtime = "nodejs";

const TRACKED_TYPES = ["article", "service"] as const;
type TrackedType = (typeof TRACKED_TYPES)[number];

type ViewBody = {
  type?: string;
  slug?: string;
};

function isTrackedType(value: string): value is TrackedType {
  return (TRACKED_TYPES as readonly string[]).includes(value);
}

export async function POST(request: NextRequest) {
  let body: ViewBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const type = body.type ?? "";
  const slug = (body.slug ?? "").trim();

  if (!slug || !isTrackedType(type)) {
    return NextResponse.json({ ok: false, error: "invalid_params" }, { status: 400 });
  }

  try {
    const doc = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == $type && slug.current == $slug][0]{ _id }`,
      { type, slug },
    );

    if (!doc) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    await writeClient.patch(doc._id).setIfMissing({ viewCount: 0 }).inc({ viewCount: 1 }).commit();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("page-view: failed to record view", error);
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }
}
