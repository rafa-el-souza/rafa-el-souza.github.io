import { expect, test } from "vitest";

import { COPY } from "./copy.ts";
import { EMAIL, LANGUAGE_SEPARATOR, LANGUAGES } from "./site.ts";

/** A value's shape: its keys, nested and sorted, and the length of its lists. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, shape(item)]),
    );
  }
  return typeof value;
}

/** Every string of a value, with the path of its key. */
function strings(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([key, item]) =>
      strings(item, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

test("FR-11 the three languages hold the same keys, nested, and lists of the same length", () => {
  for (const language of LANGUAGES) {
    expect(shape(COPY[language]), language).toEqual(shape(COPY.pt));
  }
});

test("FR-11 no string of any language is empty or padded", () => {
  for (const language of LANGUAGES) {
    for (const [key, value] of strings(COPY[language])) {
      expect(value, `${language} ${key}`).not.toBe("");
      expect(value, `${language} ${key}`).toBe(value.trim());
    }
  }
});

test("FR-24 every page names the three languages the same way, each in its own, in one order", () => {
  for (const language of LANGUAGES) {
    expect(COPY[language].languages, language).toBe(COPY.pt.languages);
    expect(
      COPY[language].languages.split(LANGUAGE_SEPARATOR),
      language,
    ).toHaveLength(LANGUAGES.length);
  }
});

test("FR-24 the e-mail link shows the address it writes to", () => {
  for (const language of LANGUAGES) {
    expect(COPY[language].links.email, language).toBe(EMAIL);
  }
});
