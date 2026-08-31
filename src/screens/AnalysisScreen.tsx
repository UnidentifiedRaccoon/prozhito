import { AppShell } from "../components/AppShell";
import { DecisionChain } from "../components/product/DecisionChain/DecisionChain";
import { SectionFooter } from "../components/product/SectionFooter/SectionFooter";
import { SectionHeader } from "../components/product/SectionHeader/SectionHeader";
import { SectionHeroHeader } from "../components/product/SectionHeroHeader/SectionHeroHeader";
import type { ParsedSection } from "../content/sectionContract";
import { catalogHref, storyHref } from "../router";
import { useSectionVisuals } from "../content/cloudContent";

interface AnalysisScreenProps {
  section: ParsedSection;
  nextSection?: ParsedSection;
}

export function AnalysisScreen({
  section,
  nextSection,
}: AnalysisScreenProps) {
  const forwardHref = nextSection ? storyHref(nextSection.id) : catalogHref;
  const forwardLabel = nextSection ? "Следующая история" : "Вернуться к списку";
  const visuals = useSectionVisuals(section.id);
  const analysisArtwork = visuals?.analysis;

  return (
    <AppShell
      className={`analysis-screen ${analysisArtwork ? "analysis-screen--hero" : ""}`.trim()}
      masthead={analysisArtwork ? "hidden" : "default"}
      pageTitle={`${section.title}: решение`}
      routeKey={`${section.id}-analysis`}
    >
      {analysisArtwork ? (
        <SectionHeroHeader
          artwork={analysisArtwork}
          catalogHref={catalogHref}
          title={section.title}
          variant="analysis"
        />
      ) : (
        <SectionHeader label="Решение" title={section.title} />
      )}

      <div className={analysisArtwork ? "section-reading-column" : undefined}>
        <article
          className="analysis-article"
          aria-label={`Решение «${section.title}»`}
        >
          <DecisionChain items={section.analysisItems} />
        </article>

        <SectionFooter
          backHref={nextSection ? catalogHref : undefined}
          forwardHref={forwardHref}
          forwardLabel={forwardLabel}
        />
      </div>
    </AppShell>
  );
}
