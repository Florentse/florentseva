"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import ContactFormField, { type FormField } from "./ContactFormField";
import TurnstileWidget from "./TurnstileWidget";

type ServiceContactFormProps = {
  locale: string;
  formId: string;
  serviceSlug?: string;
  fields: FormField[];
  formClassName?: string;
  fieldClassName?: string;
  fieldFullClassName?: string;
  formFooterClassName?: string;
  checkboxLabelClassName?: string;
  privacyLabel?: Record<string, string>;
  submitLabel?: Record<string, string>;
};

type Status = "idle" | "loading" | "success" | "error";

type SubmittedValues = Record<string, string | boolean>;

// Only these fields carry over when the user starts a new request — the rest
// (budget, project type, etc.) are specific to the request they just sent.
const PREFILL_FIELD_IDS = ["name", "email", "telegram", "company"];

const honeypotStyle: CSSProperties = {
  position: "absolute",
  left: "-9999px",
  top: 0,
  width: "1px",
  height: "1px",
  overflow: "hidden",
};

export default function ServiceContactForm({
  locale,
  formId,
  serviceSlug,
  fields,
  formClassName,
  fieldClassName,
  fieldFullClassName,
  formFooterClassName,
  checkboxLabelClassName,
  privacyLabel,
  submitLabel,
}: ServiceContactFormProps) {
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [formKey, setFormKey] = useState(0);
  const [submittedValues, setSubmittedValues] = useState<SubmittedValues | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!turnstileToken || status === "loading") return;

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const answers = fields.map((field) => {
      const value =
        field.fieldType === "checkbox"
          ? formData.get(field.fieldId) === "on"
          : String(formData.get(field.fieldId) ?? "");
      return {
        fieldId: field.fieldId,
        label: field.label?.[locale] ?? field.fieldId,
        value,
      };
    });

    setStatus("loading");

    try {
      const response = await fetch("/api/form-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId,
          serviceSlug,
          turnstileToken,
          honeypot: String(formData.get("website") ?? ""),
          fields: answers,
        }),
      });

      if (!response.ok) throw new Error("submit_failed");

      setSubmittedValues(
        Object.fromEntries(answers.map((answer) => [answer.fieldId, answer.value])),
      );
      setStatus("success");
      setTurnstileToken("");
    } catch {
      setStatus("error");
    }
  }

  function handleSendAgain() {
    setStatus("idle");
    setFormKey((key) => key + 1);
  }

  if (status === "success" && submittedValues) {
    return (
      <SuccessMessage
        locale={locale}
        values={submittedValues}
        onSendAgain={handleSendAgain}
      />
    );
  }

  return (
    <form className={formClassName} onSubmit={handleSubmit} key={formKey}>
      {fields.map((field) => (
        <ContactFormField
          key={field.fieldId}
          field={field}
          locale={locale}
          fieldClassName={fieldClassName}
          fieldFullClassName={fieldFullClassName}
          defaultValue={getPrefillValue(submittedValues, field.fieldId)}
        />
      ))}

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={honeypotStyle}
      />

      <div className={fieldFullClassName}>
        <TurnstileWidget
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
        />
      </div>

      <div className={formFooterClassName}>
        <label className={checkboxLabelClassName}>
          <input type="checkbox" name="privacyAccepted" required />
          <span>
            {privacyLabel?.[locale] ? (
              privacyLabel[locale]
            ) : locale === "ru" ? (
              <>
                Соглашаюсь с{" "}
                <Link href={`/${locale}/privacy-policy`}>
                  Политикой конфиденциальности
                </Link>
              </>
            ) : (
              <>
                Accept the{" "}
                <Link href={`/${locale}/privacy-policy`}>Privacy Policy</Link>
              </>
            )}
          </span>
        </label>

        <button
          type="submit"
          className="button-filled"
          disabled={!turnstileToken || status === "loading"}
        >
          {status === "loading"
            ? locale === "ru"
              ? "Отправка..."
              : "Sending..."
            : (submitLabel?.[locale] ?? (locale === "ru" ? "Отправить запрос" : "Request a quote"))}
        </button>
      </div>

      {status === "error" && (
        <p className={fieldFullClassName} role="alert">
          {locale === "ru"
            ? "Что-то пошло не так. Попробуйте ещё раз."
            : "Something went wrong. Please try again."}
        </p>
      )}
    </form>
  );
}

function getPrefillValue(
  submittedValues: SubmittedValues | null,
  fieldId: string,
): string | undefined {
  if (!submittedValues || !PREFILL_FIELD_IDS.includes(fieldId)) return undefined;
  const value = submittedValues[fieldId];
  return typeof value === "string" ? value : undefined;
}

function SuccessMessage({
  locale,
  values,
  onSendAgain,
}: {
  locale: string;
  values: SubmittedValues;
  onSendAgain: () => void;
}) {
  const name = typeof values.name === "string" ? values.name : "";
  const email = typeof values.email === "string" ? values.email : "";
  const telegram = typeof values.telegram === "string" ? values.telegram : "";

  return (
    <div className="flex-col gap-regular">
      <div className="flex-col gap-small">
        <h3>
          {locale === "ru" ? (
            <>
              Спасибо, <span className="font-weight-medium">{name}</span>!
              Ваша заявка получена.
            </>
          ) : (
            <>
              Thank you, <span className="font-weight-medium">{name}</span>!
              Your request has been received.
            </>
          )}
        </h3>

        <p>
          {locale === "ru" ? (
            <>
              Мы свяжемся с вами по адресу{" "}
              <span className="font-weight-medium">{email}</span>
              {telegram && (
                <>
                  {" "}
                  или в Telegram:{" "}
                  <span className="font-weight-medium">{telegram}</span>
                </>
              )}{" "}
              в течение одного рабочего дня.
            </>
          ) : (
            <>
              We&apos;ll get back to you at{" "}
              <span className="font-weight-medium">{email}</span>
              {telegram && (
                <>
                  {" "}
                  or in Telegram at{" "}
                  <span className="font-weight-medium">{telegram}</span>
                </>
              )}{" "}
              within one business day.
            </>
          )}
        </p>

        <p className="text-color-secondary">
          {locale === "ru"
            ? "Часы работы: пн–пт, 10:00–20:00 (GMT+7)."
            : "Working hours: Mon-Fri, 10:00-20:00 (GMT+7)."}
        </p>
      </div>

      <div className="flex-col gap-small">
        <p className="text-color-secondary">
          {locale === "ru"
            ? "Хотите отправить ещё одну заявку?"
            : "Want to send another request?"}
        </p>
        <button type="button" className="button-filled" onClick={onSendAgain}>
          {locale === "ru" ? "Отправить ещё раз" : "Send again"}
        </button>
      </div>
    </div>
  );
}
