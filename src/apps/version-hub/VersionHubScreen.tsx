import { useEffect, useRef } from "react";
import archivePreview from "../../assets/living-archive/l01-s01/story-arrival-1200.jpg";
import editorialPreview from "../editorial-v2/assets/level-01/l01-s01-story-v1.jpg";
import { editorialV2CatalogHref } from "../editorial-v2/routing";
import styles from "./VersionHubScreen.module.css";

export interface VersionHubScreenProps {
  compensateLegacyRootPadding?: boolean;
}

const versions = [
  {
    id: "editorial",
    title: "Редакционная версия",
    description:
      "Три истории первой главы в современном редакционном оформлении.",
    action: "Открыть редакционную",
    href: editorialV2CatalogHref,
    image: editorialPreview,
    width: 1536,
    height: 1024,
  },
  {
    id: "archive",
    title: "Архивная версия",
    description:
      "Шесть уровней и все 22 истории в оформлении «Живой архив».",
    action: "Открыть архивную",
    href: "#/",
    image: archivePreview,
    width: 1200,
    height: 800,
  },
] as const;

function Arrow() {
  return (
    <svg aria-hidden="true" className={styles.arrow} viewBox="0 0 20 20">
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" />
    </svg>
  );
}

export default function VersionHubScreen({
  compensateLegacyRootPadding = true,
}: VersionHubScreenProps) {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = "Выберите версию — Прожито";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    mainRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div
      className={`${styles.root} ${compensateLegacyRootPadding ? styles.appViewport : ""}`.trim()}
      data-version-hub=""
    >
      <header className={styles.masthead}>
        <p className={styles.wordmark}>Прожито</p>
      </header>
      <main className={styles.main} ref={mainRef} tabIndex={-1}>
        <header className={styles.intro}>
          <h1>Выберите версию</h1>
        </header>
        <nav aria-label="Версии Прожито">
          <ul className={styles.versions}>
            {versions.map((version) => (
              <li key={version.id}>
                <a
                  aria-describedby={`${version.id}-description`}
                  aria-labelledby={`${version.id}-title`}
                  className={styles.version}
                  href={version.href}
                >
                  <img
                    alt=""
                    className={styles.preview}
                    decoding="async"
                    height={version.height}
                    src={version.image}
                    width={version.width}
                  />
                  <div className={styles.copy}>
                    <h2 id={`${version.id}-title`}>{version.title}</h2>
                    <p id={`${version.id}-description`}>
                      {version.description}
                    </p>
                    <span className={styles.action}>
                      {version.action}
                      <Arrow />
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
