import type { HeaderVariantId, HeaderView } from "./model";
import storyImage from "../editorial-v2/assets/level-01/l01-s01-story-v1.jpg";
import decisionImage from "./assets/l01-s01-calendar-detail-v1.jpg";
import styles from "./HeaderLab.module.css";

export function Arrow({ forward = false }: { forward?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.arrow}><path d={forward ? "M4 12h15m-6-6 6 6-6 6" : "M20 12H5m6-6-6 6 6 6"} /></svg>;
}

function BackLink() {
  return <a className={styles.back} aria-label="Все истории" href="#/editorial-v2/" target="_top"><Arrow /><span>Все истории</span></a>;
}

function Wordmark() {
  return <a className={styles.wordmark} href="#/editorial-v2/" target="_top">Прожито</a>;
}

function HeaderNavigation() {
  return <nav className={styles.headerNav} aria-label="Возврат к историям"><BackLink /><Wordmark /></nav>;
}

function ArrowNavigation() {
  return <nav className={styles.arrowNav} aria-label="Переход к маршруту">
    <a className={styles.singleBack} href="#/editorial-v2/" target="_top" aria-label="К маршруту историй" title="К маршруту историй"><Arrow /></a>
  </nav>;
}

export function HeaderComposition({ variant, view, title }: { variant: HeaderVariantId; view: HeaderView; title: string }) {
  const isSplit = variant === "split" || variant === "split-italic";
  const isFrameNavigation = variant.startsWith("frame-nav-");
  const compositionClass = variant === "split-italic" ? styles.split : isFrameNavigation ? styles.frame : variant.startsWith("frame-") ? styles.frameStudy : "";
  const heading = <div className={styles.titleGroup}><h1>{title}</h1></div>;
  const artwork = <figure className={styles.artwork}><img
    src={view === "story" ? storyImage : decisionImage}
    alt={view === "story" ? "Саша среди коробок в новой комнате смотрит в телефон." : "В руках Саши телефон с условной сеткой календаря; рядом ключи от комнаты. Даты и сообщения не изображены."}
    width="1536" height="1024" fetchPriority="high"
  /></figure>;

  return <header className={`${styles.hero} ${styles[variant]} ${compositionClass}`} data-header-variant={variant} data-view={view}>
    {variant === "cover" ? <>
      {artwork}<ArrowNavigation />{heading}
    </> : isFrameNavigation ? <>
      {variant === "frame-nav-top" ? <><ArrowNavigation />{artwork}</> : <div className={styles.navigationArtwork}><ArrowNavigation />{artwork}</div>}
      {heading}
    </> : isSplit ? <>
      <div className={styles.splitBrand}><Wordmark /></div>{heading}{artwork}
      <nav className={styles.splitBack} aria-label="Возврат к историям"><BackLink /></nav>
    </> : <>
      <HeaderNavigation />{artwork}{heading}
    </>}
  </header>;
}
