export const ANALYSIS_LABELS = [
  "Ситуация",
  "Эмоция",
  "Импульс",
  "Риск",
  "Пауза",
  "Осознание",
  "Инструмент",
  "Зрелое действие",
  "Наблюдаемый результат",
] as const;

export type AnalysisLabel = (typeof ANALYSIS_LABELS)[number];

export interface AnalysisItem {
  label: AnalysisLabel;
  description: string;
}

export interface ParsedSection {
  id: string;
  number: number;
  title: string;
  storyMarkdown: string;
  analysisItems: readonly AnalysisItem[];
  sourcePath: string;
}

export class SectionContractError extends Error {
  constructor(sourcePath: string, detail: string) {
    super(`Ошибка контракта Section в ${sourcePath}: ${detail}`);
    this.name = "SectionContractError";
  }
}

function fail(sourcePath: string, detail: string): never {
  throw new SectionContractError(sourcePath, detail);
}

function onlyMatch(
  markdown: string,
  expression: RegExp,
  sourcePath: string,
  description: string,
) {
  const matches = [...markdown.matchAll(expression)];

  if (matches.length !== 1) {
    fail(
      sourcePath,
      `ожидалось одно поле «${description}», найдено ${matches.length}`,
    );
  }

  return matches[0];
}

export function parseSectionMarkdown(
  rawMarkdown: string,
  sourcePath: string,
  expectedId?: string,
): ParsedSection {
  const markdown = rawMarkdown.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const titleMatch = onlyMatch(
    markdown,
    /^# Section (\d{2})\. (.+)$/gm,
    sourcePath,
    "заголовок # Section NN. Название",
  );
  const number = Number(titleMatch[1]);
  const title = titleMatch[2].trim();

  if (!title) {
    fail(sourcePath, "название Section не может быть пустым");
  }

  const statusMatch = onlyMatch(
    markdown,
    /^\*\*Статус:\*\* `([^`]+)`\.$/gm,
    sourcePath,
    "Статус",
  );

  if (statusMatch[1] !== "ready") {
    fail(
      sourcePath,
      `демо принимает только статус ready, найдено ${statusMatch[1]}`,
    );
  }

  const screenHeadings = [
    ...markdown.matchAll(/^## (Экран[^\n]*)$/gm),
  ];
  const expectedScreenHeadings = [
    "Экран 1. История",
    "Экран 2. Решение",
  ];

  if (
    screenHeadings.length !== 2 ||
    screenHeadings.some(
      (match, index) => match[1] !== expectedScreenHeadings[index],
    )
  ) {
    const found = screenHeadings.map((match) => match[1]).join(" → ") || "нет";
    fail(
      sourcePath,
      `ожидались ровно два экрана «${expectedScreenHeadings.join(
        " → ",
      )}», найдено: ${found}`,
    );
  }

  const storyHeading = screenHeadings[0];
  const analysisHeading = screenHeadings[1];
  const passportMatch = onlyMatch(
    markdown,
    /^## Методический паспорт$/gm,
    sourcePath,
    "Методический паспорт",
  );
  const storyStart = (storyHeading.index ?? 0) + storyHeading[0].length;
  const analysisHeadingIndex = analysisHeading.index ?? 0;
  const analysisStart = analysisHeadingIndex + analysisHeading[0].length;
  const passportIndex = passportMatch.index ?? 0;

  if (!(storyStart < analysisHeadingIndex && analysisStart < passportIndex)) {
    fail(sourcePath, "разделы истории, разбора и паспорта идут не по контракту");
  }

  const storyMarkdown = markdown
    .slice(storyStart, analysisHeadingIndex)
    .trim();
  const analysisSource = markdown.slice(analysisStart, passportIndex).trim();

  if (!storyMarkdown) {
    fail(sourcePath, "экран истории пуст");
  }

  if (!analysisSource) {
    fail(sourcePath, "экран разбора пуст");
  }

  if (/^#{1,6}[ \t]+/m.test(analysisSource)) {
    fail(sourcePath, "внутри экрана разбора найден лишний заголовок");
  }

  const listMarkers = [...analysisSource.matchAll(/^(\d+)\.[ \t]+/gm)];

  if (listMarkers.length !== ANALYSIS_LABELS.length) {
    fail(
      sourcePath,
      `в разборе должно быть 9 звеньев, найдено ${listMarkers.length}`,
    );
  }

  if ((listMarkers[0].index ?? -1) !== 0) {
    fail(sourcePath, "перед первым звеном разбора найден лишний текст");
  }

  const analysisItems = listMarkers.map((marker, index): AnalysisItem => {
    const nextMarker = listMarkers[index + 1];
    const blockStart = marker.index ?? 0;
    const blockEnd = nextMarker?.index ?? analysisSource.length;
    const block = analysisSource.slice(blockStart, blockEnd).trim();
    const blockMatch = block.match(
      /^(\d+)\.[ \t]+\*\*([^*\n]+)\.\*\*[ \t]+([\s\S]+)$/,
    );
    const expectedNumber = index + 1;

    if (!blockMatch) {
      fail(
        sourcePath,
        `звено ${expectedNumber} должно иметь вид «${expectedNumber}. **Название.** Тезис»`,
      );
    }

    const foundNumber = Number(blockMatch[1]);
    const foundLabel = blockMatch[2].trim();
    const body = blockMatch[3].trim();

    if (foundNumber !== expectedNumber) {
      fail(
        sourcePath,
        `нарушена нумерация: ожидалось ${expectedNumber}, найдено ${foundNumber}`,
      );
    }

    if (foundLabel !== ANALYSIS_LABELS[index]) {
      fail(
        sourcePath,
        `звено ${expectedNumber}: ожидалось «${ANALYSIS_LABELS[index]}», найдено «${foundLabel}»`,
      );
    }

    if (!body) {
      fail(sourcePath, `звено ${expectedNumber} не содержит тезис`);
    }

    return {
      label: ANALYSIS_LABELS[index],
      description: body,
    };
  });

  const idMatch = onlyMatch(
    markdown,
    /^\| ID \| `(L\d{2}-S\d{2})` \|$/gm,
    sourcePath,
    "ID в методическом паспорте",
  );
  const id = idMatch[1];
  const numberFromId = Number(id.slice(-2));

  if (numberFromId !== number) {
    fail(
      sourcePath,
      `номер в заголовке ${number} не совпадает с паспортом ${id}`,
    );
  }

  if (expectedId && id !== expectedId) {
    fail(sourcePath, `ожидался ID ${expectedId}, найден ${id}`);
  }

  return {
    id,
    number,
    title,
    storyMarkdown,
    analysisItems,
    sourcePath,
  };
}
