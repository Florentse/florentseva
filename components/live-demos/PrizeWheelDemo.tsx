"use client";

import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type SubmitEvent,
} from "react";
import Link from "next/link";
import TurnstileWidget from "@/components/TurnstileWidget";
import { PRIZES } from "@/lib/prizeWheel";
import styles from "./PrizeWheelDemo.module.css";

const SEGMENT_ANGLE = 360 / PRIZES.length;
const SPIN_TURNS = 8;
const SPIN_DURATION_MS = 5200;
// easeOutExpo-ish: near-instant burst of speed, then a long, suspenseful
// deceleration into the winning segment instead of a flat, even slowdown.
const SPIN_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

// One spin per visitor — tracked in localStorage since this demo doesn't
// keep any server-side record of who has already played.
const STORAGE_KEY = "prizeWheelSpun";

const honeypotStyle: CSSProperties = {
  position: "absolute",
  left: "-9999px",
  top: 0,
  width: "1px",
  height: "1px",
  overflow: "hidden",
};

// Pointer sits at the wheel's 3-o'clock edge (angle 0 in this coordinate
// system), so the winning segment's center must land on angle 0 after spin.
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

// Reads the wheel's current on-screen angle out of its computed transform
// matrix, so a JS-driven spin can pick up exactly where the idle CSS
// animation left off, with no visual jump.
function getCurrentRotationDeg(el: HTMLElement): number {
  const transform = window.getComputedStyle(el).transform;
  if (!transform || transform === "none") return 0;
  const match = transform.match(/^matrix\(([^)]+)\)$/);
  if (!match) return 0;
  const [a, b] = match[1].split(",").map(Number);
  const angleDeg = (Math.atan2(b, a) * 180) / Math.PI;
  return (angleDeg + 360) % 360;
}

