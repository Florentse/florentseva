"use client";

import { useState } from "react";
import ScrollToButton from "./ScrollToButton";
import styles from "./StoreQuizBlock.module.css";

export type QuizQuestion = {
  question?: Record<string, string>;
  options?: Record<string, string>[];
};

export type QuizTier = {
  title?: Record<string, string>;
  tagline?: Record<string, string>;
  price?: number;
  maxScore?: number;
  timeline?: Record<string, string>;
};

export type StoreQuizBlockData = {
  _key?: string;
  heading?: Record<string, string>;
  intro?: Record<string, string>;
  questions?: QuizQuestion[];
  tiers?: QuizTier[];
};

type StoreQuizBlockProps = {
  block: StoreQuizBlockData;
  locale: string;
  id?: string;
  className?: string;
};

// A question's answer "score" is just the index of the chosen option — every
// question's options are authored simplest-to-most-complex, so no separate
// per-option weight is needed. Tiers match the same way as the other builder
// blocks: first tier whose maxScore covers the total wins.
function matchTier(tiers: QuizTier[], score: number): QuizTier | undefined {
  if (tiers.length === 0) return undefined;
  return (
    tiers.find((tier) => typeof tier.maxScore === "number" && score <= tier.maxScore) ?? tiers[tiers.length - 1]
  );
}

export default function StoreQuizBlock({ block, locale, id, className }: StoreQuizBlockProps) {
  const questions = block.questions ?? [];
  const tiers = block.tiers ?? [];
  // Every question starts on its simplest (first) option, so a
  // recommendation is visible immediately, before the visitor touches anything.
  const [answers, setAnswers] = useState<number[]>(() => questions.map(() => 0));

  if (questions.length === 0) return null;

  function selectAnswer(questionIndex: number, optionIndex: number) {
    setAnswers((prev) => prev.map((value, i) => (i === questionIndex ? optionIndex : value)));
  }

  const totalScore = answers.reduce((sum, value) => sum + value, 0);
  const matchedTier = matchTier(tiers, totalScore);

  return (
    <div id={id} className={className}>
      {block.heading?.[locale] && <h2>{block.heading[locale]}</h2>}
      {block.intro?.[locale] && (
        <p className="text-color-secondary">{block.intro[locale]}</p>
      )}

      <div className={styles.layout}>
        <div className={styles.questionList}>
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className={styles.question}>
              <p className="font-weight-bold">{question.question?.[locale]}</p>
              <div className={styles.optionButtons}>
                {(question.options ?? []).map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    type="button"
                    className={[
                      styles.optionButton,
                      answers[questionIndex] === optionIndex ? styles.optionButtonActive : "",
                    ].join(" ")}
                    aria-pressed={answers[questionIndex] === optionIndex}
                    onClick={() => selectAnswer(questionIndex, optionIndex)}
                  >
                    {option[locale]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.result} data-theme="alt">
          <p className="text-size-small text-color-tertiary text-transform-uppercase">
            {locale === "ru" ? "Рекомендованная сборка" : "Recommended build"}
          </p>

          {matchedTier && (
            <>
              <div className={styles.resultBlock}>
                <p className={styles.tierTitle}>{matchedTier.title?.[locale]}</p>
                {matchedTier.tagline?.[locale] && (
                  <p className="text-color-secondary">{matchedTier.tagline[locale]}</p>
                )}
              </div>

              {matchedTier.timeline?.[locale] && (
                <div className={styles.resultBlock}>
                  <p className="text-size-small text-color-tertiary text-transform-uppercase">
                    {locale === "ru" ? "Ориентировочный срок" : "Estimated timeline"}
                  </p>
                  <p className="font-weight-bold">{matchedTier.timeline[locale]}</p>
                </div>
              )}

              {matchedTier.price !== undefined && (
                <div className={styles.resultBlock}>
                  <p className="text-size-small text-color-tertiary text-transform-uppercase">
                    {locale === "ru" ? "Подходит тариф" : "Fits the tier"}
                  </p>
                  <p className="font-weight-bold">
                    {locale === "ru" ? "от" : "from"} ${matchedTier.price}
                  </p>
                </div>
              )}
            </>
          )}

          <ScrollToButton targetId="order-form" className="button-filled">
            {locale === "ru" ? "Получить точную смету" : "Get a precise quote"}
          </ScrollToButton>
        </div>
      </div>
    </div>
  );
}
