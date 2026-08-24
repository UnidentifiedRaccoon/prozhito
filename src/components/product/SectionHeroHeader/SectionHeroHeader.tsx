import type { CSSProperties } from "react";
import type {
  SectionArtworkAsset,
  SectionArtworkFocalSet,
} from "../../../visuals/sectionVisuals";
import { cn } from "../../../lib/cn";
import { Heading } from "../../ui/Heading/Heading";
import styles from "./SectionHeroHeader.module.css";

export type SectionHeroHeaderVariant = "story" | "analysis";

export interface SectionHeroHeaderProps {
  artwork: SectionArtworkAsset;
  catalogHref: string;
  className?: string;
  title: string;
  variant: SectionHeroHeaderVariant;
}

const heroCopy = {
  story: {
    label: "История",
    navigationLabel: "Навигация истории",
  },
  analysis: {
    label: "Решение",
    navigationLabel: "Навигация решения",
  },
} satisfies Record<
  SectionHeroHeaderVariant,
  { label: string; navigationLabel: string }
>;

const heroVariantClass = {
  story: styles.variantStory,
  analysis: styles.variantAnalysis,
} satisfies Record<SectionHeroHeaderVariant, string>;

const defaultHeroFocal = {
  story: {
    mobile: { x: 50, y: 42 },
    desktop: { x: 50, y: 42 },
  },
  analysis: {
    mobile: { x: 51, y: 50 },
    desktop: { x: 51, y: 70 },
  },
} satisfies Record<SectionHeroHeaderVariant, SectionArtworkFocalSet>;

function BackToCatalogIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m9 6-6 6 6 6M4 12h16" />
    </svg>
  );
}

export function SectionHeroHeader({
  artwork,
  catalogHref,
  className,
  title,
  variant,
}: SectionHeroHeaderProps) {
  const copy = heroCopy[variant];
  const focal = artwork.focal ?? defaultHeroFocal[variant];
  const imageStyle = {
    "--hero-object-position-mobile": `${focal.mobile.x}% ${focal.mobile.y}%`,
    "--hero-object-position-desktop": `${focal.desktop.x}% ${focal.desktop.y}%`,
  } as CSSProperties;

  return (
    <header
      className={cn(styles.root, heroVariantClass[variant], className)}
    >
      <div className={styles.media}>
        <img
          alt={artwork.alt}
          className={styles.image}
          decoding="async"
          draggable={false}
          fetchPriority="high"
          height={artwork.height}
          loading="eager"
          src={artwork.src}
          style={imageStyle}
          width={artwork.width}
        />

        <nav aria-label={copy.navigationLabel} className={styles.navigation}>
          <a
            aria-label="Все истории"
            className={styles.catalogLink}
            href={catalogHref}
          >
            <BackToCatalogIcon />
          </a>
        </nav>
      </div>

      <div className={styles.titleBlock}>
        <p className={styles.label}>{copy.label}</p>
        <Heading as="h1" className={styles.title} variant="page">
          {title}
        </Heading>
      </div>
    </header>
  );
}
