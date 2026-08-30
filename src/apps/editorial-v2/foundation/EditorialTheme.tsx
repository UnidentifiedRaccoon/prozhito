import type { HTMLAttributes } from "react";
import styles from "./EditorialTheme.module.css";

export type EditorialThemeProps = HTMLAttributes<HTMLDivElement>;

export function EditorialTheme({
  className = "",
  ...props
}: EditorialThemeProps) {
  return (
    <div
      className={`${styles.root} ${className}`.trim()}
      data-editorial-v2=""
      {...props}
    />
  );
}
