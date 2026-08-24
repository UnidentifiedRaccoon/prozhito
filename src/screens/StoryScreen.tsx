import { AppShell } from "../components/AppShell";
import { MarkdownContent } from "../components/MarkdownContent";
import { SectionFooter } from "../components/product/SectionFooter/SectionFooter";
import { SectionHeader } from "../components/product/SectionHeader/SectionHeader";
import { SectionHeroHeader } from "../components/product/SectionHeroHeader/SectionHeroHeader";
import type { ParsedSection } from "../content/sectionContract";
import { analysisHref, catalogHref } from "../router";
import { getSectionVisuals } from "../visuals/sectionVisuals";

interface StoryScreenProps {
  section: ParsedSection;
}

export function StoryScreen({ section }: StoryScreenProps) {
  const visuals = getSectionVisuals(section.id);
  const storyArtwork = visuals?.story;

  return (
    <AppShell
      className={`story-screen ${storyArtwork ? "story-screen--hero" : ""}`.trim()}
      masthead={storyArtwork ? "hidden" : "default"}
      pageTitle={section.title}
      routeKey={`${section.id}-story`}
    >
      {storyArtwork ? (
        <SectionHeroHeader
          artwork={storyArtwork}
          catalogHref={catalogHref}
          title={section.title}
          variant="story"
        />
      ) : (
        <SectionHeader label="История" title={section.title} />
      )}

      <div className={storyArtwork ? "section-reading-column" : undefined}>
        <article
          className="story-article"
          aria-label={`История «${section.title}»`}
        >
          <MarkdownContent>{section.storyMarkdown}</MarkdownContent>
        </article>

        <SectionFooter
          backHref={catalogHref}
          forwardHref={analysisHref(section.id)}
          forwardLabel="Перейти к решению"
        />
      </div>
    </AppShell>
  );
}
