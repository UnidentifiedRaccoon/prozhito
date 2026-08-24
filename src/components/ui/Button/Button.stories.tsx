import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Design System/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Единое визуальное семейство действий: без href компонент рендерит Base UI Button, с href — нативную ссылку.",
      },
    },
  },
  args: {
    children: "Продолжить",
    size: "medium",
    variant: "filled",
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"],
    },
    variant: {
      control: "inline-radio",
      options: ["filled", "outline", "ghost"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const AsLink: Story = {
  args: {
    children: "Перейти к решению",
    href: "#/section/l01-s01/analysis",
  },
};

export const LinkVariants: Story = {
  args: {
    href: "#/",
  },
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--space-4)",
        alignItems: "center",
      }}
    >
      <Button {...args} variant="filled">
        Filled link
      </Button>
      <Button {...args} variant="outline">
        Outline link
      </Button>
      <Button {...args} variant="ghost">
        Ghost link
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--space-4)",
        alignItems: "center",
      }}
    >
      <Button {...args} size="small">
        Маленькая
      </Button>
      <Button {...args} size="medium">
        Средняя
      </Button>
      <Button {...args} size="large">
        Большая
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
