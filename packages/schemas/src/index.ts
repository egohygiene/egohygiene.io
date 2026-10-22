import { z } from "zod";

export * from "./store.ts";
export * from "./store-readiness.ts";
export * from "./store-localization.ts";
export * from "./store-migrations.ts";
export * from "./store-providers.ts";
export * from "./storefront-curation.ts";

export const productStatusSchema = z.enum(["available", "development", "planned"]);
export const productCategorySchema = z.enum([
  "knowledge",
  "engineering",
  "creative",
  "platform",
  "commerce",
]);

export const packageDispositionSchema = z.enum([
  "implemented",
  "minimally implemented",
  "consolidated",
  "deferred but valid",
  "removed",
]);
