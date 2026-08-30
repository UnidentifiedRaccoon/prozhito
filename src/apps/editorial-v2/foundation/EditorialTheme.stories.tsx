import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditorialTheme } from "./EditorialTheme";
import styles from "./EditorialTheme.stories.module.css";

function ThemeSpecimen() {
  const colors = [
    ["Холст", "#FCFCFB"],
    ["Рабочая область", "#F2F5F3"],
    ["Графит", "#202522"],
    ["Акцент", "#245D65"],
  ] as const;

  return (
    <EditorialTheme className={styles.specimen}>
      <p className={styles.kicker}>Editorial v2</p>
      <h1>Современная редакционная система</h1>
      <p className={styles.lead}>
        Тонкие линии, почти белый фон, открытая композиция и современная
        антиква без теней и скруглений.
      </p>
      <div className={styles.palette}>
        {colors.map(([label, color]) => (
          <div key={label}>
            <span style={{ background: color }} />
            <strong>{label}</strong>
            <small>{color}</small>
          </div>
        ))}
      </div>
    </EditorialTheme>
  );
}

const meta = {
  title: "Editorial V2/Foundation/Theme",
  component: ThemeSpecimen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Изолированная основа редакционной версии: префиксованные токены, современная антиква, почти белый холст и линии без теней и радиусов.",
      },
    },
  },
} satisfies Meta<typeof ThemeSpecimen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypographyAndPalette: Story = {};
