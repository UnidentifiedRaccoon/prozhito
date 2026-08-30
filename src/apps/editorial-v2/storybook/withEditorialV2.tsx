import type { Decorator } from "@storybook/react-vite";
import { EditorialTheme } from "../foundation/EditorialTheme";
import styles from "./withEditorialV2.module.css";

export const withEditorialV2: Decorator = (Story) => (
  <EditorialTheme className={styles.preview}>
    <Story />
  </EditorialTheme>
);
