import { AppShell } from "../components/AppShell";
import { SectionArtwork } from "../components/product/SectionArtwork/SectionArtwork";
import { Heading } from "../components/ui/Heading/Heading";
import { Text } from "../components/ui/Text/Text";
import type { ParsedProgramLevel } from "../content/sections";
import { storyHref } from "../router";
import { getSectionVisuals } from "../visuals/sectionVisuals";
import { useContext } from "react";
import { CloudContentContext } from "../content/cloudContent";

interface CatalogScreenProps {
  levels: readonly ParsedProgramLevel[];
}

const ROMAN_LEVELS = ["I", "II", "III", "IV", "V", "VI"] as const;

export function CatalogScreen({ levels }: CatalogScreenProps) {
  const cloudContent = useContext(CloudContentContext);
  return (
    <AppShell className="catalog-screen" pageTitle="Прожито" routeKey="catalog">
      <header className="catalog-intro">
        <Text className="catalog-tagline" variant="lead">
          Истории и разборы финансовых решений.
        </Text>
      </header>

      {levels.map((level) => {
        const titleId = `${level.id.toLowerCase()}-title`;
        const firstId = level.sections[0]?.id ?? "";
        const catalogArtwork = cloudContent ? cloudContent.get(firstId)?.visuals.catalog : getSectionVisuals(firstId)?.catalog;
        const isFirstLevel = level.number === 1;

        return (
          <section
            className="level-section"
            aria-labelledby={titleId}
            data-level={level.number}
            key={level.id}
          >
            <header className="level-header">
              <span className="level-roman" aria-hidden="true">
                {ROMAN_LEVELS[level.number - 1]}
              </span>
              <div>
                <Text className="level-meta" tone="muted" variant="caption">
                  Уровень {level.number}
                </Text>
                <Heading as="h2" id={titleId} variant="section">
                  {level.title}
                </Heading>
              </div>
              <div className="level-artwork" aria-hidden="true">
                {catalogArtwork ? (
                  <SectionArtwork
                    {...catalogArtwork}
                    fetchPriority={isFirstLevel ? "high" : "auto"}
                    loading={isFirstLevel ? "eager" : "lazy"}
                    variant="catalog"
                  />
                ) : (
                  <span className="level-watercolor" />
                )}
              </div>
            </header>
            <ol className="section-list" role="list">
              {level.sections.map((section) => (
                <li key={section.id}>
                  <a href={storyHref(section.id)}>
                    <span className="section-number" aria-hidden="true">
                      {String(section.number).padStart(2, "0")}
                    </span>
                    <span>{section.title}</span>
                    <svg
                      className="section-arrow"
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                    >
                      <path d="m7 4 6 6-6 6" />
                    </svg>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </AppShell>
  );
}
