import { useSyncExternalStore } from "react";

export type AppRoute =
  | { name: "catalog" }
  | { name: "story"; sectionId: string }
  | { name: "analysis"; sectionId: string }
  | { name: "not-found" };

const SECTION_ROUTE =
  /^\/section\/(l\d{2}-s\d{2})\/(story|analysis)\/?$/i;

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

export function storyHref(sectionId: string) {
  return `#/section/${sectionId.toLowerCase()}/story`;
}

export function analysisHref(sectionId: string) {
  return `#/section/${sectionId.toLowerCase()}/analysis`;
}
