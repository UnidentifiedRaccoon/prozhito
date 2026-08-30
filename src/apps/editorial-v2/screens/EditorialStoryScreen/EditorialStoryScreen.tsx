import { EditorialCover } from "../../components/EditorialCover/EditorialCover";
import {
  EditorialPageNavigation,
  type EditorialNavTarget,
} from "../../components/EditorialPageNavigation/EditorialPageNavigation";
import { EditorialStoryContent } from "../../components/EditorialStoryContent/EditorialStoryContent";
import type { ParsedSection } from "../../../../content/sectionContract";
import type { EditorialV2ArtworkAsset } from "../../model/editorialV2Visuals";
import styles from "./EditorialStoryScreen.module.css";

export interface EditorialStoryScreenProps {
  artwork: EditorialV2ArtworkAsset;
  navigation: {
    primary: EditorialNavTarget;
    secondary?: EditorialNavTarget;
  };
  section: ParsedSection;
}

export function EditorialStoryScreen({
  artwork,
  navigation,
  section,
}: EditorialStoryScreenProps) {
  return (
    <article className={styles.page}>
      <EditorialCover title={section.title} artwork={artwork} view="story" label="История" />
      <div className={styles.content} data-editorial-reading tabIndex={-1}>
        <EditorialStoryContent
          ariaLabel={`Текст истории «${section.title}»`}
          markdown={section.storyMarkdown}
        />
        <EditorialPageNavigation {...navigation} />
      </div>
    </article>
  );
}
