import { COPY } from "../src/content/copy.ts";
import {
  LANGUAGES,
  LANGUAGE_SEPARATOR,
  LOCALES,
  type Language,
} from "../src/content/site.ts";

/** A language's root, relative to the server under test. */
export function root(language: Language): string {
  return `.${LOCALES[language].path}`;
}

/** The name of each language's link, as every page writes it. */
export const LANGUAGE_NAMES = Object.fromEntries(
  COPY.pt.languages
    .split(LANGUAGE_SEPARATOR)
    .map((name, index) => [LANGUAGES[index], name]),
) as Record<Language, string>;

/** A path no page has, a few directories deep. */
export const UNKNOWN_PATH = "./no/such/page";

/** Every page a visitor can reach: the three roots and the page of an unknown path. */
export const WALK = [...LANGUAGES.map(root), UNKNOWN_PATH];
