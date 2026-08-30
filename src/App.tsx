import { lazy, Suspense } from "react";
import { sectionCollection } from "./content/sections";
import { useHashRoute } from "./router";
import { AnalysisScreen } from "./screens/AnalysisScreen";
import { CatalogScreen } from "./screens/CatalogScreen";
import { ContentErrorScreen } from "./screens/ContentErrorScreen";
import { ExerciseLabScreen } from "./screens/ExerciseLabScreen";
import { ModernEditorialLabScreen } from "./screens/ModernEditorialLabScreen";
import { NotFoundScreen } from "./screens/NotFoundScreen";
import { StoryScreen } from "./screens/StoryScreen";

const HeaderLabApp = lazy(() => import("./apps/editorial-header-lab/HeaderLabApp"));
const CatalogLabApp = lazy(() => import("./apps/editorial-catalog-lab/CatalogLabApp"));

const EditorialV2App = lazy(
  () => import("./apps/editorial-v2/EditorialV2App"),
);
const VersionHubScreen = lazy(
  () => import("./apps/version-hub/VersionHubScreen"),
);

const appLoadingFallback = (
  <div
    aria-live="polite"
    role="status"
    style={{
      position: "fixed",
      zIndex: 50,
      inset: 0,
      padding: "2rem",
      background: "#fcfcfb",
      color: "#202522",
      fontFamily: "system-ui, sans-serif",
    }}
  >
    Открываем «Прожито»…
  </div>
);

export default function App() {
  const route = useHashRoute();

  if (!sectionCollection.ok) {
    return <ContentErrorScreen error={sectionCollection.error} />;
  }

  const { levels, sections, sectionsById } = sectionCollection;

  if (route.name === "catalog") {
    return <CatalogScreen levels={levels} />;
  }

  if (route.name === "not-found") {
    return <NotFoundScreen />;
  }

  if (route.name === "editorial-catalog-lab") {
    return (
      <Suspense fallback={appLoadingFallback}>
        <CatalogLabApp route={route} sectionsById={sectionsById} />
      </Suspense>
    );
  }

  if (route.name === "editorial-header-lab") {
    const section = sectionsById.get("L01-S01");
    if (!section) return <NotFoundScreen />;
    return <Suspense fallback={appLoadingFallback}><HeaderLabApp route={route} section={section} /></Suspense>;
  }

  if (route.name === "version-hub") {
    return (
      <Suspense fallback={appLoadingFallback}>
        <VersionHubScreen />
      </Suspense>
    );
  }

  if (
    route.name === "editorial-v2-catalog" ||
    route.name === "editorial-v2-story" ||
    route.name === "editorial-v2-analysis"
  ) {
    return (
      <Suspense fallback={appLoadingFallback}>
        <EditorialV2App route={route} sectionsById={sectionsById} />
      </Suspense>
    );
  }

  if (route.name === "exercise-lab") {
    const labSection = sectionsById.get("L01-S01");

    if (!labSection) {
      return <NotFoundScreen />;
    }

    return (
      <ExerciseLabScreen
        key={route.variant}
        section={labSection}
        variantId={route.variant}
      />
    );
  }

  if (route.name === "modern-editorial-lab") {
    const labSection = sectionsById.get("L01-S01");

    if (!labSection) {
      return <NotFoundScreen />;
    }

    return (
      <ModernEditorialLabScreen section={labSection} view={route.view} />
    );
  }

  const section = sectionsById.get(route.sectionId);

  if (!section) {
    return <NotFoundScreen />;
  }

  if (route.name === "story") {
    return <StoryScreen section={section} />;
  }

  const sectionIndex = sections.findIndex(({ id }) => id === section.id);
  const nextSection = sections[sectionIndex + 1];

  return <AnalysisScreen nextSection={nextSection} section={section} />;
}
