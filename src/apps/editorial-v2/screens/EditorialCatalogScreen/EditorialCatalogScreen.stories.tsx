import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { EditorialV2Shell } from "../../components/EditorialV2Shell/EditorialV2Shell";
import {
  editorialV2StorybookEntries,
  editorialV2StorybookLevel,
} from "../../storybook/fixtures";
import { EditorialCatalogScreen } from "./EditorialCatalogScreen";

const meta = {
  title: "Editorial V2/Screens/Catalog",
  component: EditorialCatalogScreen,
  parameters: { layout: "fullscreen" },
  args: {
    entries: editorialV2StorybookEntries,
    levelNumber: editorialV2StorybookLevel.number,
    levelTitle: editorialV2StorybookLevel.title,
    tagline: editorialV2StorybookLevel.tagline,
  },
  render: (args) => (
    <EditorialV2Shell
      compensateLegacyRootPadding={false}
      pageTitle="Первый месяц"
      routeKey="storybook-catalog"
    >
      <EditorialCatalogScreen {...args} />
    </EditorialV2Shell>
  ),
} satisfies Meta<typeof EditorialCatalogScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstChapter: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole("list", {
      name: "Истории первого уровня",
    });
    const scopedList = within(list);

    await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    await expect(scopedList.getAllByRole("listitem")).toHaveLength(3);
    await expect(scopedList.queryAllByRole("img")).toHaveLength(0);
    await expect(
      canvas.queryAllByRole("link", {
        name: /^(Редакционная версия|Архивная версия)$/,
      }),
    ).toHaveLength(0);
    await expect(
      canvas.queryAllByText("Пока перенесены первые три истории.", {
        exact: true,
      }),
    ).toHaveLength(0);
  },
};
