import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionFooter } from "./SectionFooter";

const meta = {
  title: "Product/SectionFooter",
  component: SectionFooter,
  parameters: {
    docs: {
      description: {
        component:
          "Нижняя навигация Section. Обе стороны остаются нативными ссылками: вторичная ведёт к каталогу, основная — к следующему экрану.",
      },
    },
  },
  args: {
    backHref: "#/",
    forwardHref: "#/section/l01-s01/analysis",
    forwardLabel: "Перейти к решению",
  },
} satisfies Meta<typeof SectionFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NextStory: Story = {
  args: {
    forwardHref: "#/section/l01-s02/story",
    forwardLabel: "Следующая история",
  },
};

export const LastSection: Story = {
  args: {
    backHref: undefined,
    forwardHref: "#/",
    forwardLabel: "Вернуться к списку",
  },
};
