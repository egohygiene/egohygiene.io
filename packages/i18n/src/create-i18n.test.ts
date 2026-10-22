import { describe, expect, it } from "vitest";

import { createTranslator, getMessage, type I18nMessages } from "./create-i18n";

const messages: I18nMessages = {
  greeting: "Hello",
  empty: "",
  navigation: {
    community: {
      title: "Community store",
    },
  },
};

describe("getMessage", () => {
  it("resolves top-level and arbitrarily nested string leaves", () => {
    expect(getMessage(messages, "greeting")).toBe("Hello");
    expect(getMessage(messages, "navigation.community.title")).toBe("Community store");
    expect(getMessage(messages, "empty")).toBe("");
  });

  it.each(["missing", "missing.child", "navigation.missing", "navigation.community.missing.child"])(
    "returns the complete requested key when %s is missing",
    (key) => {
      expect(getMessage(messages, key)).toBe(key);
    },
  );

  it.each(["navigation", "navigation.community"])(
    "returns the requested key for namespace %s rather than an object",
    (key) => {
      expect(getMessage(messages, key)).toBe(key);
    },
  );

  it.each(["greeting.child", "greeting.length", "greeting.0", "empty.child"])(
    "does not treat string leaf %s as another namespace",
    (key) => {
      expect(getMessage(messages, key)).toBe(key);
    },
  );

  it.each(["toString", "constructor", "__proto__", "navigation.constructor.name"])(
    "does not expose inherited property %s",
    (key) => {
      expect(getMessage(messages, key)).toBe(key);
    },
  );

  it("ignores translated strings inherited from a custom prototype", () => {
    const inheritedMessages: I18nMessages = Object.create({ greeting: "Inherited" });

    expect(getMessage(inheritedMessages, "greeting")).toBe("greeting");
  });

  it("allows an explicitly supplied own key that shares a prototype member name", () => {
    const ownMessages: I18nMessages = Object.fromEntries([
      ["constructor", "A supplied message"],
      ["__proto__", "Another supplied message"],
    ]);

    expect(getMessage(ownMessages, "constructor")).toBe("A supplied message");
    expect(getMessage(ownMessages, "__proto__")).toBe("Another supplied message");
  });
});

describe("createTranslator", () => {
  it("falls back at string leaves without mistaking an empty or key-equal translation for a miss", () => {
    const t = createTranslator({
      locale: "fr",
      messages: { greeting: "greeting", empty: "", nested: {} },
      fallbacks: [
        {
          locale: "en",
          messages: { greeting: "Hello", empty: "Not empty", nested: { title: "Title" } },
        },
      ],
    });

    expect(t("greeting")).toBe("greeting");
    expect(t("empty")).toBe("");
    expect(t("nested.title")).toBe("Title");
    expect(t("nested")).toBe("nested");
    expect(t("missing.child")).toBe("missing.child");
    expect(t("toString")).toBe("toString");
  });

  it("respects the supplied fallback order", () => {
    const t = createTranslator({
      locale: "fr-CA",
      messages: {},
      fallbacks: [
        { locale: "fr", messages: { greeting: "Bonjour" } },
        { locale: "en", messages: { greeting: "Hello", missing: "Source" } },
      ],
    });
    expect(t("greeting")).toBe("Bonjour");
    expect(t("missing")).toBe("Source");
  });

  it("interpolates repeated own parameters as plain text and leaves missing placeholders visible", () => {
    const t = createTranslator({
      locale: "en",
      messages: { greeting: "{{ name }} / {{name}} / {{missing}} / {{constructor}} / {{amount}}" },
    });
    const parameters = { name: "<b>$&</b>", amount: 12 };
    expect(t("greeting", parameters)).toBe(
      "<b>$&</b> / <b>$&</b> / {{missing}} / {{constructor}} / 12",
    );
  });

  it("never interpolates inherited parameter values", () => {
    const t = createTranslator({ locale: "en", messages: { greeting: "{{name}} {{count}}" } });
    expect(t("greeting", Object.create({ name: "Inherited", count: 2 }))).toBe(
      "{{name}} {{count}}",
    );
  });

  it("uses cardinal suffixes for zero, one, two, few, many and other", () => {
    const t = createTranslator({
      locale: "ar",
      messages: {
        result_zero: "zero {{count}}",
        result_one: "one {{count}}",
        result_two: "two {{count}}",
        result_few: "few {{count}}",
        result_many: "many {{count}}",
        result_other: "other {{count}}",
      },
    });
    expect([0, 1, 2, 3, 11, 100].map((count) => t("result", { count }))).toEqual([
      "zero 0",
      "one 1",
      "two 2",
      "few 3",
      "many 11",
      "other 100",
    ]);
    expect(t("result")).toBe("result");
  });

  it("uses the fallback dictionary's grammar rather than the selected language's grammar", () => {
    const t = createTranslator({
      locale: "fr",
      messages: {},
      fallbacks: [
        {
          locale: "en",
          messages: { result_one: "{{count}} result", result_other: "{{count}} results" },
        },
      ],
    });
    // French treats zero as 'one'; the English fallback must still say 'results'.
    expect(t("result", { count: 0 })).toBe("0 results");
    expect(t("result", { count: 1 })).toBe("1 result");
    expect(t("result", { count: 2 })).toBe("2 results");
  });

  it("tries a local other form, then plain text, before the next dictionary", () => {
    const t = createTranslator({
      locale: "ar",
      messages: { result_other: "local {{count}}", plain: "plain {{count}}" },
      fallbacks: [{ locale: "en", messages: { result_one: "fallback", plain_other: "fallback" } }],
    });
    expect(t("result", { count: 1 })).toBe("local 1");
    expect(t("plain", { count: 3 })).toBe("plain 3");
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, "2"])(
    "rejects a non-finite or non-numeric plural count %s",
    (count) => {
      const t = createTranslator({ locale: "en", messages: { result: "{{count}}" } });
      expect(() => t("result", { count })).toThrow("Translation count must be a finite number.");
    },
  );

  it("rejects malformed dictionary locales at configuration time", () => {
    expect(() => createTranslator({ locale: "not_a_locale", messages: {} })).toThrow(
      "Invalid locale identifier",
    );
    expect(() =>
      createTranslator({ locale: "en", messages: {}, fallbacks: [{ locale: "", messages: {} }] }),
    ).toThrow("Invalid locale identifier");
  });
});
