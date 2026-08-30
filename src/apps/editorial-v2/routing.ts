export const EDITORIAL_V2_SECTION_IDS = [
  "L01-S01",
  "L01-S02",
  "L01-S03",
] as const;

export type EditorialV2SectionId =
  (typeof EDITORIAL_V2_SECTION_IDS)[number];

export type EditorialV2Route =
  | { name: "editorial-v2-catalog" }
  | {
      name: "editorial-v2-story" | "editorial-v2-analysis";
      sectionId: EditorialV2SectionId;
    };

const EDITORIAL_V2_CATALOG_ROUTE = /^\/editorial-v2\/?$/i;
const EDITORIAL_V2_SECTION_ROUTE =
  /^\/editorial-v2\/section\/(l01-s0[1-3])\/(story|analysis)\/?$/i;

export function isEditorialV2SectionId(
  value: string,
): value is EditorialV2SectionId {
  return EDITORIAL_V2_SECTION_IDS.includes(value as EditorialV2SectionId);
}

export function parseEditorialV2Path(
  path: string,
): EditorialV2Route | null {
  if (EDITORIAL_V2_CATALOG_ROUTE.test(path)) {
    return { name: "editorial-v2-catalog" };
  }

  const match = path.match(EDITORIAL_V2_SECTION_ROUTE);

  if (!match) {
    return null;
  }

  const sectionId = match[1].toUpperCase();

  if (!isEditorialV2SectionId(sectionId)) {
    return null;
  }

  return {
    name:
      match[2].toLowerCase() === "story"
        ? "editorial-v2-story"
        : "editorial-v2-analysis",
    sectionId,
  };
}

export const editorialV2CatalogHref = "#/editorial-v2/";

export function editorialV2StoryHref(sectionId: EditorialV2SectionId) {
  return `#/editorial-v2/section/${sectionId.toLowerCase()}/story`;
}

export function editorialV2AnalysisHref(sectionId: EditorialV2SectionId) {
  return `#/editorial-v2/section/${sectionId.toLowerCase()}/analysis`;
}
