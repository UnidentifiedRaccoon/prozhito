import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { MarkdownContent } from "../../MarkdownContent";
import { sectionCollection } from "../../../content/sections";
import { getSectionVisuals } from "../../../visuals/sectionVisuals";
import { DecisionChain } from "../DecisionChain/DecisionChain";
import {
  SectionHeroHeader,
  type SectionHeroHeaderProps,
} from "./SectionHeroHeader";
import previewStyles from "./SectionHeroHeader.stories.module.css";

const sectionId = "L01-S01";
const visuals = getSectionVisuals(sectionId);

if (!sectionCollection.ok) {
  throw sectionCollection.error;
}

const section = sectionCollection.sectionsById.get(sectionId);

if (!section || !visuals?.story || !visuals.analysis) {
  throw new Error("Для SectionHeroHeader не найдены данные и визуалы L01-S01.");
}

const previewSection = section;
const storyArtwork = visuals.story;
const analysisArtwork = visuals.analysis;

function HeroPreview(args: SectionHeroHeaderProps) {
  const isAnalysis = args.variant === "analysis";

  return (
    <div className={previewStyles.canvas}>
      <div className={previewStyles.sheet}>
        <SectionHeroHeader {...args} />
        <article
          aria-label={`${isAnalysis ? "Решение" : "История"} «${previewSection.title}»`}
          className={`${previewStyles.article} ${isAnalysis ? "analysis-article" : "story-article"}`}
        >
          {isAnalysis ? (
            <DecisionChain items={previewSection.analysisItems} />
          ) : (
            <MarkdownContent>{previewSection.storyMarkdown}</MarkdownContent>
          )}
        </article>
      </div>
    </div>
  );
}

const meta = {
  title: "Exploration/StoryHeroHeader",
  component: SectionHeroHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Общая акварельная hero-анатомия экранов «История» и «Решение» с семантически фиксированными вариантами и круглой ссылкой назад в каталог.",
      },
    },
  },
  args: {
    artwork: storyArtwork,
    catalogHref: "#/",
    title: previewSection.title,
    variant: "story",
  },
  render: (args) => <HeroPreview {...args} />,
} satisfies Meta<typeof SectionHeroHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

async function verifyHeader(
  canvasElement: HTMLElement,
  variant: "story" | "analysis",
) {
  const canvas = within(canvasElement);
  const expectedLabel = variant === "story" ? "История" : "Решение";

  await expect(
    canvas.getByRole("heading", {
      level: 1,
      name: "Деньги к нужной дате",
    }),
  ).toBeTruthy();
  await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  await expect(canvas.getByText(expectedLabel, { selector: "p" })).toBeTruthy();
  await expect(
    canvas.getByRole("link", { name: "Все истории" }),
  ).toBeTruthy();
  await expect(canvas.getAllByRole("link")).toHaveLength(1);
  await expect(canvas.queryByText("Все истории")).toBeNull();

  const image = canvasElement.querySelector("img");
  await expect(image).not.toBeNull();
  await expect(image).toHaveAttribute("draggable", "false");
}

export const CoverOverlay: Story = {
  name: "Акварельная обложка",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await verifyHeader(canvasElement, "story");
    await expect(
      canvas.getByRole("img", {
        name: "Саша среди коробок в съёмной комнате держит телефон.",
      }),
    ).toBeTruthy();
  },
};

export const DecisionCover: Story = {
  name: "Решение · адаптированная обложка",
  args: {
    artwork: analysisArtwork,
    variant: "analysis",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await verifyHeader(canvasElement, "analysis");
    await expect(canvas.queryByRole("img")).toBeNull();
    await expect(canvasElement.querySelector('img[alt=""]')).not.toBeNull();
  },
};
