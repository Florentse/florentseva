import { NextResponse, type NextRequest } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { sendPrizeWinEmail } from "@/lib/notifications/email";
import { PRIZES } from "@/lib/prizeWheel";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ClaimBody = {
  name?: string;
  email?: string;
  locale?: string;
  prizeIndex?: number;
  turnstileToken?: string;
  honeypot?: string;
};

export async function POST(request: NextRequest) {
  let body: ClaimBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Bots fill every field, including this one — pretend everything worked and stop.
  if ((body.honeypot ?? "").trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!body.turnstileToken) {
    return NextResponse.json({ ok: false, error: "missing_turnstile_token" }, { status: 400 });
  }

  const remoteip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const turnstileValid = await verifyTurnstileToken(body.turnstileToken, remoteip);
  if (!turnstileValid) {
    return NextResponse.json({ ok: false, error: "turnstile_failed" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const name = (body.name ?? "").trim();
  const locale = body.locale === "ru" ? "ru" : "en";
  const prizeIndex = body.prizeIndex;

  // Trust the spin result only as far as "one of the known prizes" — the
  // copy sent to the visitor is always looked up server-side, never taken
  // from client-supplied text.
  const prizeIsValid =
    typeof prizeIndex === "number" &&
    Number.isInteger(prizeIndex) &&
    prizeIndex >= 0 &&
    prizeIndex < PRIZES.length;

  if (!EMAIL_REGEX.test(email) || !prizeIsValid) {
    return NextResponse.json({ ok: false, error: "validation_failed" }, { status: 400 });
  }

  const prizeLabel = PRIZES[prizeIndex as number][locale];

  try {
    await sendPrizeWinEmail({ to: email, name, locale, prizeLabel });
  } catch (error) {
    console.error("prize-wheel-claim: email failed", error);
    return NextResponse.json({ ok: false, error: "email_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
