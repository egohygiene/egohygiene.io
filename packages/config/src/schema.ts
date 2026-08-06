import { z } from "zod";

export const browserEnvironmentSchema = z.object({
  VITE_SITE_URL: z.url().default("https://egohygiene.io"),
  VITE_SITE_NAME: z.string().trim().min(1).default("Ego Hygiene"),
});

export type BrowserEnvironment = z.infer<typeof browserEnvironmentSchema>;
