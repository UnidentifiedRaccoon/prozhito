import { cn } from "../../../lib/cn";
import { Heading } from "../../ui/Heading/Heading";
import { Text } from "../../ui/Text/Text";
import styles from "./SectionHeader.module.css";

export type SectionHeaderLabel = "История" | "Решение";

export interface SectionHeaderProps {
  className?: string;
  label: SectionHeaderLabel;
  title: string;
}

export function SectionHeader({
  className,
  label,
  title,
}: SectionHeaderProps) {
  return (
    <header className={cn(styles.root, className)}>
      <Text className={styles.label} tone="muted" variant="caption">
        {label}
      </Text>
      <Heading as="h1" variant="page">
        {title}
      </Heading>
      <span className={styles.flourish} aria-hidden="true" />
    </header>
  );
}
