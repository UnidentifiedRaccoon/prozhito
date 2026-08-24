import type { ElementType, HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import styles from "./Text.module.css";

export type TextElement = "p" | "span" | "div" | "strong" | "em" | "small";
export type TextTone = "default" | "muted" | "accent";
export type TextVariant = "body" | "lead" | "label" | "caption";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextElement;
  tone?: TextTone;
  variant?: TextVariant;
}

const textTone = {
  default: styles.toneDefault,
  muted: styles.toneMuted,
  accent: styles.toneAccent,
} satisfies Record<TextTone, string>;

const textVariant = {
  body: styles.variantBody,
  lead: styles.variantLead,
  label: styles.variantLabel,
  caption: styles.variantCaption,
} satisfies Record<TextVariant, string>;

export function Text({
  as = "p",
  className,
  tone = "default",
  variant = "body",
  ...props
}: TextProps) {
  const Component: ElementType = as;

  return (
    <Component
      className={cn(
        styles.root,
        textVariant[variant],
        textTone[tone],
        className,
      )}
      {...props}
    />
  );
}
