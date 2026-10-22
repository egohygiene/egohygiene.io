import { createHash } from "node:crypto";

const pluralSuffix = /_(zero|one|two|few|many|other)$/;
const segmentPattern = /^[A-Za-z_][A-Za-z0-9_-]*$/;

export interface CatalogMessage {
  readonly key: string;
  readonly text: string;
  readonly placeholders: readonly string[];
  readonly family: string | undefined;
}

export interface MessageCatalog {
  readonly locale: string;
  readonly formatLocale: string;
  readonly namespaces: readonly string[];
  readonly groups: readonly string[];
  readonly messages: ReadonlyMap<string, CatalogMessage>;
  readonly pluralCategories: readonly string[];
}

function fail(message: string): never {
  throw new Error(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

/** Match the runtime's named tokens; braces are reserved for this syntax. */
export function getPlaceholders(text: string, key: string): readonly string[] {
  const names = new Set<string>();
  const remaining = text.replace(/\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g, (_, name: string) => {
    names.add(name);
    return "";
  });
  if (/[{}]/.test(remaining)) fail(`${key}: malformed interpolation; use {{name}} tokens.`);
  return [...names].sort();
}

function parseMessage(
  text: string,
  key: string,
  formatLocale: string,
  categories: readonly string[],
): CatalogMessage {
  const suffix = key.match(pluralSuffix);
  const family = suffix ? key.slice(0, -suffix[0].length) : undefined;
  if (suffix && !categories.includes(suffix[1] as string)) {
    fail(`${key}: plural category ${suffix[1]} is not used by ${formatLocale}.`);
  }
  return { key, text, placeholders: getPlaceholders(text, key), family };
}

function checkPluralFamilies(messages: ReadonlyMap<string, CatalogMessage>): void {
  for (const message of messages.values()) {
    if (message.family === undefined) continue;
    const other = messages.get(`${message.family}_other`);
    if (!other) fail(`${message.family}: a plural family must include _other.`);
    if (JSON.stringify(message.placeholders) !== JSON.stringify(other.placeholders)) {
      fail(`${message.key}: plural family placeholders must match _other.`);
    }
  }
}

export function parseCatalog({
  locale,
  formatLocale = locale,
  namespaces,
  source = false,
}: {
  readonly locale: string;
  readonly formatLocale?: string;
  readonly namespaces: Readonly<Record<string, unknown>>;
  readonly source?: boolean;
}): MessageCatalog {
  const canonicalLocale = Intl.getCanonicalLocales(locale)[0];
  const canonicalFormat = Intl.getCanonicalLocales(formatLocale)[0];
  if (canonicalLocale !== locale || canonicalFormat !== formatLocale) {
    fail("Locale and formatting locale must use canonical IDs.");
  }
  if (Intl.PluralRules.supportedLocalesOf([formatLocale]).length !== 1) {
    fail(`${formatLocale}: unsupported formatting locale.`);
  }
  const pluralCategories = new Intl.PluralRules(formatLocale)
    .resolvedOptions()
    .pluralCategories.sort();
  const messages = new Map<string, CatalogMessage>();
  const groups: string[] = [];
  const namespaceNames = Object.keys(namespaces).sort();
  if (source && namespaceNames.length === 0) fail("Source catalog has no namespaces.");

  function visit(value: unknown, key: string): void {
    if (typeof value === "string") {
      messages.set(key, parseMessage(value, key, formatLocale, pluralCategories));
      return;
    }
    if (!isRecord(value)) fail(`${key}: messages must be strings or nested objects.`);
    groups.push(key);
    const children = Object.keys(value).sort();
    if (source && children.length === 0) fail(`${key}: empty source message group.`);
    for (const child of children) {
      if (!segmentPattern.test(child)) fail(`${key}: invalid message key segment ${child}.`);
      visit(value[child], `${key}.${child}`);
    }
  }

  for (const name of namespaceNames) {
    if (!segmentPattern.test(name)) fail(`Invalid namespace ${name}.`);
    if (!isRecord(namespaces[name])) fail(`${name}: namespace must be an object.`);
    visit(namespaces[name], name);
  }
  checkPluralFamilies(messages);
  return { locale, formatLocale, namespaces: namespaceNames, groups, messages, pluralCategories };
}

/** Bind every source form, so changing _one also invalidates a translated _few review. */
function sourceHash(source: MessageCatalog, message: CatalogMessage): string {
  const forms =
    message.family === undefined
      ? [message]
      : [...source.messages.values()].filter((entry) => entry.family === message.family);
  return hash(forms.map(({ key, text }) => [key, text]));
}

export function sourceInventory(source: MessageCatalog) {
  const messages = [...source.messages.values()].map((message) => ({
    key: message.key,
    text: message.text,
    placeholders: message.placeholders,
    sourceHash: sourceHash(source, message),
  }));
  return {
    version: 1,
    sourceLocale: source.locale,
    formatLocale: source.formatLocale,
    namespaces: source.namespaces,
    sourceHash: hash(messages.map(({ key, sourceHash: digest }) => [key, digest])),
    messages,
  };
}

export interface TranslationReviewInput {
  readonly key: string;
  readonly sourceHash: string;
  readonly translationHash: string;
}

export function checkTranslation(source: MessageCatalog, translated: MessageCatalog) {
  for (const name of translated.namespaces) {
    if (!source.namespaces.includes(name)) fail(`${name}: unknown translated namespace.`);
  }
  for (const group of translated.groups) {
    if (!source.groups.includes(group)) fail(`${group}: unknown translated message group.`);
  }
  const reviewInputs: TranslationReviewInput[] = [];
  for (const message of translated.messages.values()) {
    const reference =
      message.family === undefined
        ? source.messages.get(message.key)
        : source.messages.get(`${message.family}_other`);
    if (!reference || message.family !== reference.family) {
      fail(`${message.key}: unknown translated message.`);
    }
    if (JSON.stringify(message.placeholders) !== JSON.stringify(reference.placeholders)) {
      fail(
        `${message.key}: placeholders must match source (${reference.placeholders.join(", ")}).`,
      );
    }
    reviewInputs.push({
      key: message.key,
      sourceHash: sourceHash(source, reference),
      translationHash: hash([message.key, message.text]),
    });
  }
  const sourceFallback = [
    ...new Set(
      [...source.messages.values()].flatMap((message) => {
        const key = message.family ?? message.key;
        const translatedKey = message.family === undefined ? key : `${key}_other`;
        return translated.messages.has(translatedKey) || translated.messages.has(key) ? [] : [key];
      }),
    ),
  ].sort();
  const pluralBaseFallback = [
    ...new Set(
      [...source.messages.values()].flatMap((message) =>
        message.family !== undefined &&
        !translated.messages.has(`${message.family}_other`) &&
        translated.messages.has(message.family)
          ? [message.family]
          : [],
      ),
    ),
  ].sort();
  const pluralCategoryFallback = [
    ...new Set(
      [...translated.messages.values()].flatMap((message) =>
        message.family === undefined ? [] : [message.family],
      ),
    ),
  ]
    .sort()
    .flatMap((family) =>
      translated.pluralCategories
        .filter((category) => !translated.messages.has(`${family}_${category}`))
        .map((category) => ({ key: `${family}_${category}`, fallback: `${family}_other` })),
    );
  return {
    locale: translated.locale,
    formatLocale: translated.formatLocale,
    sourceFallback,
    pluralCategoryFallback,
    pluralBaseFallback,
    reviewInputs,
  };
}

/** Validate a human-authored record; never create an approval from a successful check. */
export function checkReview({
  source,
  translated,
  review,
  requireReview = false,
}: {
  readonly source: MessageCatalog;
  readonly translated: MessageCatalog;
  readonly review?: unknown;
  readonly requireReview?: boolean;
}) {
  const report = checkTranslation(source, translated);
  if (review === undefined) {
    if (requireReview) fail(`${translated.locale}: human review metadata is required.`);
    return { ...report, reviewStatus: "not-reviewed" as const };
  }
  const {
    version,
    locale,
    sourceLocale,
    formatLocale,
    messages: records,
  } = isRecord(review) ? review : {};
  if (
    version !== 1 ||
    locale !== translated.locale ||
    sourceLocale !== source.locale ||
    formatLocale !== translated.formatLocale ||
    !isRecord(records)
  ) {
    fail(`${translated.locale}: invalid review header or messages.`);
  }
  const expected = new Set(report.reviewInputs.map(({ key }) => key));
  for (const key of Object.keys(records)) {
    if (!expected.has(key)) fail(`${key}: review has no corresponding translated message.`);
  }
  for (const input of report.reviewInputs) {
    checkApproval(input, Object.hasOwn(records, input.key) ? records[input.key] : undefined);
  }
  return { ...report, reviewStatus: "review-records-current" as const };
}

function checkApproval(input: TranslationReviewInput, record: unknown): void {
  const {
    status,
    reviewedBy,
    reviewedAt,
    sourceHash: reviewedSource,
    translationHash,
  } = isRecord(record) ? record : {};
  if (
    status !== "approved" ||
    typeof reviewedBy !== "string" ||
    reviewedBy.trim() === "" ||
    !isReviewDate(reviewedAt)
  ) {
    fail(`${input.key}: explicit human approval, reviewer and valid review date are required.`);
  }
  if (reviewedSource !== input.sourceHash) fail(`${input.key}: stale source review.`);
  if (translationHash !== input.translationHash) fail(`${input.key}: stale translation review.`);
}

function isReviewDate(value: unknown): boolean {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
