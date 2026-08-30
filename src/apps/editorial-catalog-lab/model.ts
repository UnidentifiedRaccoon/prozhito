export const CATALOG_VARIANTS = [
  {
    id: "original",
    mark: "0",
    name: "Исходный",
    description: "Текст и большой кадр друг под другом — исходная мобильная композиция.",
  },
  {
    id: "split",
    mark: "A",
    name: "Сплит",
    description: "Текст слева, кадр справа. Самая чёткая граница между чтением и изображением.",
  },
  {
    id: "background",
    mark: "B",
    name: "Фон",
    description: "Изображение растворяется в светлом поле. Больше места тексту, мягче граница кадра.",
  },
  {
    id: "overlap",
    mark: "C",
    name: "Наплыв",
    description: "Номер вплотную к верхнему левому углу картинки. Текст заходит на её нижний край.",
  },
  {
    id: "overlap-raised",
    mark: "D",
    name: "Номер на наплыве",
    description: "Номер на верхней границе текстового поля: половина подложки выступает над наплывом.",
  },
] as const;

export type CatalogVariantId = (typeof CATALOG_VARIANTS)[number]["id"];
export type CatalogLabView = CatalogVariantId | "compare";
export interface CatalogLabRoute {
  name: "editorial-catalog-lab";
  view: CatalogLabView;
}

export const CATALOG_LAB_ROOT = "#/lab/editorial-catalog";
export const CATALOG_PREVIEW_WIDTHS = [320, 390, 430] as const;
const ROUTE = /^\/lab\/editorial-catalog(?:\/(original|split|background|overlap|overlap-raised|compare))?\/?$/i;

export function parseCatalogLabPath(path: string): CatalogLabRoute | null {
  const match = ROUTE.exec(path);
  if (!match) return null;
  return {
    name: "editorial-catalog-lab",
    view: (match[1]?.toLowerCase() ?? "split") as CatalogLabView,
  };
}

export function catalogLabHref(view: CatalogLabView = "split") {
  return `${CATALOG_LAB_ROOT}/${view}`;
}
