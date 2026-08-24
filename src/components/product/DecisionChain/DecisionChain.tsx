import type { HTMLAttributes } from "react";
import {
  ANALYSIS_LABELS,
  type AnalysisItem,
} from "../../../content/sectionContract";
import { cn } from "../../../lib/cn";
import styles from "./DecisionChain.module.css";

export type DecisionChainItem = AnalysisItem;

export interface DecisionChainProps
  extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  items: readonly DecisionChainItem[];
}

function assertDecisionChain(items: readonly DecisionChainItem[]) {
  if (items.length !== ANALYSIS_LABELS.length) {
    throw new Error(
      `DecisionChain ожидает ${ANALYSIS_LABELS.length} звеньев, получено ${items.length}.`,
    );
  }

  items.forEach((item, index) => {
    if (item.label !== ANALYSIS_LABELS[index]) {
      throw new Error(
        `DecisionChain: звено ${index + 1} должно называться «${ANALYSIS_LABELS[index]}».`,
      );
    }
  });
}

export function DecisionChain({
  "aria-label": ariaLabel = "Цепочка решения",
  className,
  items,
  ...props
}: DecisionChainProps) {
  assertDecisionChain(items);

  return (
    <ol
      aria-label={ariaLabel}
      className={cn(styles.root, className)}
      {...props}
      role="list"
    >
      {items.map((item) => (
        <li className={styles.item} key={item.label}>
          <span className={styles.marker} aria-hidden="true" />
          <h2 className={styles.label}>{item.label}</h2>
          <p className={styles.description}>{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
