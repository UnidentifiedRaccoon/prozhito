export interface ProgramSectionSource {
  id: string;
  sourcePath: string;
}

export interface ProgramLevelDefinition {
  id: string;
  number: number;
  title: string;
  sections: readonly ProgramSectionSource[];
}

export const PROGRAM_LEVELS = [
  {
    id: "L01",
    number: 1,
    title: "Первый месяц",
    sections: [
      {
        id: "L01-S01",
        sourcePath: "content/sections/level-01/section-01-money-by-date.md",
      },
      {
        id: "L01-S02",
        sourcePath:
          "content/sections/level-01/section-02-pause-before-urgent.md",
      },
      {
        id: "L01-S03",
        sourcePath:
          "content/sections/level-01/section-03-draft-instead-of-memory.md",
      },
    ],
  },
  {
    id: "L02",
    number: 2,
    title: "План с запасом",
    sections: [
      {
        id: "L02-S01",
        sourcePath:
          "content/sections/level-02/section-01-whole-room-cost.md",
      },
      {
        id: "L02-S02",
        sourcePath:
          "content/sections/level-02/section-02-plan-after-breakdown.md",
      },
      {
        id: "L02-S03",
        sourcePath:
          "content/sections/level-02/section-03-not-decided-status.md",
      },
      {
        id: "L02-S04",
        sourcePath:
          "content/sections/level-02/section-04-control-with-minimum-data.md",
      },
    ],
  },
  {
    id: "L03",
    number: 3,
    title: "Выбирать по своим критериям",
    sections: [
      {
        id: "L03-S01",
        sourcePath:
          "content/sections/level-03/section-01-criteria-before-option.md",
      },
      {
        id: "L03-S02",
        sourcePath:
          "content/sections/level-03/section-02-deadline-before-promise.md",
      },
      {
        id: "L03-S03",
        sourcePath:
          "content/sections/level-03/section-03-check-answer-and-channel.md",
      },
      {
        id: "L03-S04",
        sourcePath:
          "content/sections/level-03/section-04-extend-without-forever.md",
      },
    ],
  },
  {
    id: "L04",
    number: 4,
    title: "Действовать по порядку",
    sections: [
      {
        id: "L04-S01",
        sourcePath:
          "content/sections/level-04/section-01-count-what-is-known.md",
      },
      {
        id: "L04-S02",
        sourcePath:
          "content/sections/level-04/section-02-contact-before-deadline.md",
      },
      {
        id: "L04-S03",
        sourcePath:
          "content/sections/level-04/section-03-specific-dms-terms.md",
      },
      {
        id: "L04-S04",
        sourcePath:
          "content/sections/level-04/section-04-own-share-separate-question.md",
      },
    ],
  },
  {
    id: "L05",
    number: 5,
    title: "Проверить идею до запуска",
    sections: [
      {
        id: "L05-S01",
        sourcePath:
          "content/sections/level-05/section-01-role-boundaries-first.md",
      },
      {
        id: "L05-S02",
        sourcePath:
          "content/sections/level-05/section-02-check-without-extra-conclusion.md",
      },
      {
        id: "L05-S03",
        sourcePath:
          "content/sections/level-05/section-03-platform-refusal-not-project-end.md",
      },
      {
        id: "L05-S04",
        sourcePath:
          "content/sections/level-05/section-04-small-test-launch-boundaries.md",
      },
    ],
  },
  {
    id: "L06",
    number: 6,
    title: "Не решать за другого",
    sections: [
      {
        id: "L06-S01",
        sourcePath:
          "content/sections/level-06/section-01-one-question-several-stages.md",
      },
      {
        id: "L06-S02",
        sourcePath:
          "content/sections/level-06/section-02-help-without-access.md",
      },
      {
        id: "L06-S03",
        sourcePath:
          "content/sections/level-06/section-03-own-choice-shared-method.md",
      },
    ],
  },
] as const satisfies readonly ProgramLevelDefinition[];

export const SECTION_SOURCES: readonly ProgramSectionSource[] =
  PROGRAM_LEVELS.reduce<ProgramSectionSource[]>((allSections, level) => {
    allSections.push(...level.sections);
    return allSections;
  }, []);

const EXPECTED_DISTRIBUTION = [3, 4, 4, 4, 4, 3] as const;

function validateProgramDefinition() {
  const distribution = PROGRAM_LEVELS.map(({ sections }) => sections.length);

  if (
    distribution.length !== EXPECTED_DISTRIBUTION.length ||
    distribution.some(
      (sectionCount, index) => sectionCount !== EXPECTED_DISTRIBUTION[index],
    )
  ) {
    throw new Error(
      `Нарушено распределение Section: ожидалось ${EXPECTED_DISTRIBUTION.join(
        " / ",
      )}, найдено ${distribution.join(" / ")}.`,
    );
  }

  if (SECTION_SOURCES.length !== 22) {
    throw new Error(
      `В программе должно быть 22 Section, найдено ${SECTION_SOURCES.length}.`,
    );
  }

  const ids = new Set(SECTION_SOURCES.map(({ id }) => id));
  const sourcePaths = new Set(
    SECTION_SOURCES.map(({ sourcePath }) => sourcePath),
  );

  if (ids.size !== SECTION_SOURCES.length) {
    throw new Error("В программе найдены повторяющиеся ID Section.");
  }

  if (sourcePaths.size !== SECTION_SOURCES.length) {
    throw new Error("В программе найдены повторяющиеся пути Section.");
  }
}

validateProgramDefinition();
