import l01s01Story from "../assets/level-01/l01-s01-story-v1.jpg";
import l01s02Story from "../assets/level-01/l01-s02-story-v1.jpg";
import l01s03Story from "../assets/level-01/l01-s03-story-v1.jpg";
import l01s01Calendar from "../assets/level-01/l01-s01-calendar-detail-v1.jpg";
import l01s02Phone from "../assets/level-01/l01-s02-phone-detail-v1.jpg";
import l01s03Draft from "../assets/level-01/l01-s03-draft-detail-v1.jpg";
import type { EditorialV2SectionId } from "../routing";

export interface EditorialV2ArtworkAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
  focal: {
    desktop: { x: number; y: number };
    mobile: { x: number; y: number };
  };
  solutionFocal: {
    desktop: { x: number; y: number };
    mobile: { x: number; y: number };
  };
  coverFocal?: {
    desktop: { x: number; y: number };
    mobile: { x: number; y: number };
  };
}

const editorialV2Visuals = {
  "L01-S01": {
    src: l01s01Story,
    width: 1536,
    height: 1024,
    alt: "Саша стоит среди коробок в новой комнате и смотрит в телефон.",
    coverFocal: {
      desktop: { x: 58, y: 5 },
      mobile: { x: 58, y: 5 },
    },
    focal: {
      desktop: { x: 58, y: 5 },
      mobile: { x: 58, y: 44 },
    },
    solutionFocal: {
      desktop: { x: 58, y: 5 },
      mobile: { x: 58, y: 44 },
    },
  },
  "L01-S02": {
    src: l01s02Story,
    width: 1536,
    height: 1024,
    alt: "Саша в офисе останавливает руку перед экраном телефона, Лера сидит рядом.",
    focal: {
      desktop: { x: 50, y: 15 },
      mobile: { x: 50, y: 45 },
    },
    solutionFocal: {
      desktop: { x: 50, y: 15 },
      mobile: { x: 50, y: 45 },
    },
  },
  "L01-S03": {
    src: l01s03Story,
    width: 1536,
    height: 1024,
    alt: "Саша собирает разрозненные бумаги в один черновик за столом, Ирина сидит рядом.",
    focal: {
      desktop: { x: 54, y: 15 },
      mobile: { x: 52, y: 48 },
    },
    solutionFocal: {
      desktop: { x: 54, y: 15 },
      mobile: { x: 52, y: 48 },
    },
  },
} as const satisfies Record<EditorialV2SectionId, EditorialV2ArtworkAsset>;

export function getEditorialV2Visual(sectionId: EditorialV2SectionId) {
  return editorialV2Visuals[sectionId];
}

// One detail of the same scene is shared by exercise, review and full reading.
// Artwork/focal points vary; EditorialCover keeps the same geometry as the story.
const editorialV2SolutionVisuals = {
  "L01-S01": {
    src: l01s01Calendar,
    width: 1536,
    height: 1024,
    alt: "В руках Саши телефон с условной сеткой календаря; рядом ключи от комнаты. Даты и сообщения не изображены.",
    focal: { desktop: { x: 52, y: 55 }, mobile: { x: 52, y: 55 } },
    solutionFocal: { desktop: { x: 52, y: 55 }, mobile: { x: 52, y: 55 } },
  },
  "L01-S02": {
    src: l01s02Phone,
    width: 1536,
    height: 1024,
    alt: "Крупный план телефона в руке Саши и второй руки, остановившейся над экраном; тот же офис и дневной свет. Читаемых сообщений нет.",
    focal: { desktop: { x: 50, y: 20 }, mobile: { x: 50, y: 20 } },
    solutionFocal: { desktop: { x: 50, y: 20 }, mobile: { x: 50, y: 20 } },
  },
  "L01-S03": {
    src: l01s03Draft,
    width: 1536,
    height: 1024,
    alt: "Крупный план рук Саши, ручки и раскрытого черновика на том же вечернем офисном столе; рядом разрозненные бумаги. Читаемых сумм и дат нет.",
    focal: { desktop: { x: 50, y: 28 }, mobile: { x: 50, y: 28 } },
    solutionFocal: { desktop: { x: 50, y: 28 }, mobile: { x: 50, y: 28 } },
  },
} as const satisfies Record<EditorialV2SectionId, EditorialV2ArtworkAsset>;

export function getEditorialV2SolutionVisual(sectionId: EditorialV2SectionId): EditorialV2ArtworkAsset {
  return editorialV2SolutionVisuals[sectionId];
}
