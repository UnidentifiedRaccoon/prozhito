import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditorialV2Shell } from "./EditorialV2Shell";
import previewStyles from "./EditorialV2Shell.stories.module.css";

const meta = {
  title: "Editorial V2/Components/Shell",
  component: EditorialV2Shell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Оболочка самостоятельного приложения: skip-link, документный title, управление фокусом и минимальная шапка без переключателей версий или экранов.",
      },
    },
  },
  args: {
    compensateLegacyRootPadding: false,
    pageTitle: "Первый месяц",
    routeKey: "storybook-shell",
    children: (
      <div className={previewStyles.content}>
        <h1>Рабочая область</h1>
        <p>Почти белый холст полностью изолирован от архивной темы.</p>
      </div>
    ),
  },
} satisfies Meta<typeof EditorialV2Shell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Catalog: Story = {};

export const Section: Story = {
  args: {
    pageTitle: "Деньги к нужной дате · История",
    routeKey: "storybook-shell-section",
    showMasthead: false,
    children: (
      <div className={previewStyles.content}>
        <h1>Деньги к нужной дате</h1>
        <p>На экранах Section верхняя навигация находится внутри обложки; повторного masthead нет.</p>
      </div>
    ),
  },
};
