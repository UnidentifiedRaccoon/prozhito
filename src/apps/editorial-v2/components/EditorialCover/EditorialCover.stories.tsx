import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { withEditorialV2 } from "../../storybook/withEditorialV2";
import { getEditorialV2StorybookEntry } from "../../storybook/fixtures";
import { getEditorialV2SolutionVisual } from "../../model/editorialV2Visuals";
import { EditorialCover } from "./EditorialCover";

const entry = getEditorialV2StorybookEntry("L01-S01");
const meta = {
  title: "Editorial V2/Components/Cover",
  component: EditorialCover,
  decorators: [withEditorialV2],
  parameters: { layout: "fullscreen" },
  args: { title: entry.section.title, artwork: entry.artwork, view: "story", label: "История" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    await expect(canvas.getByRole("heading", { name: args.title })).toBeVisible();
    await expect(canvas.getByRole("img", { name: args.artwork.alt })).toBeVisible();
    await expect(canvas.getAllByRole("link")).toHaveLength(1);
    await expect(canvas.getByRole("link", { name: "К маршруту историй" })).toHaveAttribute("href", "#/editorial-v2/");
  },
} satisfies Meta<typeof EditorialCover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Story: Story = {};
export const Solution: Story = {
  args: { view: "analysis", label: "Разбор", artwork: getEditorialV2SolutionVisual("L01-S01") },
};
export const Exercise: Story = {
  args: { view: "analysis", label: "Упражнение", artwork: getEditorialV2SolutionVisual("L01-S01") },
};
export const LongTitle: Story = {
  args: { title: "Деньги к нужной дате: что доступно сейчас и что придёт позже" },
};
