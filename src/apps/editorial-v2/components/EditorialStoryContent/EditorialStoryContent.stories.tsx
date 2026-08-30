import type { Meta, StoryObj } from "@storybook/react-vite";
import { getEditorialV2StorybookEntry } from "../../storybook/fixtures";
import { withEditorialV2 } from "../../storybook/withEditorialV2";
import { EditorialStoryContent } from "./EditorialStoryContent";

const entry = getEditorialV2StorybookEntry("L01-S01");
const longest = getEditorialV2StorybookEntry("L01-S02");

const meta = {
  title: "Editorial V2/Patterns/StoryContent",
  component: EditorialStoryContent,
  decorators: [withEditorialV2],
  args: {
    ariaLabel: `Текст истории «${entry.section.title}»`,
    markdown: entry.section.storyMarkdown,
  },
} satisfies Meta<typeof EditorialStoryContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Canonical: Story = {};

export const LongCopy: Story = {
  args: {
    ariaLabel: `Текст истории «${longest.section.title}»`,
    markdown: longest.section.storyMarkdown,
  },
};
