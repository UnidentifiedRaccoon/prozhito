import { useEffect, useRef, type ReactNode } from "react";
import { catalogHref } from "../router";

interface AppShellProps {
  children: ReactNode;
  routeKey: string;
  pageTitle: string;
  className?: string;
  masthead?: "default" | "hidden";
}

export function AppShell({
  children,
  routeKey,
  pageTitle,
  className = "",
  masthead = "default",
}: AppShellProps) {
  const mainRef = useRef<HTMLElement>(null);
  const isMastheadHidden = masthead === "hidden";

  useEffect(() => {
    document.title = pageTitle === "Прожито" ? pageTitle : `${pageTitle} — Прожито`;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    mainRef.current?.focus({ preventScroll: true });
  }, [pageTitle, routeKey]);

  function focusMain(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    mainRef.current?.focus();
  }

  return (
    <>
      <a
        className="skip-link"
        href={window.location.hash || "#/"}
        onClick={focusMain}
      >
        К содержанию
      </a>
      <div
        className={`app-frame ${isMastheadHidden ? "app-frame--immersive" : ""}`.trim()}
      >
        {isMastheadHidden ? null : (
          <header className="masthead">
            {routeKey === "catalog" ? (
              <span className="masthead-spacer" aria-hidden="true" />
            ) : (
              <a
                className="masthead-catalog"
                href={catalogHref}
                aria-label="К каталогу историй"
              >
                <svg
                  className="masthead-index-icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 7h10M9 12h10M9 17h10M5 7h.01M5 12h.01M5 17h.01" />
                </svg>
              </a>
            )}
            {routeKey === "catalog" ? (
              <h1 className="masthead-brand">Прожито</h1>
            ) : (
              <a
                className="masthead-brand masthead-brand-link"
                href={catalogHref}
              >
                Прожито
              </a>
            )}
            <span className="masthead-spacer" aria-hidden="true" />
          </header>
        )}
        <main
          className={`page ${isMastheadHidden ? "page--immersive" : ""} ${className}`.trim()}
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </>
  );
}
