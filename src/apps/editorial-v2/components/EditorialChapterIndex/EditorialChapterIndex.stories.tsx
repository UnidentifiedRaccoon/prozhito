import type { Meta, StoryObj } from "@storybook/react-vite";
import { editorialV2StorybookEntries } from "../../storybook/fixtures";
import { withEditorialV2 } from "../../storybook/withEditorialV2";
import { editorialV2StoryHref } from "../../routing";
import { EditorialChapterIndex } from "./EditorialChapterIndex";

const sections = editorialV2StorybookEntries.map((entry) => ({
  id: entry.id,
  number: entry.section.number,
  title: entry.section.title,
  summary: entry.summary,
  href: editorialV2StoryHref(entry.id),
  artwork: entry.artwork,
}));

const meta = {
  title: "Editorial V2/Patterns/ChapterIndex",
  component: EditorialChapterIndex,
  decorators: [withEditorialV2],
  parameters: { layout: "fullscreen" },
  args: { sections },
} satisfies Meta<typeof EditorialChapterIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstChapter: Story = {};
