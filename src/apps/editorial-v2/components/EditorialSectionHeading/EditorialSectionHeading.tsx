import styles from "./EditorialSectionHeading.module.css";

export interface EditorialSectionHeadingProps {
  sectionNumber: number;
  title: string;
  view: "story" | "analysis";
}

export function EditorialSectionHeading({
  sectionNumber,
  title,
  view,
}: EditorialSectionHeadingProps) {
  return (
    <header className={styles.heading}>
      <p className={styles.eyebrow}>
        {view === "story" ? "История" : "Решение"}{" "}
        {String(sectionNumber).padStart(2, "0")}
      </p>
      <h1>{title}</h1>
    </header>
  );
}
