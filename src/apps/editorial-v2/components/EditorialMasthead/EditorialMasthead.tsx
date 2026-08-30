import { editorialV2CatalogHref } from "../../routing";
import styles from "./EditorialMasthead.module.css";

export interface EditorialMastheadProps {
  catalogHref?: string;
}

export function EditorialMasthead({
  catalogHref = editorialV2CatalogHref,
}: EditorialMastheadProps) {
  return (
    <header className={styles.masthead}>
      <a className={styles.wordmark} href={catalogHref}>
        Прожито
      </a>
    </header>
  );
}
