import type { Meta, StoryObj } from "@storybook/react-vite";
import { getEditorialV2StorybookEntry } from "../../storybook/fixtures";
import { withEditorialV2 } from "../../storybook/withEditorialV2";
import { EditorialArtwork } from "./EditorialArtwork";

const entry = getEditorialV2StorybookEntry("L01-S01");

const meta = {
  title: "Editorial V2/Components/Artwork",
  component: EditorialArtwork,
  decorators: [withEditorialV2],
  args: {
    asset: entry.artwork,
    variant: "hero",
  },
} satisfies Meta<typeof EditorialArtwork>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StoryHero: Story = {};

export const SolutionHeader: Story = {
  args: { variant: "solution" },
};

export const CatalogCrop: Story = {
  args: { variant: "index" },
};
