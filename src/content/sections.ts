import {
  parseSectionMarkdown,
  type ParsedSection,
} from "./sectionContract";
import { PROGRAM_LEVELS, SECTION_SOURCES } from "./program";

const sectionModules = import.meta.glob<string>(
  "../../content/sections/level-*/section-[0-9][0-9]-*.md",
  { eager: true, import: "default", query: "?raw" },
);

export interface ParsedProgramLevel {
  id: string;
  number: number;
  title: string;
  sections: readonly ParsedSection[];
}

export type SectionCollection =
  | {
      ok: true;
      sections: readonly ParsedSection[];
      sectionsById: ReadonlyMap<string, ParsedSection>;
      levels: readonly ParsedProgramLevel[];
    }
  | {
      ok: false;
      error: Error;
    };

function buildSectionCollection(): SectionCollection {
  try {
    if (Object.keys(sectionModules).length !== SECTION_SOURCES.length) {
      throw new Error(
        `Manifest содержит ${SECTION_SOURCES.length} Section, а импортировано ${Object.keys(
          sectionModules,
        ).length}.`,
      );
    }

    const sections = SECTION_SOURCES.map(({ id, sourcePath }) => {
      const modulePath = `../../${sourcePath}`;
      const markdown = sectionModules[modulePath];

      if (typeof markdown !== "string") {
        throw new Error(`Не найден Markdown-файл Section: ${sourcePath}.`);
      }

      return parseSectionMarkdown(markdown, sourcePath, id);
    });
    const sectionsById = new Map(
      sections.map((section) => [section.id, section]),
    );

    if (sectionsById.size !== sections.length) {
      throw new Error("В коллекции Section найдены повторяющиеся ID.");
    }

    const levels = PROGRAM_LEVELS.map(({ id, number, title, sections }) => ({
      id,
      number,
      title,
      sections: sections.map(({ id: sectionId }) => {
        const section = sectionsById.get(sectionId);

        if (!section) {
          throw new Error(`Section ${sectionId} отсутствует в коллекции.`);
        }

        return section;
      }),
    }));

    return { ok: true, levels, sections, sectionsById };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export const sectionCollection = buildSectionCollection();
