import { type CSSProperties, useSyncExternalStore } from "react";

const motionQuery = "(prefers-reduced-motion: no-preference)";

function subscribeToMotionPreference(onChange: () => void) {
  const preference = window.matchMedia?.(motionQuery);
  preference?.addEventListener?.("change", onChange);
  return () => preference?.removeEventListener?.("change", onChange);
}

function canAnimate() {
  return (
    typeof document.startViewTransition === "function" &&
    window.matchMedia?.(motionQuery).matches === true
  );
}

/** Match the static markup on hydration, then respect the live device preference. */
export function useProductViewTransition() {
  return useSyncExternalStore(subscribeToMotionPreference, canAnimate, () => false);
}

type ProductArtworkStyle = CSSProperties & { "--store-product-art-name": string };

export function productArtworkStyle(slug: string): ProductArtworkStyle {
  return { "--store-product-art-name": `store-product-art-${slug}` };
}