// localStorage is an external store from React's point of view — reading it
// via useSyncExternalStore (rather than useState+useEffect) keeps the first
// client render consistent with SSR (getServerSnapshot) and avoids a
// cascading setState-in-effect.
function subscribeToSpunFlag(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSpunFlagSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

function getSpunFlagServerSnapshot() {
  return false;
}

type Lead = { name: string; email: string; locale: string };
type ClaimStatus = "idle" | "sending" | "sent" | "error";

type PrizeWheelDemoProps = {
  locale: string;
  heading?: Record<string, string>;
  description?: Record<string, string>;
};

export default function PrizeWheelDemo({ locale, heading, description }: PrizeWheelDemoProps) {
  const formId = useId();
  const wheelRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [wonIndex, setWonIndex] = useState<number | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [lead, setLead] = useState<Lead | null>(null);
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>("idle");
  const alreadySpun = useSyncExternalStore(
    subscribeToSpunFlag,
    getSpunFlagSnapshot,
    getSpunFlagServerSnapshot,
  );

  function spin() {
    const wheel = wheelRef.current;
    if (!wheel || spinning) return;

    const currentAngle = getCurrentRotationDeg(wheel);
    const winningIndex = Math.floor(Math.random() * PRIZES.length);
    const segmentCenter = winningIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const targetMod = (360 - segmentCenter + 360) % 360;
    const currentMod = ((currentAngle % 360) + 360) % 360;
    const delta = (targetMod - currentMod + 360) % 360;
    const finalAngle = currentAngle + SPIN_TURNS * 360 + delta;

    setResult(null);
    setSpinning(true);

    // Hand off from the idle CSS animation: freeze at its current angle with
    // transitions off first, otherwise disabling the animation snaps the
    // wheel back to 0deg before the new transform is applied.
    wheel.style.animation = "none";
    wheel.style.transition = "none";
    wheel.style.transform = `rotate(${currentAngle}deg)`;
    void wheel.offsetHeight; // force reflow so the freeze paints before animating

    wheel.style.transition = `transform ${SPIN_DURATION_MS}ms ${SPIN_EASING}`;
    requestAnimationFrame(() => {
      wheel.style.transform = `rotate(${finalAngle}deg)`;
    });

    window.setTimeout(() => {
      setSpinning(false);
      setResult(PRIZES[winningIndex][locale === "ru" ? "ru" : "en"]);
      setWonIndex(winningIndex);

      // Give control back to the idle animation, resuming from the resting
      // angle so it keeps spinning without jumping.
      const restingAngle = ((finalAngle % 360) + 360) % 360;
      wheel.style.transition = "none";
      wheel.style.transform = "";
      wheel.style.setProperty("--start-rotation", `${restingAngle}deg`);
      void wheel.offsetHeight;
      wheel.style.animation = "";
      wheel.style.transition = "";
    }, SPIN_DURATION_MS);
  }

  async function claim(currentLead: Lead, prizeIndex: number) {
    setClaimStatus("sending");
    try {
      const response = await fetch("/api/prize-wheel-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: currentLead.name,
          email: currentLead.email,
          locale: currentLead.locale,
          prizeIndex,
          turnstileToken,
        }),
      });
      if (!response.ok) throw new Error("claim_failed");
      setClaimStatus("sent");
    } catch {
      setClaimStatus("error");
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (spinning) return;

    if (result !== null && wonIndex !== null && lead) {
      if (claimStatus === "sending" || claimStatus === "sent") return;
      void claim(lead, wonIndex);
      return;
    }

    if (!accepted || !turnstileToken || alreadySpun) return;

    const formData = new FormData(event.currentTarget);
    setLead({
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      locale: formData.get("locale") === "ru" ? "ru" : "en",
    });

    window.localStorage.setItem(STORAGE_KEY, "1");
    spin();
  }

  const stage: "locked" | "spin" | "win" | "claimed" =
    claimStatus === "sent" ? "claimed" : result !== null ? "win" : alreadySpun ? "locked" : "spin";

  const cardTitle =
    stage === "win"
      ? locale === "ru"
        ? "Поздравляем!"
        : "Congratulations!"
      : stage === "claimed"
        ? locale === "ru"
          ? "Приз отправлен!"
          : "Prize sent!"
        : (heading?.[locale] ??
          (locale === "ru"
            ? "Промо-попап для интернет-магазина"
            : "E-commerce Promotion Popup"));

  const cardDescription =
    stage === "win"
      ? locale === "ru"
        ? `Вы выиграли: ${result}. Заберите приз — и мы вышлем его на указанный email.`
        : `You won: ${result}. Claim it and we'll email your prize to the address you provided.`
      : stage === "claimed"
        ? locale === "ru"
          ? `Мы отправили приз на ${lead?.email}.`
          : `We've sent your prize to ${lead?.email}.`
        : stage === "locked"
          ? locale === "ru"
            ? "Похоже, вы уже крутили колесо на этом устройстве — попытка даётся один раз."
            : "Looks like you've already spun the wheel on this device — one spin per visitor."
          : (description?.[locale] ??
            (locale === "ru"
              ? "Крутите колесо, чтобы получить скидку, бесплатную доставку, подарок и многое другое."
              : "Spin the wheel to unlock discounts, free shipping, bonus gifts, and more."));

  return (
    <div className={styles.wrap}>
      <div className={styles.wheelArea}>
        <div className={styles.pointer} />
        <div className={styles.hub} />
        <div ref={wheelRef} className={styles.wheel}>
          <svg viewBox="0 0 300 300" className={styles.wheelSvg}>
            {PRIZES.map((prize, index) => {
              const startAngle = index * SEGMENT_ANGLE;
              const endAngle = startAngle + SEGMENT_ANGLE;
              const start = polarToCartesian(150, 150, 140, startAngle);
              const end = polarToCartesian(150, 150, 140, endAngle);
              const labelPoint = polarToCartesian(150, 150, 95, startAngle + SEGMENT_ANGLE / 2);
              const isDark = index % 2 === 0;

              return (
                <g key={index}>
                  <path
                    d={`M150,150 L${start.x},${start.y} A140,140 0 0,1 ${end.x},${end.y} Z`}
                    fill={isDark ? "var(--base-dark)" : "var(--base-light)"}
                    stroke="var(--base-light)"
                    strokeWidth="1"
                  />
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y}
                    fill={isDark ? "var(--base-light)" : "var(--base-dark)"}
                    fontSize="12"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${startAngle + SEGMENT_ANGLE / 2}, ${labelPoint.x}, ${labelPoint.y})`}
                  >
                    {prize[locale === "ru" ? "ru" : "en"]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className={styles.promoCard} data-theme="alt">
        <div className={styles.promoCardText}>
          <h3>{cardTitle}</h3>
          <p className="text-color-secondary">{cardDescription}</p>
        </div>

        {stage !== "locked" && stage !== "claimed" && (
          <form className={styles.promoForm} onSubmit={handleSubmit}>
            {stage === "spin" && (
              <>
                <div className={styles.promoField}>
                  <label
                    htmlFor={`${formId}-name`}
                    className="text-size-small text-color-tertiary text-transform-uppercase"
                  >
                    {locale === "ru" ? "Имя" : "Name"}
                  </label>
                  <input id={`${formId}-name`} name="name" type="text" placeholder="John Doe" />
                </div>

                <div className={styles.promoField}>
                  <label
                    htmlFor={`${formId}-email`}
                    className="text-size-small text-color-tertiary text-transform-uppercase"
                  >
                    Email
                  </label>
                  <input
                    id={`${formId}-email`}
                    name="email"
                    type="email"
                    placeholder="example@mail.com"
                    required
                  />
                </div>

                <label className={styles.promoCheckboxLabel}>
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(event) => setAccepted(event.target.checked)}
                  />
                  <span>
                    {locale === "ru" ? (
                      <>
                        Соглашаюсь с{" "}
                        <Link href={`/${locale}/privacy-policy`}>Политикой конфиденциальности</Link>
                      </>
                    ) : (
                      <>
                        Accept the <Link href={`/${locale}/privacy-policy`}>Privacy Policy</Link>
                      </>
                    )}
                  </span>
                </label>

                <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />
              </>
            )}

            <input type="hidden" name="locale" value={locale} />
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={honeypotStyle}
            />

            <button
              type="submit"
              className="button-filled"
              disabled={
                stage === "spin"
                  ? spinning || !accepted || !turnstileToken
                  : claimStatus === "sending"
              }
            >
              {stage === "spin"
                ? spinning
                  ? locale === "ru"
                    ? "Крутим..."
                    : "Spinning..."
                  : locale === "ru"
                    ? "Крутить колесо"
                    : "Spin the wheel"
                : claimStatus === "sending"
                  ? locale === "ru"
                    ? "Отправляем..."
                    : "Sending..."
                  : locale === "ru"
                    ? "Забрать приз"
                    : "Claim my prize"}
            </button>

            {claimStatus === "error" && (
              <p role="alert" className={styles.promoResult}>
                {locale === "ru"
                  ? "Не удалось отправить письмо. Попробуйте ещё раз."
                  : "Couldn't send the email. Please try again."}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
