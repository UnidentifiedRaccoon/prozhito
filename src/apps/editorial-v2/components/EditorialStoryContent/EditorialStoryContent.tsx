import Markdown from "react-markdown";
import styles from "./EditorialStoryContent.module.css";

export interface EditorialStoryContentProps {
  ariaLabel: string;
  markdown: string;
}

export function EditorialStoryContent({
  ariaLabel,
  markdown,
}: EditorialStoryContentProps) {
  return (
    <section aria-label={ariaLabel} className={styles.layout}>
      <div className={styles.copy}>
        <Markdown skipHtml>{markdown}</Markdown>
      </div>
    </section>
  );
}
