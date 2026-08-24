import type { Meta, StoryObj } from "@storybook/react-vite";
import { getSectionVisuals } from "../../../visuals/sectionVisuals";
import { SectionArtwork } from "./SectionArtwork";

const visuals = getSectionVisuals("L01-S01");

if (!visuals?.story || !visuals.analysis) {
  throw new Error("Для stories SectionArtwork не найдены визуалы L01-S01.");
}

const meta = {
  title: "Product/SectionArtwork",
  component: SectionArtwork,
  parameters: {
    docs: {
      description: {
        component:
          "Адаптивная рамка для проверенных сюжетных и декоративных ассетов Section. Визуалы подключаются отдельно от канонического Markdown.",
      },
    },
  },
  args: {
    ...visuals.story,
    variant: "story",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["story", "catalog", "analysis"],
    },
  },
} satisfies Meta<typeof SectionArtwork>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Story: Story = {};

export const Catalog: Story = {
  args: {
    ...visuals.story,
    alt: "",
    variant: "catalog",
  },
};

export const Analysis: Story = {
  args: {
    ...visuals.analysis,
    variant: "analysis",
  },
};
