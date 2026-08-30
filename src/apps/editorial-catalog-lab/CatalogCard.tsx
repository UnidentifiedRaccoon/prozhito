import type { CSSProperties } from "react";
import type { EditorialV2SectionEntry } from "../editorial-v2/model/editorialV2Program";
import { editorialV2StoryHref } from "../editorial-v2/routing";
import type { CatalogVariantId } from "./model";
import styles from "./CatalogCard.module.css";

export interface CatalogCardProps {
  entry: EditorialV2SectionEntry;
  index: number;
  variant: CatalogVariantId;
}

function Arrow() {
  return (
    <svg aria-hidden="true" className={styles.arrow} viewBox="0 0 20 20">
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" />
    </svg>
  );
}

export function CatalogCard({ entry, index, variant }: CatalogCardProps) {
  const number = (
    <span aria-hidden="true" className={styles.number}>
      {String(index + 1).padStart(2, "0")}
    </span>
  );
  // Compact crops belong to this experiment, not production visual metadata.
  const focal = entry.id === "L01-S03" && variant !== "original"
    ? { x: 42, y: 48 }
    : entry.artwork.focal.mobile;
  const overlapY = entry.id === "L01-S01" ? 5 : entry.id === "L01-S02" ? 8 : 10;
  const imageStyle = {
    "--catalog-image-x": `${focal.x}%`,
    "--catalog-image-y": `${focal.y}%`,
    "--catalog-overlap-y": `${overlapY}%`,
  } as CSSProperties;

  return (
    <a
      className={styles.card}
      data-catalog-card={variant}
      href={editorialV2StoryHref(entry.id)}
      style={imageStyle}
    >
      <div className={styles.copy}>
        {variant !== "overlap" && number}
        <h3 className={styles.title}>{entry.section.title}</h3>
        <p className={styles.summary}>{entry.summary}</p>
        <span className={styles.action}>
          Открыть историю
          <Arrow />
        </span>
      </div>
      <figure className={styles.artwork}>
        <img
          alt=""
          decoding="async"
          draggable="false"
          height={entry.artwork.height}
          loading="lazy"
          src={entry.artwork.src}
          width={entry.artwork.width}
        />
        {variant === "overlap" && number}
      </figure>
    </a>
  );
}
