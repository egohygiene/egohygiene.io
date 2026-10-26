import { z } from "zod";

export const storeReferenceIdSchema = z
  .string()
  .regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)+$/, "Use a stable lowercase hyphenated ID");
const text = z.string().trim().min(1);

/** Content language does not select an Intl formatting locale or enable a public language. */
export const storeContentLocaleSchema = z.string().refine((value) => {
  try {
    return Intl.getCanonicalLocales(value)[0] === value;
  } catch {
    return false;
  }
}, "Use a canonical BCP 47 locale ID");

const reviewDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  }, "Use a valid calendar date in YYYY-MM-DD form");

export const storeTranslationReviewSchema = z.discriminatedUnion("status", [
  z.strictObject({ status: z.literal("draft") }),
  z.strictObject({
    status: z.literal("reviewed"),
    locale: storeContentLocaleSchema,
    reviewedBy: z
      .string()
      .regex(
        /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/,
        "Use a public-safe reviewer ID, not private contact details",
      ),
    reviewedAt: reviewDate,
    source: z.strictObject({
      locale: storeContentLocaleSchema,
      value: text,
      artworkRevision: z.number().int().positive().optional(),
      variantId: storeReferenceIdSchema.optional(),
    }),
    value: text,
  }),
]);

export const storeTranslatedTextSchema = z.strictObject({
  value: text,
  review: storeTranslationReviewSchema,
});

export const storeTranslationSchema = z.strictObject({
  locale: storeContentLocaleSchema,
  fields: z
    .strictObject({
      title: storeTranslatedTextSchema.optional(),
      description: storeTranslatedTextSchema.optional(),
      artworkAlt: storeTranslatedTextSchema.optional(),
      artworkLabel: storeTranslatedTextSchema.optional(),
      unavailableReason: storeTranslatedTextSchema.optional(),
      variantLabels: z
        .array(storeTranslatedTextSchema.extend({ variantId: storeReferenceIdSchema }))
        .min(1)
        .optional(),
    })
    .refine(
      (fields) => Object.values(fields).some((value) => value !== undefined),
      "Provide at least one translated presentation field",
    ),
});

export const storeAttributionSchema = z.discriminatedUnion("status", [
  z.strictObject({ status: z.literal("unknown") }),
  z
    .strictObject({
      status: z.literal("declared"),
      creatorIds: z.array(storeReferenceIdSchema).default([]),
      rightsHolderIds: z.array(storeReferenceIdSchema).default([]),
    })
    .refine(
      (value) => value.creatorIds.length + value.rightsHolderIds.length > 0,
      "Declared attribution needs a creator or rights holder",
    ),
]);

export type StoreTranslation = z.infer<typeof storeTranslationSchema>;
export type StoreTranslatedText = z.infer<typeof storeTranslatedTextSchema>;
export type StoreAttribution = z.infer<typeof storeAttributionSchema>;
export type StoreTranslationReviewStatus = "draft" | "reviewed" | "stale";

const textFields = [
  "title",
  "description",
  "artworkAlt",
  "artworkLabel",
  "unavailableReason",
] as const;
type TextField = (typeof textFields)[number];
type Field = TextField | "variantLabels";

/** Structural source contract avoids a schema/runtime import cycle. */
interface LocalizableEntry {
  readonly kind: string;
  readonly title: string;
  readonly description: string;
  readonly sourceLocale: string;
  readonly translations: readonly StoreTranslation[];
  readonly artworkRevision?: number;
  readonly artwork?: { readonly kind: string; readonly alt?: string; readonly label?: string };
  readonly purchase?: {
    readonly state: string;
    readonly reason?: string;
    readonly variants?: readonly { readonly id: string; readonly label: string }[];
  };
}

interface FieldSource {
  readonly value: string;
  readonly artworkRevision?: number;
  readonly variantId?: string;
}

function fieldSource(
  entry: LocalizableEntry,
  field: Field,
  variantId?: string,
): FieldSource | undefined {
  if (field === "title" || field === "description") return { value: entry[field] };
  if (field === "artworkAlt" || field === "artworkLabel") {
    const kind = field === "artworkAlt" ? "image" : "placeholder";
    const value = field === "artworkAlt" ? entry.artwork?.alt : entry.artwork?.label;
    if (
      entry.kind !== "design" ||
      entry.artwork?.kind !== kind ||
      value === undefined ||
      entry.artworkRevision === undefined
    )
      return undefined;
    return { value, artworkRevision: entry.artworkRevision };
  }
  if (entry.kind !== "product") return undefined;
  if (field === "unavailableReason") {
    return entry.purchase?.state === "unavailable" && entry.purchase.reason !== undefined
      ? { value: entry.purchase.reason }
      : undefined;
  }
  const variant =
    entry.purchase?.state === "live"
      ? entry.purchase.variants?.find((candidate) => candidate.id === variantId)
      : undefined;
  return variant ? { value: variant.label, variantId: variant.id } : undefined;
}

