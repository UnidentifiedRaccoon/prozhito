import type { OlHTMLAttributes } from "react";
import {
  ANALYSIS_LABELS,
  type AnalysisItem,
} from "../../../../content/sectionContract";
import styles from "./EditorialDecisionChain.module.css";

export interface EditorialDecisionChainProps
  extends Omit<OlHTMLAttributes<HTMLOListElement>, "children"> {
  items: readonly AnalysisItem[];
}

function assertCanonicalChain(items: readonly AnalysisItem[]) {
  const isCanonical =
    items.length === ANALYSIS_LABELS.length &&
    items.every((item, index) => item.label === ANALYSIS_LABELS[index]);

  if (!isCanonical) {
    throw new Error(
      "EditorialDecisionChain принимает ровно девять звеньев в каноническом порядке.",
    );
  }
}

export function EditorialDecisionChain({
  items,
  className = "",
  ...props
}: EditorialDecisionChainProps) {
  assertCanonicalChain(items);

  return (
    <ol
      aria-label="Цепочка решения"
      className={`${styles.list} ${className}`.trim()}
      {...props}
    >
      {items.map((item, index) => (
        <li key={item.label}>
          <span aria-hidden="true" className={styles.number}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden="true" className={styles.marker} />
          <h2>{item.label}</h2>
          <p>{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
