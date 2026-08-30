import { useSyncExternalStore } from "react";
import { parseCatalogLabPath, type CatalogLabRoute } from "./apps/editorial-catalog-lab/model";
import { parseHeaderLabPath, type HeaderLabRoute } from "./apps/editorial-header-lab/model";
import {
  parseEditorialV2Path,
  type EditorialV2Route,
} from "./apps/editorial-v2/routing";
import {
  DEFAULT_EXERCISE_LAB_VARIANT,
  isExerciseLabVariantId,
  type ExerciseLabVariantId,
} from "./experiments/exerciseLabContent";

export type AppRoute =
  | { name: "catalog" }
  | { name: "version-hub" }
  | { name: "story"; sectionId: string }
  | { name: "analysis"; sectionId: string }
  | { name: "exercise-lab"; variant: ExerciseLabVariantId }
  | { name: "modern-editorial-lab"; view: ModernEditorialLabViewId }
  | HeaderLabRoute
  | CatalogLabRoute
  | EditorialV2Route
  | { name: "not-found" };

export const MODERN_EDITORIAL_LAB_VIEW_IDS = [
  "story",
  "analysis",
  "exercise",
] as const;

export type ModernEditorialLabViewId =
  (typeof MODERN_EDITORIAL_LAB_VIEW_IDS)[number];

const SECTION_ROUTE =
  /^\/section\/(l\d{2}-s\d{2})\/(story|analysis)\/?$/i;
const VERSION_HUB_ROUTE = /^\/versions\/?$/i;
const EXERCISE_LAB_ROUTE =
  /^\/lab\/l01-s01(?:\/(path|sheets|editorial|stepper))?\/?$/i;
const MODERN_EDITORIAL_LAB_ROUTE =
  /^\/lab\/editorial-system\/l01-s01(?:\/(story|analysis|exercise))?\/?$/i;

function subscribeToHashChange(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function getHashSnapshot() {
  return window.location.hash;
}

export function parseHash(hash: string): AppRoute {
  const path = hash.replace(/^#/, "") || "/";

  if (path === "/" || path === "") {
    return { name: "catalog" };
  }

  if (VERSION_HUB_ROUTE.test(path)) {
    return { name: "version-hub" };
  }

  const catalogLabRoute = parseCatalogLabPath(path);
  if (catalogLabRoute) return catalogLabRoute;

  const headerLabRoute = parseHeaderLabPath(path);
  if (headerLabRoute) return headerLabRoute;

  const editorialV2Route = parseEditorialV2Path(path);

  if (editorialV2Route) {
    return editorialV2Route;
  }

  const exerciseLabMatch = path.match(EXERCISE_LAB_ROUTE);

  if (exerciseLabMatch) {
    const requestedVariant = exerciseLabMatch[1]?.toLowerCase();
    const variant =
      requestedVariant === "stepper"
        ? DEFAULT_EXERCISE_LAB_VARIANT
        : requestedVariant;

    return {
      name: "exercise-lab",
      variant:
        variant && isExerciseLabVariantId(variant)
          ? variant
          : DEFAULT_EXERCISE_LAB_VARIANT,
    };
  }

  const modernEditorialLabMatch = path.match(MODERN_EDITORIAL_LAB_ROUTE);

  if (modernEditorialLabMatch) {
    return {
      name: "modern-editorial-lab",
      view: (modernEditorialLabMatch[1]?.toLowerCase() ??
        "story") as ModernEditorialLabViewId,
    };
  }

  const match = path.match(SECTION_ROUTE);

  if (!match) {
    return { name: "not-found" };
  }

  return {
    name: match[2] as "story" | "analysis",
    sectionId: match[1].toUpperCase(),
  };
}

export function useHashRoute() {
  const hash = useSyncExternalStore(
    subscribeToHashChange,
    getHashSnapshot,
    () => "#/",
  );

  return parseHash(hash);
}

export const catalogHref = "#/";
export const versionHubHref = "#/versions/";

export function storyHref(sectionId: string) {
  return `#/section/${sectionId.toLowerCase()}/story`;
}

export function analysisHref(sectionId: string) {
  return `#/section/${sectionId.toLowerCase()}/analysis`;
}

export const exerciseLabRootHref = "#/lab/l01-s01";

export function exerciseLabHref(variant: ExerciseLabVariantId) {
  return `${exerciseLabRootHref}/${variant}`;
}

export const modernEditorialLabRootHref =
  "#/lab/editorial-system/l01-s01";

export function modernEditorialLabHref(view: ModernEditorialLabViewId) {
  return `${modernEditorialLabRootHref}/${view}`;
}
