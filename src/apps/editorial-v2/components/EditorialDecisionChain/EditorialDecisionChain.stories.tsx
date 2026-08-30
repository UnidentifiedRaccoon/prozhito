import type { Meta, StoryObj } from "@storybook/react-vite";
import { getEditorialV2StorybookEntry } from "../../storybook/fixtures";
import { withEditorialV2 } from "../../storybook/withEditorialV2";
import { EditorialDecisionChain } from "./EditorialDecisionChain";

const entry = getEditorialV2StorybookEntry("L01-S01");
const longest = getEditorialV2StorybookEntry("L01-S03");

const meta = {
  title: "Editorial V2/Patterns/DecisionChain",
  component: EditorialDecisionChain,
  decorators: [withEditorialV2],
  args: { items: entry.section.analysisItems },
  parameters: {
    docs: {
      description: {
        component:
          "Открытый редакционный список ровно из девяти канонических звеньев. Компонент проверяет количество и порядок перед рендером.",
      },
    },
  },
} satisfies Meta<typeof EditorialDecisionChain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongCopy: Story = {
  args: { items: longest.section.analysisItems },
};
