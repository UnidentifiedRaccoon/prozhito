import { sectionCollection } from "../../../content/sections";
import {
  buildEditorialV2Program,
  EDITORIAL_V2_LEVEL,
} from "../model/editorialV2Program";
import type { EditorialV2SectionId } from "../routing";

if (!sectionCollection.ok) {
  throw sectionCollection.error;
}

export const editorialV2StorybookEntries = buildEditorialV2Program(
  sectionCollection.sectionsById,
);

export const editorialV2StorybookLevel = EDITORIAL_V2_LEVEL;

export function getEditorialV2StorybookEntry(id: EditorialV2SectionId) {
  const entry = editorialV2StorybookEntries.find((item) => item.id === id);

  if (!entry) {
    throw new Error(`Storybook не нашёл Editorial v2 fixture ${id}.`);
  }

  return entry;
}
