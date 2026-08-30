import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  editorialV2CatalogHref,
  editorialV2StoryHref,
} from "../editorial-v2/routing";
import { editorialV2StorybookEntries } from "../editorial-v2/storybook/fixtures";
import { CatalogLabPage } from "./CatalogLabApp";
import {
  CATALOG_PREVIEW_WIDTHS,
  CATALOG_VARIANTS,
  catalogLabHref,
  type CatalogLabView,
} from "./model";

async function expectCatalogContent(
  canvasElement: HTMLElement,
  view: CatalogLabView,
) {
  const canvas = within(canvasElement);
  const navigation = within(
    canvas.getByRole("navigation", { name: "Варианты карточек" }),
  );
  const variants = CATALOG_VARIANTS.filter(
    (variant) => view === "compare" || variant.id === view,
  );

  await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Компактный каталог",
  );
  await expect(
    canvas.getByRole("link", { name: "К каталогу" }),
  ).toHaveAttribute("href", editorialV2CatalogHref);
  await expect(navigation.getAllByRole("link")).toHaveLength(
    CATALOG_VARIANTS.length + 1,
  );
  await expect(
    navigation.getAllByRole("link", { current: "page" }),
  ).toHaveLength(1);

  for (const variant of CATALOG_VARIANTS) {
    const link = navigation.getByRole("link", {
      name: variant.name,
    });
    await expect(link.tagName).toBe("A");
    await expect(link).toHaveAttribute("href", catalogLabHref(variant.id));
    if (view === variant.id) {
      await expect(link).toHaveAttribute("aria-current", "page");
    } else {
      await expect(link).not.toHaveAttribute("aria-current");
    }
  }

  const compareLink = navigation.getByRole("link", {
    name: "Сравнить все",
  });
  await expect(compareLink.tagName).toBe("A");
  await expect(compareLink).toHaveAttribute("href", catalogLabHref("compare"));
  if (view === "compare") {
    await expect(compareLink).toHaveAttribute("aria-current", "page");
  } else {
    await expect(compareLink).not.toHaveAttribute("aria-current");
  }

  await expect(canvas.getAllByRole("list")).toHaveLength(variants.length);
  await expect(canvas.getAllByRole("listitem")).toHaveLength(
    variants.length * editorialV2StorybookEntries.length,
  );

  for (const variant of variants) {
    const list = within(
      canvas.getByRole("list", { name: `Истории: ${variant.name}` }),
    );
    const storyLinks = list.getAllByRole("link");
    await expect(storyLinks).toHaveLength(editorialV2StorybookEntries.length);
    for (const [index, entry] of editorialV2StorybookEntries.entries()) {
      const link = storyLinks[index];
      const card = within(link);
      await expect(link.tagName).toBe("A");
      await expect(link).toHaveAttribute("href", editorialV2StoryHref(entry.id));
      await expect(
        card.getByText(entry.section.title, { exact: true }),
      ).toBeVisible();
      await expect(card.getByText(entry.summary, { exact: true })).toBeVisible();
      await expect(
        card.getByText("Открыть историю", { exact: true }),
      ).toBeVisible();
    }
  }
}

async function expectPreviewWidth(canvasElement: HTMLElement, width: number) {
  const canvas = within(canvasElement);
  const stage = canvasElement.querySelector("[data-catalog-view]");
  await expect(stage).not.toBeNull();
  await expect(stage).toHaveAttribute("data-preview-width", String(width));
  for (const candidate of CATALOG_PREVIEW_WIDTHS) {
    const button = canvas.getByRole("button", {
      name: `${candidate} пикселей`,
    });
    await expect(button.tagName).toBe("BUTTON");
    await expect(button).toHaveAttribute(
      "aria-pressed",
      String(candidate === width),
    );
  }
}

const meta = {
  title: "Editorial V2/Labs/Compact Catalog",
  component: CatalogLabPage,
  parameters: { layout: "fullscreen" },
  args: {
    entries: editorialV2StorybookEntries,
    view: "split",
  },
  argTypes: {
    entries: { control: false },
    view: {
      control: "select",
      options: [...CATALOG_VARIANTS.map((variant) => variant.id), "compare"],
    },
  },
} satisfies Meta<typeof CatalogLabPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Original: Story = {
  args: { view: "original" },
  play: async ({ canvasElement }) => {
    await expectCatalogContent(canvasElement, "original");
  },
};

export const Split: Story = {
  args: { view: "split" },
  play: async ({ canvasElement }) => {
    await expectCatalogContent(canvasElement, "split");
  },
};

export const Background: Story = {
  args: { view: "background" },
  play: async ({ canvasElement }) => {
    await expectCatalogContent(canvasElement, "background");
  },
};

export const Overlap: Story = {
  args: { view: "overlap" },
  play: async ({ canvasElement }) => {
    await expectCatalogContent(canvasElement, "overlap");
  },
};

export const OverlapRaised: Story = {
  args: { view: "overlap-raised" },
  play: async ({ canvasElement }) => {
    await expectCatalogContent(canvasElement, "overlap-raised");
  },
};

export const Compare: Story = {
  args: { view: "compare" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expectCatalogContent(canvasElement, "compare");
    await expectPreviewWidth(canvasElement, 390);

    const width320 = canvas.getByRole("button", { name: "320 пикселей" });
    const width390 = canvas.getByRole("button", { name: "390 пикселей" });
    const width430 = canvas.getByRole("button", { name: "430 пикселей" });
    width320.focus();
    await expect(width320).toHaveFocus();
    await userEvent.keyboard("[Space]");
    await expectPreviewWidth(canvasElement, 320);
    await userEvent.tab();
    await expect(width390).toHaveFocus();
    await userEvent.keyboard("[Enter]");
    await expectPreviewWidth(canvasElement, 390);
    await userEvent.tab();
    await expect(width430).toHaveFocus();
    await userEvent.keyboard("[Space]");
    await expectPreviewWidth(canvasElement, 430);

    await userEvent.tab();
    const firstStoryLink = within(
      canvas.getByRole("list", { name: "Истории: Исходный" }),
    ).getAllByRole("link")[0];
    await expect(firstStoryLink).toHaveFocus();
    // The page has no route subscription in Storybook; hrefs are checked above.
    await userEvent.click(width390);
    await expectPreviewWidth(canvasElement, 390);
    await expectCatalogContent(canvasElement, "compare");
  },
};

export const Narrow320: Story = {
  args: { view: "compare" },
  parameters: {
    docs: {
      description: {
        story:
          "Все композиции с выбранной шириной пробы 320 px. Это ширина карточек в лаборатории, а не эмуляция мобильного устройства.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "320 пикселей" }),
    );
    await expectPreviewWidth(canvasElement, 320);
    await expectCatalogContent(canvasElement, "compare");
  },
};
