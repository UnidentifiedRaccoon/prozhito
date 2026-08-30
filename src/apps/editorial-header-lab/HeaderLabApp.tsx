import { useEffect, useRef, useState } from "react";
import type { ParsedSection } from "../../content/sectionContract";
import { EditorialTheme } from "../editorial-v2/foundation/EditorialTheme";
import { EditorialStoryContent } from "../editorial-v2/components/EditorialStoryContent/EditorialStoryContent";
import { EditorialDecisionChain } from "../editorial-v2/components/EditorialDecisionChain/EditorialDecisionChain";
import { Arrow, HeaderComposition } from "./HeaderComposition";
import { HEADER_VARIANT_GROUPS, HEADER_VARIANTS, LONG_TITLE_FIXTURE, headerLabHref, type HeaderLabRoute, type HeaderVariantId, type HeaderView } from "./model";
import styles from "./HeaderLab.module.css";

const VIEW_LABELS = { story: "История", analysis: "Решение" } as const;

function LabReader({ route, section }: { route: HeaderLabRoute & { view: HeaderView }; section: ParsedSection }) {
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    document.title = `${VIEW_LABELS[route.view]} · ${HEADER_VARIANTS.find(v => v.id === route.variant)?.name} · Лаборатория «Прожито»`;
    window.scrollTo(0, 0);
    // An embedded preview must not steal focus from the comparison controls.
    if (!route.preview) mainRef.current?.focus({ preventScroll: true });
  }, [route.view, route.variant, route.longTitle, route.preview]);

  return <EditorialTheme className={styles.viewport} data-header-lab="reader" data-reader-variant={route.variant}>
    <a className={styles.skip} href={headerLabHref(route.variant, route.view, route.preview, route.longTitle)} onClick={event => {
      event.preventDefault();
      document.getElementById("reading-content")?.focus();
      document.getElementById("reading-content")?.scrollIntoView();
    }}>К тексту</a>
    {!route.preview && <div className={styles.readerTools}>
      <a href={headerLabHref(route.variant, "compare", false, route.longTitle)}><Arrow />Лаборатория</a>
      <label>Вариант<select aria-label="Вариант шапки" value={route.variant} onChange={event => {
        window.location.hash = headerLabHref(event.target.value as HeaderVariantId, route.view, false, route.longTitle);
      }}>{HEADER_VARIANT_GROUPS.map(group => <optgroup key={group.label} label={group.label}>{group.variants.map(v => <option key={v.id} value={v.id}>{v.number} · {v.name}</option>)}</optgroup>)}</select></label>
    </div>}
    {route.longTitle && !route.preview && <p className={styles.testNote}>Тестовый заголовок. Канонический текст Section не изменён.</p>}
    <main ref={mainRef} tabIndex={-1} className={styles.readerMain}>
      <article>
        <HeaderComposition variant={route.variant} view={route.view} title={route.longTitle ? LONG_TITLE_FIXTURE : section.title} />
        <div id="reading-content" tabIndex={-1} className={styles.reading}>
          {route.view === "story" ? <EditorialStoryContent ariaLabel={`Текст истории «${section.title}»`} markdown={section.storyMarkdown} /> : <EditorialDecisionChain items={section.analysisItems} />}
        </div>
        <nav className={styles.footerNav} aria-label="Навигация по истории">
          <a href={route.view === "story" ? "#/editorial-v2/" : headerLabHref(route.variant, "story", false, route.longTitle)} target="_top"><Arrow />{route.view === "story" ? "Все истории" : "Вернуться к истории"}</a>
          <a href={route.view === "story" ? headerLabHref(route.variant, "analysis", false, route.longTitle) : "#/editorial-v2/section/l01-s02/story"} target="_top">{route.view === "story" ? "Перейти к решению" : "Следующая история"}<Arrow forward /></a>
        </nav>
      </article>
    </main>
  </EditorialTheme>;
}

