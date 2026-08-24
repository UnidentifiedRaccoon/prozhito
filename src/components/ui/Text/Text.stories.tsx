import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./Text";

const meta = {
  title: "Design System/Text",
  component: Text,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Text задаёт повторяемую визуальную роль, сохраняя выбранную HTML-семантику.",
      },
    },
  },
  args: {
    as: "p",
    children:
      "История и причинность важнее интерфейсной механики и декоративных элементов.",
    tone: "default",
    variant: "body",
  },
  argTypes: {
    as: {
      control: "select",
      options: ["p", "span", "div", "strong", "em", "small"],
    },
    tone: {
      control: "inline-radio",
      options: ["default", "muted", "accent"],
    },
    variant: {
      control: "inline-radio",
      options: ["body", "lead", "label", "caption"],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Lead: Story = {
  args: {
    children: "Истории и разборы финансовых решений.",
    variant: "lead",
  },
};

export const Label: Story = {
  args: {
    as: "span",
    children: "Решение",
    tone: "accent",
    variant: "label",
  },
};

export const Caption: Story = {
  args: {
    as: "small",
    children: "Уровень 1. Первый месяц",
    tone: "muted",
    variant: "caption",
  },
};

export const Tones: Story = {
  render: (args) => (
    <div
      style={{
        display: "grid",
        gap: "var(--space-3)",
        maxWidth: "var(--reading-measure)",
      }}
    >
      <Text {...args} tone="default">
        Основной текст
      </Text>
      <Text {...args} tone="muted">
        Приглушённый текст
      </Text>
      <Text {...args} tone="accent">
        Акцентный текст
      </Text>
    </div>
  ),
};
