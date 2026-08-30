import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import VersionHubScreen from "./VersionHubScreen";

const meta = {
  title: "Version Hub/Screen",
  component: VersionHubScreen,
  parameters: { layout: "fullscreen" },
  args: { compensateLegacyRootPadding: false },
} satisfies Meta<typeof VersionHubScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChooseVersion: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = within(canvas.getByRole("navigation", { name: "Версии Прожито" }));

    await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    await expect(navigation.getAllByRole("link")).toHaveLength(2);
    await expect(
      navigation.getByRole("link", { name: "Редакционная версия" }),
    ).toHaveAttribute("href", "#/editorial-v2/");
    await expect(
      navigation.getByRole("link", { name: "Архивная версия" }),
    ).toHaveAttribute("href", "#/");
  },
};
