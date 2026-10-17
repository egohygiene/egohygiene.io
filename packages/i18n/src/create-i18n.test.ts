import { describe, expect, it } from "vitest";

import { getMessage, type I18nMessages } from "./create-i18n";

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
