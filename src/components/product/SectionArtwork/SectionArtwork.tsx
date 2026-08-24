import type { ImgHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import type { SectionArtworkAsset } from "../../../visuals/sectionVisuals";
import styles from "./SectionArtwork.module.css";

export type SectionArtworkVariant = "analysis" | "catalog" | "story";

export interface SectionArtworkProps
  extends SectionArtworkAsset,
    Omit<
      ImgHTMLAttributes<HTMLImageElement>,
      "alt" | "className" | "height" | "src" | "width"
    > {
  className?: string;
  variant: SectionArtworkVariant;
}

const artworkVariant = {
  analysis: styles.variantAnalysis,
  catalog: styles.variantCatalog,
  story: styles.variantStory,
} satisfies Record<SectionArtworkVariant, string>;

export function SectionArtwork({
  alt,
  className,
  decoding = "async",
  focal: _focal,
  height,
  loading = "lazy",
  src,
  variant,
  width,
  ...imageProps
}: SectionArtworkProps) {
  return (
    <figure className={cn(styles.root, artworkVariant[variant], className)}>
      <img
        alt={alt}
        className={styles.image}
        decoding={decoding}
        draggable={false}
        height={height}
        loading={loading}
        src={src}
        width={width}
        {...imageProps}
      />
    </figure>
  );
}
