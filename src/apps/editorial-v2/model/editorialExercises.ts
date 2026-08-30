import { isEditorialV2SectionId, type EditorialV2SectionId } from "../routing";
import {
  EDITORIAL_EXERCISE_LINKS,
  type EditorialExerciseLink,
} from "./editorialExercise";
import { EDITORIAL_EXERCISE_L01_S02_LINKS } from "./editorialExerciseL01S02";
import { EDITORIAL_EXERCISE_L01_S03_LINKS } from "./editorialExerciseL01S03";

// Decision 30 covers only these three editorial Sections. The canonical
// paragraphs still come from each Section's Markdown, not from these options.
export const EDITORIAL_EXERCISES = {
  "L01-S01": EDITORIAL_EXERCISE_LINKS,
  "L01-S02": EDITORIAL_EXERCISE_L01_S02_LINKS,
  "L01-S03": EDITORIAL_EXERCISE_L01_S03_LINKS,
} as const satisfies Readonly<Record<EditorialV2SectionId, readonly EditorialExerciseLink[]>>;

export function getEditorialExerciseLinks(sectionId: string) {
  return isEditorialV2SectionId(sectionId)
    ? EDITORIAL_EXERCISES[sectionId]
    : undefined;
}
