import { useSyncExternalStore } from "react";

const noSubscription = () => () => undefined;
const browserSnapshot = () => true;
const serverSnapshot = () => false;

/**
 * Static HTML and its first hydration share the source/default state. Browser-only
 * preferences and URL controls become available immediately after hydration;
 * ordinary client renders can use them on their first render.
 */
export function useBrowserSnapshot(): boolean {
  return useSyncExternalStore(noSubscription, browserSnapshot, serverSnapshot);
}
