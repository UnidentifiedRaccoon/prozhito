import l01S01Analysis from "../assets/living-archive/l01-s01/analysis-hero-1200-v1.jpg";
import l01S01Story from "../assets/living-archive/l01-s01/story-arrival-1200.jpg";
import l01S02Analysis from "../assets/living-archive/l01-s02/analysis-hero-1200-v1.jpg";
import l01S02Story from "../assets/living-archive/l01-s02/story-hero-1200-v1.jpg";
import l01S03Analysis from "../assets/living-archive/l01-s03/analysis-hero-1200-v1.jpg";
import l01S03Story from "../assets/living-archive/l01-s03/story-hero-1200-v1.jpg";
import l02S01Analysis from "../assets/living-archive/l02-s01/analysis-hero-1200-v1.jpg";
import l02S01Story from "../assets/living-archive/l02-s01/story-hero-1200-v1.jpg";
import l02S02Analysis from "../assets/living-archive/l02-s02/analysis-hero-1200-v1.jpg";
import l02S02Story from "../assets/living-archive/l02-s02/story-hero-1200-v1.jpg";
import l02S03Analysis from "../assets/living-archive/l02-s03/analysis-hero-1200-v1.jpg";
import l02S03Story from "../assets/living-archive/l02-s03/story-hero-1200-v1.jpg";
import l02S04Analysis from "../assets/living-archive/l02-s04/analysis-hero-1200-v1.jpg";
import l02S04Story from "../assets/living-archive/l02-s04/story-hero-1200-v1.jpg";
import l03S01Analysis from "../assets/living-archive/l03-s01/analysis-hero-1200-v1.jpg";
import l03S01Story from "../assets/living-archive/l03-s01/story-hero-1200-v1.jpg";
import l03S02Analysis from "../assets/living-archive/l03-s02/analysis-hero-1200-v1.jpg";
import l03S02Story from "../assets/living-archive/l03-s02/story-hero-1200-v1.jpg";
import l03S03Analysis from "../assets/living-archive/l03-s03/analysis-hero-1200-v1.jpg";
import l03S03Story from "../assets/living-archive/l03-s03/story-hero-1200-v1.jpg";
import l03S04Analysis from "../assets/living-archive/l03-s04/analysis-hero-1200-v1.jpg";
import l03S04Story from "../assets/living-archive/l03-s04/story-hero-1200-v1.jpg";
import l04S01Analysis from "../assets/living-archive/l04-s01/analysis-hero-1200-v1.jpg";
import l04S01Story from "../assets/living-archive/l04-s01/story-hero-1200-v1.jpg";
import l04S02Analysis from "../assets/living-archive/l04-s02/analysis-hero-1200-v1.jpg";
import l04S02Story from "../assets/living-archive/l04-s02/story-hero-1200-v1.jpg";
import l04S03Analysis from "../assets/living-archive/l04-s03/analysis-hero-1200-v1.jpg";
import l04S03Story from "../assets/living-archive/l04-s03/story-hero-1200-v1.jpg";
import l04S04Analysis from "../assets/living-archive/l04-s04/analysis-hero-1200-v1.jpg";
import l04S04Story from "../assets/living-archive/l04-s04/story-hero-1200-v1.jpg";
import l05S01Analysis from "../assets/living-archive/l05-s01/analysis-hero-1200-v1.jpg";
import l05S01Story from "../assets/living-archive/l05-s01/story-hero-1200-v1.jpg";
import l05S02Analysis from "../assets/living-archive/l05-s02/analysis-hero-1200-v1.jpg";
import l05S02Story from "../assets/living-archive/l05-s02/story-hero-1200-v1.jpg";
import l05S03Analysis from "../assets/living-archive/l05-s03/analysis-hero-1200-v1.jpg";
import l05S03Story from "../assets/living-archive/l05-s03/story-hero-1200-v1.jpg";
import l05S04Analysis from "../assets/living-archive/l05-s04/analysis-hero-1200-v1.jpg";
import l05S04Story from "../assets/living-archive/l05-s04/story-hero-1200-v1.jpg";
import l06S01Analysis from "../assets/living-archive/l06-s01/analysis-hero-1200-v1.jpg";
import l06S01Story from "../assets/living-archive/l06-s01/story-hero-1200-v1.jpg";
import l06S02Analysis from "../assets/living-archive/l06-s02/analysis-hero-1200-v1.jpg";
import l06S02Story from "../assets/living-archive/l06-s02/story-hero-1200-v1.jpg";
import l06S03Analysis from "../assets/living-archive/l06-s03/analysis-hero-1200-v1.jpg";
import l06S03Story from "../assets/living-archive/l06-s03/story-hero-1200-v1.jpg";

