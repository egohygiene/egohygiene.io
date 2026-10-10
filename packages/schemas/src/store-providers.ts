import { z } from "zod";

export const STORE_PROVIDERS_SCHEMA_VERSION = 1;

export const storeProviderIdSchema = z.enum([
  "fourthwall", "printify", "lulu", "stripe", "square", "plaid", "contrado",
]);

export const storeProviderCapabilitySchema = z.enum([
  "hosted-checkout", "physical-fulfillment", "payment-processing", "bank-linking",
]);

export const storeProviderRoleSchema = z.enum([
  "commerce-and-fulfillment", "fulfillment", "payments", "banking",
]);

export const storeProviderFundingSchema = z.enum([
  "deducted-from-sale", "merchant-funded", "not-applicable", "unverified",
]);

const text = z.string().trim().min(1);

/** Research/configuration only: no entry can activate a network integration. */
export const storeProviderPlaceholderSchema = z.strictObject({
  id: z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)+$/),
  provider: storeProviderIdSchema,
  label: text,
  role: storeProviderRoleSchema,
  capabilities: z.array(storeProviderCapabilitySchema).min(1),
  status: z.literal("placeholder"),
  enabled: z.literal(false),
  orderFunding: storeProviderFundingSchema,
  notes: text,
  reviewedAt: z.iso.date(),
  sources: z.array(z.strictObject({
    title: text,
    url: z.url({ protocol: /^https$/ }),
  })).min(1),
}).superRefine((entry, context) => {
  const capabilities = new Set(entry.capabilities);
  const issue = (path: string, message: string) => context.addIssue({ code: "custom", path: [path], message });
  if (capabilities.size !== entry.capabilities.length) {
    issue("capabilities", "Duplicate capabilities are not allowed");
  }
  const allowed = {
    "commerce-and-fulfillment": ["hosted-checkout", "physical-fulfillment", "payment-processing"],
    fulfillment: ["physical-fulfillment"],
    payments: ["hosted-checkout", "payment-processing"],
    banking: ["bank-linking"],
  } as const;
  if (entry.capabilities.some((capability) => !(allowed[entry.role] as readonly string[]).includes(capability))) {
    issue("capabilities", "Capabilities do not match the provider role");
  }
  const required = {
    "commerce-and-fulfillment": ["hosted-checkout", "physical-fulfillment"],
    fulfillment: ["physical-fulfillment"],
    payments: ["payment-processing"],
    banking: ["bank-linking"],
  } as const;
  if (required[entry.role].some((capability) => !capabilities.has(capability))) {
    issue("capabilities", "Missing capabilities required by the provider role");
  }
  const fulfillsOrders = capabilities.has("physical-fulfillment");
  if (fulfillsOrders && entry.orderFunding === "not-applicable") {
    issue("orderFunding", "Physical fulfillment needs an explicit order funding model");
  }
  if (!fulfillsOrders && entry.orderFunding !== "not-applicable") {
    issue("orderFunding", "Payment and banking infrastructure do not fund physical fulfillment");
  }
  if (entry.orderFunding === "deducted-from-sale" && !capabilities.has("hosted-checkout")) {
    issue("orderFunding", "Deductions from customer payments require a hosted commerce channel");
  }
});

export const storeProvidersSchema = z.strictObject({
  schemaVersion: z.literal(STORE_PROVIDERS_SCHEMA_VERSION),
  providers: z.array(storeProviderPlaceholderSchema).min(1),
}).superRefine((manifest, context) => {
  const ids = new Set<string>();
  manifest.providers.forEach((entry, index) => {
    if (ids.has(entry.id)) {
      context.addIssue({ code: "custom", path: ["providers", index, "id"], message: `Duplicate channel ID ${entry.id}` });
    }
    ids.add(entry.id);
  });
});

export type StoreProviderId = z.infer<typeof storeProviderIdSchema>;
export type StoreProviderCapability = z.infer<typeof storeProviderCapabilitySchema>;
export type StoreProviderPlaceholder = z.infer<typeof storeProviderPlaceholderSchema>;
export type StoreProviders = z.infer<typeof storeProvidersSchema>;

/** Parse public planning metadata without creating clients, reading secrets, or making requests. */
export function parseStoreProviders(input: unknown, source = "providers.json"): StoreProviders {
  const result = storeProvidersSchema.safeParse(input);
  if (!result.success) {
    throw new Error(`Store providers validation failed:\n${result.error.issues
      .map((issue) => `- ${source}:${issue.path.join(".") || "$"}: ${issue.message}`)
      .join("\n")}`);
  }
  return result.data;
}
