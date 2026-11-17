import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import App, { preloadRoute } from "./App.tsx";
import "./index.css";

/*
 * The prerendered HTML for this URL is already on screen. Load the page's chunk
 * before mounting, so React replaces it with the same page instead of a loader.
 */
preloadRoute(window.location.pathname).finally(() => {
  createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
});
