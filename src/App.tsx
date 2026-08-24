import { sectionCollection } from "./content/sections";
import { useHashRoute } from "./router";
import { AnalysisScreen } from "./screens/AnalysisScreen";
import { CatalogScreen } from "./screens/CatalogScreen";
import { ContentErrorScreen } from "./screens/ContentErrorScreen";
import { NotFoundScreen } from "./screens/NotFoundScreen";
import { StoryScreen } from "./screens/StoryScreen";

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
