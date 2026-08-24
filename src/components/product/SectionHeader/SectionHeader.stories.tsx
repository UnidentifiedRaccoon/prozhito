import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionHeader } from "./SectionHeader";

const meta = {
  title: "Product/SectionHeader",
  component: SectionHeader,
  parameters: {
    docs: {
      description: {
        component:
          "Единая шапка двух экранов Section: сохраняет один h1 и сообщает, читает пользователь историю или решение.",
      },
    },
  },
  args: {
    label: "История",
    title: "Деньги к нужной дате",
  },
  argTypes: {
    label: {
      control: "inline-radio",
      options: ["История", "Решение"],
    },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Decision: Story = {
  args: {
    label: "Решение",
  },
};
