import {
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { EditorialTheme } from "../../foundation/EditorialTheme";
import { editorialV2CatalogHref } from "../../routing";
import { EditorialMasthead } from "../EditorialMasthead/EditorialMasthead";
import styles from "./EditorialV2Shell.module.css";

export interface EditorialV2ShellProps {
  children: ReactNode;
  pageTitle: string;
  routeKey: string;
  compensateLegacyRootPadding?: boolean;
  showMasthead?: boolean;
}

export function EditorialV2Shell({
  children,
  pageTitle,
  routeKey,
  compensateLegacyRootPadding = true,
  showMasthead = true,
}: EditorialV2ShellProps) {
  const mainRef = useRef<HTMLElement>(null);
  const skipHref =
    typeof window === "undefined"
      ? editorialV2CatalogHref
      : window.location.hash || editorialV2CatalogHref;

  useEffect(() => {
    document.title = `${pageTitle} — Прожито`;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    mainRef.current?.focus({ preventScroll: true });
  }, [pageTitle, routeKey]);

  function focusMain(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const target = mainRef.current?.querySelector<HTMLElement>("[data-editorial-reading]") ?? mainRef.current;
    target?.focus();
    target?.scrollIntoView({ block: "start" });
  }

  return (
    <EditorialTheme
      className={compensateLegacyRootPadding ? styles.appViewport : ""}
    >
      <a
        className={styles.skipLink}
        href={skipHref}
        onClick={focusMain}
      >
        К содержанию
      </a>
      {showMasthead && <EditorialMasthead />}
      <main
        className={styles.main}
        id="editorial-v2-main"
        ref={mainRef}
        tabIndex={-1}
      >
        {children}
      </main>
    </EditorialTheme>
  );
}
