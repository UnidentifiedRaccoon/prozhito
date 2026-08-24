import type { HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import styles from "./Heading.module.css";

export type HeadingElement = "h1" | "h2";
export type HeadingVariant = "display" | "page" | "section";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as: HeadingElement;
  variant: HeadingVariant;
}

const headingVariant = {
  display: styles.variantDisplay,
  page: styles.variantPage,
  section: styles.variantSection,
} satisfies Record<HeadingVariant, string>;

export function Heading({ as, className, variant, ...props }: HeadingProps) {
  const Component = as;

  return (
    <Component
      className={cn(styles.root, headingVariant[variant], className)}
      {...props}
    />
  );
}
