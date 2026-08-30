import { EditorialChapterIndex } from "../../components/EditorialChapterIndex/EditorialChapterIndex";
import type { EditorialV2SectionEntry } from "../../model/editorialV2Program";
import { editorialV2StoryHref } from "../../routing";
import styles from "./EditorialCatalogScreen.module.css";

export interface EditorialCatalogScreenProps {
  levelNumber: number;
  levelTitle: string;
  tagline: string;
  entries: readonly EditorialV2SectionEntry[];
}

export function EditorialCatalogScreen({
  levelNumber,
  levelTitle,
  tagline,
  entries,
}: EditorialCatalogScreenProps) {
  const sections = entries.map((entry) => ({
    id: entry.id,
    number: entry.section.number,
    title: entry.section.title,
    summary: entry.summary,
    href: editorialV2StoryHref(entry.id),
    artwork: entry.artwork,
  }));

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>
          Уровень {levelNumber} · {entries.length} истории
        </p>
        <h1>{levelTitle}</h1>
        <p className={styles.tagline}>{tagline}</p>
      </header>
      <EditorialChapterIndex sections={sections} />
    </div>
  );
}
