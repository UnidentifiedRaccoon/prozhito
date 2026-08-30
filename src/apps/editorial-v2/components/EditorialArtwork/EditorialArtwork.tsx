import type { CSSProperties } from "react";
import type { EditorialV2ArtworkAsset } from "../../model/editorialV2Visuals";
import styles from "./EditorialArtwork.module.css";

export interface EditorialArtworkProps {
  asset: EditorialV2ArtworkAsset;
  variant: "hero" | "solution" | "index";
  priority?: boolean;
}

export function EditorialArtwork({
  asset,
  variant,
  priority = false,
}: EditorialArtworkProps) {
  const focal = variant === "solution" ? asset.solutionFocal : asset.focal;
  const focalStyle = {
    "--ev2-art-x-desktop": `${focal.desktop.x}%`,
    "--ev2-art-y-desktop": `${focal.desktop.y}%`,
    "--ev2-art-x-mobile": `${focal.mobile.x}%`,
    "--ev2-art-y-mobile": `${focal.mobile.y}%`,
  } as CSSProperties;

  return (
    <figure className={styles[variant]} style={focalStyle}>
      <img
        alt={variant === "index" ? "" : asset.alt}
        decoding="async"
        draggable="false"
        fetchPriority={priority ? "high" : "auto"}
        height={asset.height}
        loading={priority ? "eager" : "lazy"}
        src={asset.src}
        width={asset.width}
      />
    </figure>
  );
}
