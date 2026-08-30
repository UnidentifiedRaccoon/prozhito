import styles from "./EditorialPageNavigation.module.css";

export interface EditorialNavTarget {
  href: string;
  label: string;
}

export interface EditorialPageNavigationProps {
  primary: EditorialNavTarget;
  secondary?: EditorialNavTarget;
  ariaLabel?: string;
}

function Arrow({ direction }: { direction: "back" | "forward" }) {
  return (
    <svg aria-hidden="true" className={styles.arrow} viewBox="0 0 20 20">
      <path
        d={direction === "back" ? "M16 10H5m4-4.5L4.5 10 9 14.5" : "M4 10h11m-4-4.5 4.5 4.5-4.5 4.5"}
      />
    </svg>
  );
}

export function EditorialPageNavigation({
  primary,
  secondary,
  ariaLabel = "Навигация по истории",
}: EditorialPageNavigationProps) {
  return (
    <nav aria-label={ariaLabel} className={styles.navigation}>
      {secondary ? (
        <a className={styles.secondary} href={secondary.href}>
          <Arrow direction="back" />
          {secondary.label}
        </a>
      ) : (
        <span aria-hidden="true" />
      )}
      <a className={styles.primary} href={primary.href}>
        {primary.label}
        <Arrow direction="forward" />
      </a>
    </nav>
  );
}