function reviewStatus(
  entry: LocalizableEntry,
  locale: string,
  field: Field,
  value: StoreTranslatedText,
  variantId?: string,
): StoreTranslationReviewStatus {
  const review = value.review;
  if (review.status === "draft") return "draft";
  const source = fieldSource(entry, field, variantId);
  return source !== undefined &&
    review.locale === locale &&
    review.source.locale === entry.sourceLocale &&
    review.source.value === source.value &&
    review.source.artworkRevision === source.artworkRevision &&
    review.source.variantId === source.variantId &&
    review.value === value.value
    ? "reviewed"
    : "stale";
}

export interface StoreTranslationDiagnostic {
  readonly locale: string;
  readonly field: string;
  readonly status: StoreTranslationReviewStatus;
}

/** Staleness is a review result, not malformed data; stale text falls back at publication. */
export function inspectStoreTranslations(entry: LocalizableEntry): StoreTranslationDiagnostic[] {
  return entry.translations.flatMap((translation) => [
    ...textFields.flatMap((field) => {
      const value = translation.fields[field];
      return value
        ? [
            {
              locale: translation.locale,
              field,
              status: reviewStatus(entry, translation.locale, field, value),
            },
          ]
        : [];
    }),
    ...(translation.fields.variantLabels ?? []).map((value) => ({
      locale: translation.locale,
      field: `variantLabels.${value.variantId}`,
      status: reviewStatus(entry, translation.locale, "variantLabels", value, value.variantId),
    })),
  ]);
}

/** Field applicability and review shape errors remain fatal even on draft entries. */
export function validateStoreTranslations(entry: LocalizableEntry, source: string): string[] {
  const issues: string[] = [];
  const locales = new Set<string>();
  entry.translations.forEach((translation, index) => {
    const path = `${source}:translations.${index}`;
    if (translation.locale === entry.sourceLocale)
      issues.push(`${path}.locale: Translations must differ from the source locale`);
    if (locales.has(translation.locale))
      issues.push(`${path}.locale: Duplicate translation locale ${translation.locale}`);
    locales.add(translation.locale);
    const validateField = (field: Field, value: StoreTranslatedText, variantId?: string) => {
      const target = `${path}.fields.${field}${variantId === undefined ? "" : `.${variantId}`}`;
      if (fieldSource(entry, field, variantId) === undefined) {
        issues.push(`${target}: Field has no matching source content on this entry`);
      }
      if (value.review.status === "reviewed") {
        const artwork = field === "artworkAlt" || field === "artworkLabel";
        if (artwork !== (value.review.source.artworkRevision !== undefined)) {
          issues.push(
            `${target}.review.source.artworkRevision: Artwork fields require a revision; other fields must not include one`,
          );
        }
        if ((field === "variantLabels") !== (value.review.source.variantId !== undefined)) {
          issues.push(
            `${target}.review.source.variantId: Variant labels require a variant ID; other fields must not include one`,
          );
        }
      }
    };
    textFields.forEach((field) => {
      const value = translation.fields[field];
      if (value) validateField(field, value);
    });
    const variants = new Set<string>();
    for (const value of translation.fields.variantLabels ?? []) {
      if (variants.has(value.variantId))
        issues.push(`${path}.fields.variantLabels: Duplicate variant ${value.variantId}`);
      variants.add(value.variantId);
      validateField("variantLabels", value, value.variantId);
    }
  });
  return issues;
}

/** Keep only current reviewed fields; public-safe review bindings remain revalidatable. */
export function publicStoreTranslations(entry: LocalizableEntry): StoreTranslation[] {
  return entry.translations.flatMap((translation) => {
    const fields: StoreTranslation["fields"] = {};
    for (const field of textFields) {
      const value = translation.fields[field];
      if (value && reviewStatus(entry, translation.locale, field, value) === "reviewed")
        fields[field] = value;
    }
    const variants = translation.fields.variantLabels?.filter(
      (value) =>
        reviewStatus(entry, translation.locale, "variantLabels", value, value.variantId) ===
        "reviewed",
    );
    if (variants?.length) fields.variantLabels = variants;
    return Object.keys(fields).length ? [{ locale: translation.locale, fields }] : [];
  });
}