function Comparison({ route, section }: { route: HeaderLabRoute; section: ParsedSection }) {
  const [wide, setWide] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const selected = HEADER_VARIANTS.find(v => v.id === route.variant)!;
  useEffect(() => { document.title = `${selected.name} · Лаборатория шапок «Прожито»`; }, [selected.name]);

  return <EditorialTheme className={styles.viewport} data-header-lab="compare">
    <div className={styles.labMasthead}><a className={styles.wordmark} href="#/editorial-v2/">Прожито</a><span>Дизайн-лаборатория / шапки</span><a href="#/editorial-v2/">Рабочая версия<Arrow forward /></a></div>
    <main className={styles.labMain}>
      <div className={styles.labIntro}><h1>Обложка: текст на изображении</h1><p>Новый взгляд на архивный приём.<br />Все прежние варианты сохранены.<br /><span>{section.title}</span></p></div>
      <nav className={styles.variants} aria-label="Варианты шапки">{HEADER_VARIANT_GROUPS.map(group => <div className={styles.variantGroup} key={group.label}>
        <p>{group.label}</p><div className={styles.variantLinks}>{group.variants.map(v => <a key={v.id} href={headerLabHref(v.id, "compare", false, route.longTitle)} aria-current={v.id === route.variant ? "page" : undefined}><span>{v.number}</span>{v.name}</a>)}</div>
      </div>)}</nav>
      <div className={styles.variantIntro} aria-live="polite"><h2>{selected.principle}</h2><p>{selected.detail}</p></div>
      <div className={styles.compareTools}>
        <div className={styles.sizeControls} role="group" aria-label="Ширина окон сравнения"><button type="button" aria-pressed={!wide} onClick={() => setWide(false)}>Телефон</button><button type="button" aria-pressed={wide} onClick={() => setWide(true)}>Шире</button></div>
        <label className={styles.testControl}><input type="checkbox" checked={route.longTitle} onChange={event => { window.location.hash = headerLabHref(route.variant, "compare", false, event.target.checked); }} />Длинный заголовок</label>
        <span className={styles.sizeNote}>{wide ? "По ширине колонок" : "До 390 px"} · высота 760 px</span>
      </div>
      {route.longTitle && <p className={styles.testNote}>Тестовый заголовок, одинаковый во всех вариантах. Канонические тексты не меняются.</p>}
      <div className={`${styles.previews} ${wide ? styles.widePreviews : ""}`}>
        {(["story", "analysis"] as const).map(view => <section className={styles.preview} key={view}>
          <div className={styles.previewLabel}><h2>{view === "story" ? "Первый экран" : "Второй экран"}</h2><a href={headerLabHref(route.variant, view, false, route.longTitle)}>На весь экран<Arrow forward /></a></div>
          <iframe key={`${route.variant}-${view}-${route.longTitle}`} title={`${VIEW_LABELS[view]} — ${selected.name}`} src={headerLabHref(route.variant, view, true, route.longTitle)} className={styles.previewFrame} />
          <p className={styles.foldLabel}>Конец первого экрана · внутри можно читать дальше</p>
        </section>)}
      </div>
      <div className={styles.labNotes}>
        <p><strong>Одна пара изображений во всех вариантах.</strong> Первый экран — Саша в новой комнате. Второй — деталь с календарём в телефоне: внимание к срокам, без изображения совершённого платежа. Оба текста полные; разбор сохраняет девять звеньев.</p>
        <details><summary>Референсы и принципы</summary><ul>
          <li>Архивные скриншоты владельца — белое название снизу слева на мягком тёмном градиенте и одна стрелка сверху. В «Обложке» этот приём соединён с текущими иллюстрациями и шрифтами.</li>
          <li><a href="https://www.pinterest.com/pin/minimalist-typography-for-editorial-landing-page--702913454372533688/" target="_blank" rel="noreferrer">Pinterest · Minimalist typography</a> — сильная иерархия названия и свободное поле.</li>
          <li><a href="https://in.pinterest.com/pin/desktop-vs-mobile-case-study-for-a-fashion-magazine-case-study-article-women-website-magazine-typography-fas--196891814945902639/" target="_blank" rel="noreferrer">Pinterest · Desktop vs Mobile</a> — отдельная композиция для узкого экрана.</li>
          <li><a href="https://longreads.com/2017/09/25/art-director-kjell-reigstad-on-how-we-refined-longreads-typography-and-logo/" target="_blank" rel="noreferrer">Longreads</a> — спокойная антиква и небольшой masthead.</li>
          <li><a href="https://www.pentagram.com/work/netflix-queue" target="_blank" rel="noreferrer">Pentagram · Netflix Queue</a> — разные отношения изображения и текста в одной системе.</li>
          <li><a href="https://www.posttypography.com/case-studies/editorial-illustration" target="_blank" rel="noreferrer">Post Typography</a> — изображение раскрывает смысл истории.</li>
        </ul></details>
        <p className={styles.labDisclaimer}>Обложка J принята для редакционной версии. Все 13 вариантов сохранены для истории и сравнения. Impeccable недоступен и не использовался.</p>
      </div>
    </main>
  </EditorialTheme>;
}

export default function HeaderLabApp({ route, section }: { route: HeaderLabRoute; section: ParsedSection }) {
  if (route.view === "compare") return <Comparison route={route} section={section} />;
  return <LabReader route={{ ...route, view: route.view }} section={section} />;
}
