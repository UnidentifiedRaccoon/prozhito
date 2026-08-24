import { cn } from "../../../lib/cn";
import { Button } from "../../ui/Button/Button";
import styles from "./SectionFooter.module.css";

export interface SectionFooterProps {
  backHref?: string;
  backLabel?: string;
  className?: string;
  forwardHref: string;
  forwardLabel: string;
}

export function SectionFooter({
  backHref,
  backLabel = "К списку",
  className,
  forwardHref,
  forwardLabel,
}: SectionFooterProps) {
  return (
    <footer className={cn(styles.root, className)}>
      <nav
        className={cn(
          styles.navigation,
          backHref ? undefined : styles.singleAction,
        )}
        aria-label="Навигация по Section"
      >
        {backHref ? (
          <Button href={backHref} variant="ghost">
            {backLabel}
          </Button>
        ) : null}
        <Button
          className={styles.forwardAction}
          href={forwardHref}
          variant="filled"
        >
          {forwardLabel}
        </Button>
      </nav>
    </footer>
  );
}
