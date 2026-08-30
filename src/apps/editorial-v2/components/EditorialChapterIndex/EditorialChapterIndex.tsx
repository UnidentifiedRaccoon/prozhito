import type { CSSProperties } from "react";
import type { EditorialV2ArtworkAsset } from "../../model/editorialV2Visuals";
import { EditorialArtwork } from "../EditorialArtwork/EditorialArtwork";
import styles from "./EditorialChapterIndex.module.css";

export interface EditorialChapterIndexItem {
  id: string;
  number: number;
  title: string;
  summary: string;
  href: string;
  artwork: EditorialV2ArtworkAsset;
}

export interface EditorialChapterIndexProps {
  sections: readonly EditorialChapterIndexItem[];
}

// Accepted mobile catalog crops stay independent from Section cover metadata.
const MOBILE_CATALOG_FOCAL: Partial<Record<string, { x: number; y: number }>> = {
  "L01-S01": { x: 58, y: 5 },
  "L01-S02": { x: 50, y: 8 },
  "L01-S03": { x: 42, y: 10 },
};

function mobileCatalogStyle(section: EditorialChapterIndexItem): CSSProperties {
  const focal = MOBILE_CATALOG_FOCAL[section.id] ?? section.artwork.focal.mobile;
  return {
    "--ev2-catalog-image-x": `${focal.x}%`,
    "--ev2-catalog-image-y": `${focal.y}%`,
  } as CSSProperties;
}

function Arrow() {
  return (
    <svg aria-hidden="true" className={styles.arrow} viewBox="0 0 20 20">
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" />
    </svg>
  );
}

export function EditorialChapterIndex({
  sections,
}: EditorialChapterIndexProps) {
  return (
    <ol aria-label="Истории первого уровня" className={styles.list}>
      {sections.map((section) => (
        <li key={section.id}>
          <a href={section.href} style={mobileCatalogStyle(section)}>
            <div className={styles.copy}>
              <span aria-hidden="true" className={styles.number}>
                {String(section.number).padStart(2, "0")}
              </span>
              <h2>{section.title}</h2>
              <p className={styles.summary}>{section.summary}</p>
              <span className={styles.action}>
                Открыть историю
                <Arrow />
              </span>
            </div>
            <EditorialArtwork asset={section.artwork} variant="index" />
          </a>
        </li>
      ))}
    </ol>
  );
}