export interface SectionArtworkFocalPoint {
  x: number;
  y: number;
}

export interface SectionArtworkFocalSet {
  desktop: SectionArtworkFocalPoint;
  mobile: SectionArtworkFocalPoint;
}

export interface SectionArtworkAsset {
  alt: string;
  focal?: SectionArtworkFocalSet;
  height: number;
  src: string;
  width: number;
}

export interface SectionVisualSet {
  analysis?: SectionArtworkAsset;
  catalog?: SectionArtworkAsset;
  story?: SectionArtworkAsset;
}

const centeredUpperFocal = {
  mobile: { x: 50, y: 36 },
  desktop: { x: 50, y: 34 },
} satisfies SectionArtworkFocalSet;

const centeredStillLifeFocal = {
  mobile: { x: 50, y: 34 },
  desktop: { x: 50, y: 30 },
} satisfies SectionArtworkFocalSet;

function createVisualSet({
  analysisSrc,
  storyAlt,
  storySrc,
}: {
  analysisSrc: string;
  storyAlt: string;
  storySrc: string;
}): SectionVisualSet {
  const story = {
    src: storySrc,
    alt: storyAlt,
    width: 1200,
    height: 800,
    focal: centeredUpperFocal,
  } satisfies SectionArtworkAsset;

  return {
    story,
    catalog: {
      ...story,
      alt: "",
    },
    analysis: {
      src: analysisSrc,
      alt: "",
      width: 1200,
      height: 800,
      focal: centeredStillLifeFocal,
    },
  };
}

const l01S01StoryArtwork = {
  src: l01S01Story,
  alt: "Саша среди коробок в съёмной комнате держит телефон.",
  width: 1200,
  height: 800,
  focal: {
    mobile: { x: 50, y: 42 },
    desktop: { x: 50, y: 42 },
  },
} satisfies SectionArtworkAsset;

