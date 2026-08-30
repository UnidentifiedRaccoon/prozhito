import { EditorialCover } from "../../components/EditorialCover/EditorialCover";
import { EditorialDecisionChain } from "../../components/EditorialDecisionChain/EditorialDecisionChain";
import {
  EditorialExercise,
  type EditorialExerciseController,
} from "../../components/EditorialExercise/EditorialExercise";
import {
  EditorialPageNavigation,
  type EditorialNavTarget,
} from "../../components/EditorialPageNavigation/EditorialPageNavigation";
import type { ParsedSection } from "../../../../content/sectionContract";
import type { EditorialV2ArtworkAsset } from "../../model/editorialV2Visuals";
import { getEditorialExerciseLinks } from "../../model/editorialExercises";
import styles from "./EditorialSolutionScreen.module.css";

export interface EditorialSolutionScreenProps {
  artwork: EditorialV2ArtworkAsset;
  navigation: {
    primary: EditorialNavTarget;
    secondary?: EditorialNavTarget;
  };
  section: ParsedSection;
  exercise?: EditorialExerciseController;
}

export function EditorialSolutionScreen({
  artwork,
  navigation,
  section,
  exercise,
}: EditorialSolutionScreenProps) {
  const links = getEditorialExerciseLinks(section.id);

  return (
    <article
      className={styles.page}
      data-exercise={links && exercise ? true : undefined}
    >
      <EditorialCover
        title={section.title}
        artwork={artwork}
        view="analysis"
        label={links && exercise?.state.view === "exercise" ? "Упражнение" : "Разбор"}
      />
      <div
        className={styles.content}
        data-editorial-reading
        tabIndex={-1}
      >
        {links && exercise ? (
          <EditorialExercise items={section.analysisItems} links={links} {...exercise} />
        ) : (
          <EditorialDecisionChain
            className={styles.chain}
            items={section.analysisItems}
          />
        )}
        <EditorialPageNavigation {...navigation} />
      </div>
    </article>
  );
}
