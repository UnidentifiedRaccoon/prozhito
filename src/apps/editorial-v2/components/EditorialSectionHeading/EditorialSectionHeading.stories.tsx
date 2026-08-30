import type { Meta, StoryObj } from "@storybook/react-vite";
import { withEditorialV2 } from "../../storybook/withEditorialV2";
import { EditorialSectionHeading } from "./EditorialSectionHeading";

const meta = {
  title: "Editorial V2/Components/SectionHeading",
  component: EditorialSectionHeading,
  decorators: [withEditorialV2],
  args: {
    sectionNumber: 1,
    title: "Деньги к нужной дате",
    view: "story",
  },
} satisfies Meta<typeof EditorialSectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Story: Story = {};

export const Solution: Story = {
  args: {
    view: "analysis",
  },
};

export const LongTitle: Story = {
  args: { sectionNumber: 3, title: "Черновик вместо памяти" },
};
