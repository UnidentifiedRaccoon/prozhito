export const HEADER_BASE_VARIANTS = [
  { id: "split", number: "01", name: "Разворот", principle: "Текст и изображение на равных.", detail: "Название слева, вертикальный кадр справа, возврат у нижнего края. Компактный журнальный вход; узкая колонка требовательна к длинным заголовкам и crop." },
  { id: "frame", number: "02", name: "Кадр", principle: "Исходный кадр — точка сравнения.", detail: "Изображение от края до края и центрированный заголовок под ним. Сохранён без изменений, чтобы сравнивать с тремя новыми вариациями: их ритмом, типографикой и переходом к чтению." },
  { id: "inset", number: "03", name: "Врезка", principle: "Заголовок соединяет кадр и чтение.", detail: "Белая врезка перекрывает нижний край иллюстрации. Выразительный переход без текста поверх пёстрого фона; требует свободного места внизу изображения." },
] as const;

export const FRAME_VARIANTS = [
  { id: "frame-italic", number: "A", name: "Курсив", principle: "Только курсив, ничего лишнего.", detail: "Курсивный заголовок по центру под изображением, без штриха. Характер задаёт само начертание. Навигация, кадр и отступы одинаковые у всех трёх вариаций." },
  { id: "frame-rule", number: "B", name: "Штрих", principle: "Спокойный заголовок и графический акцент.", detail: "Прямое начертание по центру и широкий редакционный штрих сразу под изображением. Штрих тоже центрирован: 72 px вместо прежних 28. Остальная композиция та же." },
  { id: "frame-rule-italic", number: "C", name: "Штрих и курсив", principle: "Курсив и штрих в одной композиции.", detail: "Центрированный курсивный заголовок и тот же широкий штрих. Сочетание двух акцентов выразительнее; можно оценить, нужен ли дополнительный декор рядом с курсивом." },
] as const;

export const TWO_LINE_VARIANTS = [
  { id: "split-italic", number: "D", name: "Разворот курсив", principle: "Прежний разворот, новое начертание.", detail: "Курсив в левой колонке исходного разворота. Положение изображения и навигации сохранено. На телефоне название складывается в узкую вертикальную колонку; этот вариант сравнивается с прежним «Разворотом»." },
  { id: "frame-italic-two-line", number: "E", name: "Кадр в 2 строки", principle: "Курсив в более собранной колонке.", detail: "Заголовок по центру, как в «Курсиве», но его колонка уже: название «Деньги к нужной дате» занимает две строки. Изображение, размер шрифта и интервалы сохранены. Длинный тестовый заголовок переносится свободно." },
  { id: "frame-rule-italic-two-line", number: "F", name: "2 строки и штрих", principle: "Те же две строки — с редакционным штрихом.", detail: "Та же ширина колонки и центрированный курсив, плюс штрих72px под картинкой. Обычное название остаётся в двух строках на обоих экранах; штрих не меняет перенос и высоту заголовка." },
] as const;

export const FRAME_NAV_VARIANTS = [
  { id: "frame-nav-top", number: "G", name: "Над кадром", principle: "Одна стрелка — в спокойной верхней строке.", detail: "Исходный «Кадр» 02 без надписей «Прожито» и «Все истории» в шапке. Одна стрелка ведёт к маршруту историй. Она стоит над изображением в компактной полосе; типографика и поля названия сохранены." },
  { id: "frame-nav-overlay", number: "H", name: "На картинке", principle: "Изображение открывает экран сразу.", detail: "Стрелка в верхнем левом углу изображения, на непрозрачной светлой подложке. Отдельной верхней полосы нет: чтение начинается раньше. Положение кнопки одинаковое на обоих экранах." },
  { id: "frame-nav-edge", number: "I", name: "У кромки", principle: "Стрелка соединяет картинку и заголовок.", detail: "Светлая кнопка пересекает нижний край изображения слева. Она находится рядом с началом названия, но не сужает его и не нарушает центрирование исходного «Кадра». Отдельной верхней полосы нет." },
] as const;

export const COVER_VARIANTS = [
  { id: "cover", number: "J", name: "Обложка", principle: "Название становится частью изображения.", detail: "Белый заголовок внизу слева, мягкое затемнение под текстом и одна светлая стрелка сверху. Приём из архивного референса — с нынешними иллюстрациями и редакционной типографикой, без бумажной фактуры и служебных подписей. Обложка погружает в сцену, но оставляет меньше места для чтения, чем исходный «Кадр»." },
] as const;

export const HEADER_VARIANT_GROUPS = [
  { label: "Новый · по архивному референсу", variants: COVER_VARIANTS },
  { label: "Сохранённые основы", variants: HEADER_BASE_VARIANTS },
  { label: "Стрелка в кадре 02", variants: FRAME_NAV_VARIANTS },
  { label: "Курсив и штрих", variants: FRAME_VARIANTS },
  { label: "Курсив и две строки", variants: TWO_LINE_VARIANTS },
] as const;

export const HEADER_VARIANTS = [...HEADER_BASE_VARIANTS, ...FRAME_VARIANTS, ...TWO_LINE_VARIANTS, ...FRAME_NAV_VARIANTS, ...COVER_VARIANTS] as const;

export type HeaderVariantId = (typeof HEADER_VARIANTS)[number]["id"];
export type HeaderView = "story" | "analysis";
export type HeaderLabRoute = {
  name: "editorial-header-lab";
  variant: HeaderVariantId;
  view: "compare" | HeaderView;
  preview: boolean;
  longTitle: boolean;
};

export const HEADER_LAB_ROOT = "#/lab/editorial-headers";
export const LONG_TITLE_FIXTURE = "Деньги к нужной дате: что доступно сейчас и что придёт позже";
const ROUTE = /^\/lab\/editorial-headers(?:\/(split|frame|inset|frame-italic|frame-rule|frame-rule-italic|split-italic|frame-italic-two-line|frame-rule-italic-two-line|frame-nav-top|frame-nav-overlay|frame-nav-edge|cover|frame-edge|frame-caption|frame-folio|title|margin|inset-light|frame-veil)(?:\/(preview\/)?(story|analysis))?)?\/?$/i;
const RETIRED_VARIANTS: Record<string, HeaderVariantId> = {
  "frame-edge": "frame-rule",
  "frame-folio": "frame-italic",
};

export function parseHeaderLabPath(path: string): HeaderLabRoute | null {
  const [pathname, query = ""] = path.split("?");
  const match = pathname.match(ROUTE);
  if (!match) return null;
  const variant = match[1]?.toLowerCase() ?? "frame";
  return {
    name: "editorial-header-lab",
    // Keep previous lab links usable without retaining obsolete compositions.
    variant: HEADER_VARIANTS.find(v => v.id === variant)?.id ?? RETIRED_VARIANTS[variant] ?? "frame",
    view: (match[3]?.toLowerCase() ?? "compare") as HeaderLabRoute["view"],
    preview: Boolean(match[2]),
    longTitle: new URLSearchParams(query).get("title") === "long",
  };
}

export function headerLabHref(variant: HeaderVariantId, view: HeaderLabRoute["view"] = "compare", preview = false, longTitle = false) {
  return `${HEADER_LAB_ROOT}/${variant}${view === "compare" ? "" : `/${preview ? "preview/" : ""}${view}`}${longTitle ? "?title=long" : ""}`;
}
