import { useEffect, useState, type CSSProperties } from "react";
import type { ParsedSection } from "../../content/sectionContract";
import { EditorialTheme } from "../editorial-v2/foundation/EditorialTheme";
import {
  buildEditorialV2Program,
  type EditorialV2SectionEntry,
} from "../editorial-v2/model/editorialV2Program";
import { editorialV2CatalogHref } from "../editorial-v2/routing";
import { CatalogCard } from "./CatalogCard";
import {
  CATALOG_PREVIEW_WIDTHS,
  CATALOG_VARIANTS,
  catalogLabHref,
  type CatalogLabRoute,
  type CatalogLabView,
} from "./model";
import styles from "./CatalogLab.module.css";

export interface CatalogLabPageProps {
  entries: readonly EditorialV2SectionEntry[];
  view: CatalogLabView;
}

export function CatalogLabPage({ entries, view }: CatalogLabPageProps) {
  const [previewWidth, setPreviewWidth] = useState<number>(390);
  const variants = CATALOG_VARIANTS.filter(
    (variant) => view === "compare" || variant.id === view,
  );
  const previewStyle = {
    "--catalog-preview-width": `${previewWidth}px`,
  } as CSSProperties;

  return (
    <EditorialTheme className={styles.viewport}>
      <header className={styles.masthead}>
        <a className={styles.back} href={editorialV2CatalogHref}>
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M16 10H4m6-6-6 6 6 6" />
          </svg>
          К каталогу
        </a>
        <span className={styles.labNote}>Редакционная лаборатория</span>
      </header>

      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Компактный каталог</h1>
          <p>Варианты мобильного каталога. В рабочей редакционной версии принят D — номер на наплыве.</p>
        </div>

        <div className={styles.controls}>
          <nav className={styles.variants} aria-label="Варианты карточек">
            {CATALOG_VARIANTS.map((variant) => (
              <a
                key={variant.id}
                href={catalogLabHref(variant.id)}
                aria-current={view === variant.id ? "page" : undefined}
              >
                <span aria-hidden="true">{variant.mark}</span>
                {variant.name}
              </a>
            ))}
            <a href={catalogLabHref("compare")} aria-current={view === "compare" ? "page" : undefined}>
              Сравнить все
            </a>
          </nav>

          <fieldset className={styles.widthControls}>
            <legend>Ширина пробы</legend>
            <div>
              {CATALOG_PREVIEW_WIDTHS.map((width) => (
                <button
                  type="button"
                  key={width}
                  aria-label={`${width} пикселей`}
                  aria-pressed={previewWidth === width}
                  onClick={() => setPreviewWidth(width)}
                >
                  {width}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div
          className={styles.stage}
          data-catalog-view={view}
          data-preview-width={previewWidth}
          style={previewStyle}
        >
          {variants.map((variant) => (
            <section
              key={variant.id}
              className={styles.study}
              aria-labelledby={`catalog-study-${variant.id}`}
            >
              <header className={styles.studyIntro}>
                <h2 id={`catalog-study-${variant.id}`}>
                  <span>{variant.mark}</span> {variant.name}
                </h2>
                <p>{variant.description}</p>
              </header>
              <div className={styles.canvas} data-catalog-preview={variant.id}>
                <ol className={styles.list} aria-label={`Истории: ${variant.name}`}>
                  {entries.map((entry, index) => (
                    <li key={entry.id}>
                      <CatalogCard entry={entry} index={index} variant={variant.id} />
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ))}
        </div>
      </main>
    </EditorialTheme>
  );
}

export default function CatalogLabApp({
  route,
  sectionsById,
}: {
  route: CatalogLabRoute;
  sectionsById: ReadonlyMap<string, ParsedSection>;
}) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Лаборатория каталога — Прожито";
    return () => { document.title = previousTitle; };
  }, []);

  return <CatalogLabPage entries={buildEditorialV2Program(sectionsById)} view={route.view} />;
}
