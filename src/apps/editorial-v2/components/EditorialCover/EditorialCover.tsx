import type { CSSProperties } from "react";
import type { EditorialV2ArtworkAsset } from "../../model/editorialV2Visuals";
import { editorialV2CatalogHref } from "../../routing";
import styles from "./EditorialCover.module.css";

export interface EditorialCoverProps {
  title: string;
  artwork: EditorialV2ArtworkAsset;
  view: "story" | "analysis";
  label: "История" | "Упражнение" | "Разбор";
}

export function EditorialCover({ title, artwork, view, label }: EditorialCoverProps) {
  const focal = artwork.coverFocal ?? artwork.focal;
  const focalStyle = {
    "--cover-x-mobile": `${focal.mobile.x}%`,
    "--cover-y-mobile": `${focal.mobile.y}%`,
    "--cover-x-desktop": `${focal.desktop.x}%`,
    "--cover-y-desktop": `${focal.desktop.y}%`,
  } as CSSProperties;

  return (
    <header className={styles.cover} data-editorial-cover={view} style={focalStyle}>
      <figure className={styles.artwork}>
        <img
          src={artwork.src}
          alt={artwork.alt}
          width={artwork.width}
          height={artwork.height}
          fetchPriority="high"
          decoding="async"
        />
      </figure>
      <nav className={styles.navigation} aria-label="Переход к маршруту">
        <a
          className={styles.back}
          href={editorialV2CatalogHref}
          aria-label="К маршруту историй"
          title="К маршруту историй"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M20 12H5m6-6-6 6 6 6" />
          </svg>
        </a>
      </nav>
      <div className={styles.title}>
        <p className={styles.label}>{label}</p>
        <h1>{title}</h1>
      </div>
    </header>
  );
}
