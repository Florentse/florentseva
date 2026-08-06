import { NextResponse, type NextRequest } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { formatAnswersText, getAnswerValue, type FormAnswer } from "@/lib/formAnswers";
import { createFormRequest, findOrCreateContactPerson } from "@/lib/formSubmission";
import { sendNotificationEmail } from "@/lib/notifications/email";
import { sendTelegramNotification } from "@/lib/notifications/telegram";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormSubmitBody = {
  formId?: string;
  serviceSlug?: string;
  turnstileToken?: string;
  honeypot?: string;
  fields?: FormAnswer[];
};

export async function POST(request: NextRequest) {
  let body: FormSubmitBody;
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

  const answers = Array.isArray(body.fields) ? body.fields : [];
  const email = getAnswerValue(answers, "email").toLowerCase();

  if (!body.formId || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ ok: false, error: "validation_failed" }, { status: 400 });
  }

  let formRequestId: string;
  try {
    const contactId = await findOrCreateContactPerson({
      email,
      name: getAnswerValue(answers, "name"),
      telegram: getAnswerValue(answers, "telegram"),
      company: getAnswerValue(answers, "company"),
    });

    const formRequest = await createFormRequest({
      contactId,
      serviceSlug: body.serviceSlug,
      formId: body.formId,
      answers,
    });
    formRequestId = formRequest._id;
  } catch (error) {
    console.error("form-submit: failed to save to Sanity", error);
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }

  const notificationText = formatAnswersText(answers);
  const results = await Promise.allSettled([
    sendNotificationEmail({ formId: body.formId, text: notificationText }),
    sendTelegramNotification({ formId: body.formId, text: notificationText }),
  ]);

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      const channel = index === 0 ? "email" : "telegram";
      console.error(`form-submit: ${channel} notification failed`, result.reason);
    }
  });

  return NextResponse.json({ ok: true, formRequestId });
}
