import type { ParsedSection } from "../../../content/sectionContract";
import {
  EDITORIAL_V2_SECTION_IDS,
  type EditorialV2SectionId,
} from "../routing";
import {
  getEditorialV2Visual,
  type EditorialV2ArtworkAsset,
} from "./editorialV2Visuals";

export const EDITORIAL_V2_LEVEL = {
  number: 1,
  title: "Первый месяц",
  tagline:
    "Переезд, первые платежи и путь от разрозненных сроков к цельной картине месяца.",
} as const;

const sectionPresentation = {
  "L01-S01": {
    summary:
      "Комната, первая зарплата и ресурсы с разной датой доступности.",
  },
  "L01-S02": {
    summary:
      "Пробная подписка и сообщение от «поддержки», которое требует срочного действия.",
  },
  "L01-S03": {
    summary:
      "Чеки, даты и будущие условия, собранные в редактируемый черновик.",
  },
} as const satisfies Record<
  EditorialV2SectionId,
  { summary: string }
>;

export interface EditorialV2SectionEntry {
  id: EditorialV2SectionId;
  section: ParsedSection;
  summary: string;
  artwork: EditorialV2ArtworkAsset;
}

export function buildEditorialV2Program(
  sectionsById: ReadonlyMap<string, ParsedSection>,
): readonly EditorialV2SectionEntry[] {
  return EDITORIAL_V2_SECTION_IDS.map((id) => {
    const section = sectionsById.get(id);

    if (!section) {
      throw new Error(`Editorial v2 не нашла каноническую Section ${id}.`);
    }

    return {
      id,
      section,
      ...sectionPresentation[id],
      artwork: getEditorialV2Visual(id),
    };
  });
}
