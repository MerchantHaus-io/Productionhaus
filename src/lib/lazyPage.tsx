import { lazy, useState, type ComponentType } from "react";

/**
 * Route-level code splitting that doesn't flash a loader.
 *
 * `lazyPage(() => import("./pages/X"))` behaves like React.lazy, plus:
 *  - `preload()` starts the download early (on link hover/focus, or before the
 *    first render in main.tsx). Once loaded, the page renders directly instead
 *    of through React.lazy, so it never suspends, not even for one frame.
 *  - In-flight downloads are counted, so <RouteProgress /> can show a progress
 *    bar while anything is loading.
 *  - If a chunk fails to load because a new deploy replaced its hashed file,
 *    the page reloads once to pick up the new build instead of showing an error.
 */

type PageModule = { default: ComponentType };

export type LazyPage = ComponentType & { preload: () => Promise<PageModule> };

/* ---- Loading counter for the progress bar ---- */

let pending = 0;
const listeners = new Set<() => void>();
const setPending = (delta: number) => {
  pending += delta;
  listeners.forEach((listener) => listener());
};
export const pageLoading = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  isLoading: () => pending > 0,
};

/* ---- Stale-chunk recovery ---- */

const RELOAD_KEY = "lazy-page-reloaded-at";

const isChunkLoadError = (error: unknown) =>
  error instanceof Error &&
  /dynamically imported module|Importing a module script failed|Failed to fetch|error loading dynamically imported/i.test(
    error.message,
  );

const reloadOnce = (error: unknown): Promise<never> => {
  if (typeof window === "undefined" || !isChunkLoadError(error)) throw error;
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    // Reloaded in the last 10 seconds and still failing: it isn't a stale deploy.
    if (Date.now() - last < 10_000) throw error;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch (storageError) {
    if (storageError === error) throw error;
    // Storage unavailable: reload anyway; a second failure reaches the error boundary.
  }
  window.location.reload();
  return new Promise<never>(() => {});
};

export function lazyPage(factory: () => Promise<PageModule>): LazyPage {
  let loaded: ComponentType | null = null;
  let promise: Promise<PageModule> | null = null;

  const preload = () => {
    if (!promise) {
      setPending(1);
      promise = factory()
        .then((module) => {
          loaded = module.default;
          return module;
        })
        .catch((error) => {
          promise = null;
          return reloadOnce(error);
        })
        .finally(() => setPending(-1));
    }
    return promise;
  };

  const Lazy = lazy(preload);
  const Page = () => {
    // Fixed for the life of this mount, so a page first shown through React.lazy
    // isn't remounted when a later render finds the module already loaded.
    const [Component] = useState<ComponentType>(() => loaded ?? Lazy);
    return <Component />;
  };
  return Object.assign(Page, { preload });
}

export const isLazyPage = (type: unknown): type is LazyPage =>
  typeof type === "function" && typeof (type as Partial<LazyPage>).preload === "function";
