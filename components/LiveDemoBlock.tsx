import PrizeWheelDemo from "./live-demos/PrizeWheelDemo";
import styles from "./LiveDemoBlock.module.css";

export type LiveDemoBlockData = {
  _key?: string;
  heading?: Record<string, string>;
  description?: Record<string, string>;
  demoComponent?: string;
};

type LiveDemoBlockProps = {
  block: LiveDemoBlockData;
  locale: string;
  id?: string;
  className?: string;
};

// demoComponent is a fixed enum in the liveDemoBlock schema — add a case here
// as each demo (mortgageCalculator, multiStepQuiz, ...) gets built.
export default function LiveDemoBlock({ block, locale, id, className }: LiveDemoBlockProps) {
  return (
    <div id={id} className={className}>
      <h2>{locale === "ru" ? "Попробуйте сами" : "Try it yourself"}</h2>

      <div className={styles.demoWrap}>
        {block.demoComponent === "prizeWheel" && (
          <PrizeWheelDemo
            locale={locale}
            heading={block.heading}
            description={block.description}
          />
        )}
      </div>
    </div>
  );
}