const sectionVisuals = {
  "L01-S01": {
    catalog: {
      ...l01S01StoryArtwork,
      alt: "",
    },
    story: l01S01StoryArtwork,
    analysis: {
      src: l01S01Analysis,
      alt: "",
      width: 1200,
      height: 800,
      focal: {
        mobile: { x: 51, y: 50 },
        desktop: { x: 51, y: 70 },
      },
    },
  },
  "L01-S02": createVisualSet({
    storySrc: l01S02Story,
    storyAlt:
      "Саша на работе останавливается перед экраном телефона, рядом сидят Миша и Лера.",
    analysisSrc: l01S02Analysis,
  }),
  "L01-S03": createVisualSet({
    storySrc: l01S03Story,
    storyAlt:
      "Саша за столом собирает разрозненные бумаги в один черновик, Ирина сидит рядом.",
    analysisSrc: l01S03Analysis,
  }),
  "L02-S01": createVisualSet({
    storySrc: l02S01Story,
    storyAlt:
      "Тамара измеряет дверной проём, пока Саша сверяет размеры для комнаты.",
    analysisSrc: l02S01Analysis,
  }),
  "L02-S02": createVisualSet({
    storySrc: l02S02Story,
    storyAlt:
      "Саша рассматривает сломанный сетевой фильтр рядом с неработающей лампой и ноутбуком.",
    analysisSrc: l02S02Analysis,
  }),
  "L02-S03": createVisualSet({
    storySrc: l02S03Story,
    storyAlt:
      "Саша и Лера раскладывают условия покупки стеллажа по нескольким листам.",
    analysisSrc: l02S03Analysis,
  }),
  "L02-S04": createVisualSet({
    storySrc: l02S04Story,
    storyAlt:
      "Миша останавливается перед передачей выписки, а Саша показывает на календарь.",
    analysisSrc: l02S04Analysis,
  }),
  "L03-S01": createVisualSet({
    storySrc: l03S01Story,
    storyAlt: "Саша за столом сравнивает несколько вариантов жилья в таблице.",
    analysisSrc: l03S01Analysis,
  }),
  "L03-S02": createVisualSet({
    storySrc: l03S02Story,
    storyAlt:
      "Лера показывает Саше телефон, а рядом на столе лежат календарь и отложенный конверт.",
    analysisSrc: l03S02Analysis,
  }),
  "L03-S03": createVisualSet({
    storySrc: l03S03Story,
    storyAlt:
      "Саша останавливается перед непривычным письмом и проверяет канал отдельно.",
    analysisSrc: l03S03Analysis,
  }),
  "L03-S04": createVisualSet({
    storySrc: l03S04Story,
    storyAlt:
      "Саша и Тамара сравнивают два варианта документа об аренде за столом.",
    analysisSrc: l03S04Analysis,
  }),
  "L04-S01": createVisualSet({
    storySrc: l04S01Story,
    storyAlt:
      "Саша перед поездкой сравнивает два варианта обмена и условия карты.",
    analysisSrc: l04S01Analysis,
  }),
  "L04-S02": createVisualSet({
    storySrc: l04S02Story,
    storyAlt:
      "Миша показывает Саше, где искать поддержку, пока она сверяет выписку с календарём.",
    analysisSrc: l04S02Analysis,
  }),
  "L04-S03": createVisualSet({
    storySrc: l04S03Story,
    storyAlt:
      "Саша закрывает поиск и открывает полис своей программы перед звонком.",
    analysisSrc: l04S03Analysis,
  }),
  "L04-S04": createVisualSet({
    storySrc: l04S04Story,
    storyAlt:
      "Саша разделяет за столом документы своей оплаты курса и оплаты компании.",
    analysisSrc: l04S04Analysis,
  }),
  "L05-S01": createVisualSet({
    storySrc: l05S01Story,
    storyAlt:
      "Лера и Саша за обедом обсуждают границы роли Саши в пробной главе проекта.",
    analysisSrc: l05S01Analysis,
  }),
  "L05-S02": createVisualSet({
    storySrc: l05S02Story,
    storyAlt:
      "Лера показывает Саше найденную реестровую запись, а Саша делает паузу перед ответом.",
    analysisSrc: l05S02Analysis,
  }),
  "L05-S03": createVisualSet({
    storySrc: l05S03Story,
    storyAlt:
      "Лера, Миша и Саша сравнивают сообщение канала с условиями площадки.",
    analysisSrc: l05S03Analysis,
  }),
  "L05-S04": createVisualSet({
    storySrc: l05S04Story,
    storyAlt:
      "Саша перестраивает порядок пробной главы после повторяющихся отзывов.",
    analysisSrc: l05S04Analysis,
  }),
  "L06-S01": createVisualSet({
    storySrc: l06S01Story,
    storyAlt:
      "Саша отделяет подтверждение своей оплаты от других документов перед проверкой вопроса.",
    analysisSrc: l06S01Analysis,
  }),
  "L06-S02": createVisualSet({
    storySrc: l06S02Story,
    storyAlt:
      "Саша показывает Тамаре, где искать пояснение, не забирая у неё телефон.",
    analysisSrc: l06S02Analysis,
  }),
  "L06-S03": createVisualSet({
    storySrc: l06S03Story,
    storyAlt: "Саша и Тамара подписывают новый договор аренды за столом.",
    analysisSrc: l06S03Analysis,
  }),
} satisfies Partial<Record<string, SectionVisualSet>>;

export function getSectionVisuals(
  sectionId: string,
): SectionVisualSet | undefined {
  return sectionVisuals[sectionId as keyof typeof sectionVisuals];
}
