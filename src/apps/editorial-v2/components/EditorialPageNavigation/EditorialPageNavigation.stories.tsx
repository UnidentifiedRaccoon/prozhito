import type { Meta, StoryObj } from "@storybook/react-vite";
import { withEditorialV2 } from "../../storybook/withEditorialV2";
import { EditorialPageNavigation } from "./EditorialPageNavigation";

const meta = {
  title: "Editorial V2/Components/PageNavigation",
  component: EditorialPageNavigation,
  decorators: [withEditorialV2],
  args: {
    secondary: { href: "#/editorial-v2/", label: "Все истории" },
    primary: {
      href: "#/editorial-v2/section/l01-s01/analysis",
      label: "Перейти к решению",
    },
  },
} satisfies Meta<typeof EditorialPageNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StoryToSolution: Story = {};

export const SolutionToNext: Story = {
  args: {
    secondary: {
      href: "#/editorial-v2/section/l01-s01/story",
      label: "Вернуться к истории",
    },
    primary: {
      href: "#/editorial-v2/section/l01-s02/story",
      label: "Следующая история",
    },
  },
};

export const SingleAction: Story = {
  args: { secondary: undefined },
};
