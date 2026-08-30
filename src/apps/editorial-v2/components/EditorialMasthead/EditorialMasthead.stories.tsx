import type { Meta, StoryObj } from "@storybook/react-vite";
import { withEditorialV2 } from "../../storybook/withEditorialV2";
import { EditorialMasthead } from "./EditorialMasthead";

const meta = {
  title: "Editorial V2/Components/Masthead",
  component: EditorialMasthead,
  decorators: [withEditorialV2],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Минимальная шапка самостоятельного приложения: только название «Прожито» со ссылкой на каталог историй.",
      },
    },
  },
} satisfies Meta<typeof EditorialMasthead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
