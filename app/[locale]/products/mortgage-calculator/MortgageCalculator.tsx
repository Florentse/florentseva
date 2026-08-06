"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";
import styles from "./MortgageCalculator.module.css";

const TERM_OPTIONS = [15, 20, 30] as const;
type TermYears = (typeof TERM_OPTIONS)[number];

type MortgageCalculatorProps = {
  locale: string;
};

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

// Standard amortization formula for the fixed monthly principal & interest
// payment. Falls back to a flat split when the rate is 0% to avoid a 0/0.
function calculateMonthlyPrincipalAndInterest(
  principal: number,
  annualRatePercent: number,
  numPayments: number,
) {
  if (principal <= 0 || numPayments <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) return principal / numPayments;

  const factor = Math.pow(1 + monthlyRate, numPayments);
  return (principal * monthlyRate * factor) / (factor - 1);
}

type SliderFieldProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
};

// A number input and a range slider driving the same value — type a precise
// number, or drag for a quick feel, either one updates the other.
function SliderField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  hint,
}: SliderFieldProps) {
  const progress = Math.min(
    100,
    Math.max(0, ((value - min) / (max - min)) * 100),
  );
  const sliderStyle = { "--slider-progress": `${progress}%` } as CSSProperties;
  const labelId = `${id}-label`;
  const formatBound = (bound: number) =>
    `${prefix ?? ""}${bound.toLocaleString()}${suffix ?? ""}`;

  return (
    <div className={styles.field}>
      <div className={styles.fieldLabelWrapper}>
        <label htmlFor={id} id={labelId}>
          {label}
        </label>
      </div>

      <div className={prefix ? styles.inputWithPrefix : styles.inputWithSuffix}>
        {prefix && <span>{prefix}</span>}
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          className={styles.input}
          onChange={(event) => onChange(Number(event.target.value) || 0)}
        />
        {suffix && <span>{suffix}</span>}
      </div>

      <div className={styles.rangeWrapper}>
        <input
          type="range"
          aria-labelledby={labelId}
          className={styles.slider}
          style={sliderStyle}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <div
          className={`text-size-small text-color-tertiary ${styles.sliderRange}`}
        ></div>
      </div>
      <div className={styles.minmaxWrapper}>
        <span>{formatBound(min)}</span>
        <span>{formatBound(max)}</span>
      </div>

      {hint && (
        <p
          className={`text-size-small text-color-tertiary ${styles.fieldHint}`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

type TermButtonsProps = {
  id: string;
  label: string;
  value: TermYears;
  onChange: (value: TermYears) => void;
  locale: string;
};

function TermButtons({ id, label, value, onChange, locale }: TermButtonsProps) {
  const labelId = `${id}-label`;

  return (
    <div className={styles.field}>
      <label id={labelId}>{label}</label>
      <div
        className={styles.termButtons}
        role="group"
        aria-labelledby={labelId}
      >
        {TERM_OPTIONS.map((years) => (
          <button
            key={years}
            type="button"
            className={`${styles.termButton} ${value === years ? styles.termButtonActive : ""}`}
            aria-pressed={value === years}
            onClick={() => onChange(years)}
          >
            {years} {locale === "ru" ? "лет" : "years"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MortgageCalculator({
  locale,
}: MortgageCalculatorProps) {
  const formId = useId();
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [termYears, setTermYears] = useState<TermYears>(30);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(0);
  const [annualHomeInsurance, setAnnualHomeInsurance] = useState(0);

  const results = useMemo(() => {
    const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
    const loanAmount = Math.max(homePrice - downPaymentAmount, 0);
    const numPayments = termYears * 12;

    const monthlyPI = calculateMonthlyPrincipalAndInterest(
      loanAmount,
      interestRate,
      numPayments,
    );
    const monthlyTax = annualPropertyTax / 12;
    const monthlyInsurance = annualHomeInsurance / 12;
    const monthlyTotal = monthlyPI + monthlyTax + monthlyInsurance;

    const totalPaidPI = monthlyPI * numPayments;
    const totalInterest = Math.max(totalPaidPI - loanAmount, 0);

    return {
      downPaymentAmount,
      loanAmount,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyTotal,
      totalInterest,
      totalPaidPI,
    };
  }, [
    homePrice,
    downPaymentPercent,
    interestRate,
    termYears,
    annualPropertyTax,
    annualHomeInsurance,
  ]);

  return (
    <div className={styles.calculator}>
      <div className={styles.inputs}>
        <SliderField
          id={`${formId}-price`}
          label={locale === "ru" ? "Стоимость дома" : "Home price"}
          value={homePrice}
          onChange={setHomePrice}
          min={50000}
          max={2000000}
          step={5000}
          prefix="$"
        />

        <SliderField
          id={`${formId}-down`}
          label={locale === "ru" ? "Первоначальный взнос" : "Down payment"}
          value={downPaymentPercent}
          onChange={setDownPaymentPercent}
          min={0}
          max={100}
          step={1}
          suffix="%"
        />

        <SliderField
          id={`${formId}-rate`}
          label={locale === "ru" ? "Процентная ставка" : "Interest rate"}
          value={interestRate}
          onChange={setInterestRate}
          min={0}
          max={15}
          step={0.05}
          suffix="%"
        />

        <TermButtons
          id={`${formId}-term`}
          label={locale === "ru" ? "Срок кредита" : "Loan term"}
          value={termYears}
          onChange={setTermYears}
          locale={locale}
        />

        <SliderField
          id={`${formId}-tax`}
          label={
            locale === "ru"
              ? "Налог на имущество (в год)"
              : "Property tax (yearly)"
          }
          value={annualPropertyTax}
          onChange={setAnnualPropertyTax}
          min={0}
          max={20000}
          step={100}
          prefix="$"
        />

        <SliderField
          id={`${formId}-insurance`}
          label={
            locale === "ru"
              ? "Страховка дома (в год)"
              : "Home insurance (yearly)"
          }
          value={annualHomeInsurance}
          onChange={setAnnualHomeInsurance}
          min={0}
          max={10000}
          step={50}
          prefix="$"
        />
      </div>

      <div className={styles.results} data-theme="alt">
        <p className="text-size-small text-color-tertiary text-transform-uppercase">
          {locale === "ru" ? "Ежемесячный платёж" : "Monthly payment"}
        </p>
        <p className={styles.monthlyTotal}>
          {formatCurrency(results.monthlyTotal, locale)}
        </p>

        <div className={styles.breakdown}>
          <div className={styles.breakdownRow}>
            <span>
              {locale === "ru"
                ? "Основной долг и проценты"
                : "Principal & interest"}
            </span>
            <span>{formatCurrency(results.monthlyPI, locale)}</span>
          </div>
          <div className={styles.breakdownRow}>
            <span>
              {locale === "ru" ? "Налог на имущество" : "Property tax"}
            </span>
            <span>{formatCurrency(results.monthlyTax, locale)}</span>
          </div>
          <div className={styles.breakdownRow}>
            <span>{locale === "ru" ? "Страховка" : "Home insurance"}</span>
            <span>{formatCurrency(results.monthlyInsurance, locale)}</span>
          </div>
        </div>

        <div className={styles.summary}>
          <div className={styles.breakdownRow}>
            <span>
              {locale === "ru" ? "Первоначальный взнос" : "Down payment"}
            </span>
            <span>{formatCurrency(results.downPaymentAmount, locale)}</span>
          </div>
          <div className={styles.breakdownRow}>
            <span>{locale === "ru" ? "Сумма кредита" : "Loan amount"}</span>
            <span>{formatCurrency(results.loanAmount, locale)}</span>
          </div>
          <div className={styles.breakdownRow}>
            <span>
              {locale === "ru" ? "Всего процентов" : "Total interest"}
            </span>
            <span>{formatCurrency(results.totalInterest, locale)}</span>
          </div>
          <div className={styles.breakdownRow}>
            <span>
              {locale === "ru"
                ? "Всего выплат по кредиту"
                : "Total paid (loan)"}
            </span>
            <span>{formatCurrency(results.totalPaidPI, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
