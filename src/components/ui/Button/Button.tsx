import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
} from "@base-ui/react/button";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import styles from "./Button.module.css";

export type ButtonSize = "small" | "medium" | "large";
export type ButtonVariant = "filled" | "outline" | "ghost";

interface ButtonSharedProps {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export type ButtonActionProps = ButtonSharedProps &
  Omit<
    ButtonPrimitiveProps,
    "className" | "focusableWhenDisabled" | "nativeButton" | "render"
  > & {
    href?: never;
  };

export type ButtonLinkProps = ButtonSharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> & {
    disabled?: never;
    href: string;
  };

export type ButtonProps = ButtonActionProps | ButtonLinkProps;

const buttonSize = {
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
} satisfies Record<ButtonSize, string>;

const buttonVariant = {
  filled: styles.variantFilled,
  outline: styles.variantOutline,
  ghost: styles.variantGhost,
} satisfies Record<ButtonVariant, string>;

function buttonClassName(
  size: ButtonSize,
  variant: ButtonVariant,
  className?: string,
) {
  return cn(
    styles.root,
    buttonSize[size],
    buttonVariant[variant],
    className,
  );
}

export function Button(props: ButtonProps) {
  if (typeof props.href === "string") {
    const {
      className,
      href,
      size = "medium",
      variant = "filled",
      ...linkProps
    } = props;

    return (
      <a
        className={buttonClassName(size, variant, className)}
        href={href}
        {...linkProps}
      />
    );
  }

  const {
    className,
    size = "medium",
    type = "button",
    variant = "filled",
    ...buttonProps
  } = props;

  return (
    <ButtonPrimitive
      className={buttonClassName(size, variant, className)}
      type={type}
      {...buttonProps}
    />
  );
}
