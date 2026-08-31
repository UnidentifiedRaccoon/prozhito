import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CloudApp from "./CloudApp";
import { editorialV2CatalogHref } from "../editorial-v2/routing";
import "../../styles.css";

// Only the bare cloud entry defaults to editorial. Explicit archive/deep links
// keep their existing routes; replace avoids an extra Back step or archive flash.
if (!window.location.hash) {
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.search}${editorialV2CatalogHref}`,
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><CloudApp/></StrictMode>);
