import { z } from "zod";

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
