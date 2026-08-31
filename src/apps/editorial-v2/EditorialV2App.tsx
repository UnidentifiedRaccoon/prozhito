import { useContext, useState } from "react";
import type { ParsedSection } from "../../content/sectionContract";
import { EditorialV2Shell } from "./components/EditorialV2Shell/EditorialV2Shell";
import {
  buildEditorialV2Program,
  EDITORIAL_V2_LEVEL,
} from "./model/editorialV2Program";
import {
  editorialV2AnalysisHref,
  editorialV2CatalogHref,
  editorialV2StoryHref,
  type EditorialV2Route,
} from "./routing";
import { EditorialCatalogScreen } from "./screens/EditorialCatalogScreen/EditorialCatalogScreen";
import { EditorialSolutionScreen } from "./screens/EditorialSolutionScreen/EditorialSolutionScreen";
import { EditorialStoryScreen } from "./screens/EditorialStoryScreen/EditorialStoryScreen";
import { createEditorialExerciseState } from "./model/editorialExercise";
import { CloudContentContext, useEditorialArtwork } from "../../content/cloudContent";
import type { EditorialV2ArtworkAsset } from "./model/editorialV2Visuals";

export interface EditorialV2AppProps {
  route: EditorialV2Route;
  sectionsById: ReadonlyMap<string, ParsedSection>;
}

export default function EditorialV2App({
  route,
  sectionsById,
}: EditorialV2AppProps) {
  const cloudContent = useContext(CloudContentContext);
  const entries = buildEditorialV2Program(sectionsById).map(entry => {
    const remote=cloudContent?.get(entry.id)?.editorial;
    return remote ? {...entry,summary:remote.summary,artwork:remote.story as EditorialV2ArtworkAsset} : entry;
  });

  if (route.name === "editorial-v2-catalog") {
    return (
      <EditorialV2Shell
        pageTitle="Первый месяц"
        routeKey={route.name}
      >
        <EditorialCatalogScreen
          entries={entries}
          levelNumber={EDITORIAL_V2_LEVEL.number}
          levelTitle={EDITORIAL_V2_LEVEL.title}
          tagline={EDITORIAL_V2_LEVEL.tagline}
        />
      </EditorialV2Shell>
    );
  }

  const entryIndex = entries.findIndex(({ id }) => id === route.sectionId);
  const entry = entries[entryIndex];

  if (!entry) {
    throw new Error(`Editorial v2 не нашла Section ${route.sectionId}.`);
  }

  return (
    <EditorialSectionView
      key={entry.id}
      entry={entry}
      nextEntry={entries[(entryIndex + 1) % entries.length]}
      route={route}
    />
  );
}

function EditorialSectionView({
  entry,
  nextEntry,
  route,
}: {
  entry: ReturnType<typeof buildEditorialV2Program>[number];
  nextEntry: ReturnType<typeof buildEditorialV2Program>[number];
  route: Exclude<EditorialV2Route, { name: "editorial-v2-catalog" }>;
}) {
  // A Section owns its temporary answers; changing its key or leaving it clears them.
  const [exerciseState, setExerciseState] = useState(createEditorialExerciseState);
  const solutionArtwork = useEditorialArtwork(entry.id,true);

  const isStory = route.name === "editorial-v2-story";
  if (isStory) {
    return (
      <EditorialV2Shell
        pageTitle={`${entry.section.title} · История`}
        routeKey={`${route.name}-${entry.id}`}
        showMasthead={false}
      >
        <EditorialStoryScreen
          artwork={entry.artwork}
          navigation={{
            secondary: {
              href: editorialV2CatalogHref,
              label: "Все истории",
            },
            primary: {
              href: editorialV2AnalysisHref(entry.id),
              label: "Перейти к решению",
            },
          }}
          section={entry.section}
        />
      </EditorialV2Shell>
    );
  }

  return (
    <EditorialV2Shell
      pageTitle={`${entry.section.title} · Решение`}
      routeKey={`${route.name}-${entry.id}`}
      showMasthead={false}
    >
      <EditorialSolutionScreen
        artwork={solutionArtwork}
        exercise={{
          state: exerciseState,
          onStateChange: setExerciseState,
        }}
        navigation={{
          secondary: {
            href: editorialV2StoryHref(entry.id),
            label: "Вернуться к истории",
          },
          primary: {
            href: editorialV2StoryHref(nextEntry.id),
            label: "Следующая история",
          },
        }}
        section={entry.section}
      />
    </EditorialV2Shell>
  );
}
