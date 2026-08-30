import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { EditorialV2Shell } from "../../components/EditorialV2Shell/EditorialV2Shell";
import { getEditorialV2StorybookEntry } from "../../storybook/fixtures";
import {
  editorialV2AnalysisHref,
  editorialV2CatalogHref,
  type EditorialV2SectionId,
} from "../../routing";
import { EditorialStoryScreen } from "./EditorialStoryScreen";

function storyArgs(sectionId: EditorialV2SectionId) {
  const entry = getEditorialV2StorybookEntry(sectionId);

  return {
    artwork: entry.artwork,
    navigation: {
      secondary: { href: editorialV2CatalogHref, label: "Все истории" },
      primary: {
        href: editorialV2AnalysisHref(entry.id),
        label: "Перейти к решению",
      },
    },
    section: entry.section,
  } as const;
}

const defaultArgs = storyArgs("L01-S01");

const meta = {
  title: "Editorial V2/Screens/Story",
  component: EditorialStoryScreen,
  parameters: { layout: "fullscreen" },
  args: defaultArgs,
  render: (args) => {
    const sectionId = args.section.id as EditorialV2SectionId;

    return (
      <EditorialV2Shell
        compensateLegacyRootPadding={false}
        pageTitle={`${args.section.title} · История`}
        routeKey={`storybook-story-${sectionId}`}
        showMasthead={false}
      >
        <EditorialStoryScreen {...args} />
      </EditorialV2Shell>
    );
  },
} satisfies Meta<typeof EditorialStoryScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

async function verifyStory(
  canvasElement: HTMLElement,
  sectionTitle: string,
  imageAlt: string,
) {
  const canvas = within(canvasElement);

  await expect(
    canvas.getByRole("heading", { level: 1, name: sectionTitle }),
  ).toBeTruthy();
  await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  await expect(canvas.getByRole("link", { name: "К маршруту историй" })).toHaveAttribute("href", editorialV2CatalogHref);
  await expect(canvas.queryByRole("link", { name: "Прожито" })).toBeNull();
  await expect(canvasElement.querySelector("[data-editorial-cover='story']")).toBeTruthy();
  await expect(canvas.getByRole("img", { name: imageAlt })).toBeTruthy();
  await expect(
    canvas.getByRole("link", { name: "Перейти к решению" }),
  ).toBeTruthy();
  await expect(canvasElement.querySelector("figcaption")).toBeNull();
  await expect(
    canvas.queryByRole("navigation", { name: "Экраны истории" }),
  ).toBeNull();
  await expect(canvas.queryAllByRole("tablist")).toHaveLength(0);
  await expect(
    canvas.queryAllByRole("link", { name: /^(История|Решение)$/ }),
  ).toHaveLength(0);

  for (const label of [
    "Материал",
    "Режим",
    "Фокус",
    "Редакционная версия",
    "Архивная версия",
  ]) {
    await expect(canvas.queryAllByText(label, { exact: true })).toHaveLength(0);
  }
}

export const L01S01: Story = {
  play: async ({ canvasElement, args }) =>
    verifyStory(canvasElement, args.section.title, args.artwork.alt),
};

export const L01S02: Story = {
  args: storyArgs("L01-S02"),
  play: async ({ canvasElement, args }) =>
    verifyStory(canvasElement, args.section.title, args.artwork.alt),
};

export const L01S03: Story = {
  args: storyArgs("L01-S03"),
  play: async ({ canvasElement, args }) =>
    verifyStory(canvasElement, args.section.title, args.artwork.alt),
};
