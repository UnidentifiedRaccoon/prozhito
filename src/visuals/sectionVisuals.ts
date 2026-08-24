import analysisHero from "../assets/living-archive/l01-s01/analysis-hero-1536-v1.jpg";
import storyArrival from "../assets/living-archive/l01-s01/story-arrival-1200.jpg";

export interface SectionArtworkAsset {
  alt: string;
  height: number;
  src: string;
  width: number;
}

export interface SectionVisualSet {
  analysis?: SectionArtworkAsset;
  catalog?: SectionArtworkAsset;
  story?: SectionArtworkAsset;
}

const l01S01StoryArtwork = {
  src: storyArrival,
  alt: "Саша среди коробок в съёмной комнате держит телефон.",
  width: 1200,
  height: 800,
} satisfies SectionArtworkAsset;

const sectionVisuals: Partial<Record<string, SectionVisualSet>> = {
  "L01-S01": {
    catalog: {
      ...l01S01StoryArtwork,
      alt: "",
    },
    story: l01S01StoryArtwork,
    analysis: {
      src: analysisHero,
      alt: "",
      width: 1536,
      height: 1024,
    },
  },
};

export function getSectionVisuals(
  sectionId: string,
): SectionVisualSet | undefined {
  return sectionVisuals[sectionId];
}
