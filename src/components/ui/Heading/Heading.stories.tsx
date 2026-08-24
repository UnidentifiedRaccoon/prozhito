import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./Heading";

const meta = {
  title: "Design System/Heading",
  component: Heading,
  parameters: {
    docs: {
      description: {
        component:
          "Heading отделяет HTML-уровень заголовка от его визуальной роли. Поддерживаются только роли, уже используемые в приложении.",
      },
    },
  },
  args: {
    as: "h1",
    children: "Деньги к нужной дате",
    variant: "page",
  },
  argTypes: {
    as: {
      control: "inline-radio",
      options: ["h1", "h2"],
    },
    variant: {
      control: "inline-radio",
      options: ["display", "page", "section"],
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Roles: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-8)" }}>
      <Heading as="h1" variant="display">
        Прожито
      </Heading>
      <Heading as="h1" variant="page">
        Деньги к нужной дате
      </Heading>
      <Heading as="h2" variant="section">
        Уровень 1. Опора
      </Heading>
    </div>
  ),
};
