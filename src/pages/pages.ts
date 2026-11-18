import { LANGUAGES, LOCALES } from "../content/site.ts";
import { notFoundPage } from "./not-found.ts";
import { soberPage } from "./sober.ts";

/** Every page of the site, by its file in the build, with the template that writes it (docs/design.md §6.2). */
export const PAGES: Readonly<Record<string, () => string>> = {
  ...Object.fromEntries(
    LANGUAGES.map((language) => [
      `${LOCALES[language].path.slice(1)}index.html`,
      () => soberPage(language),
    ]),
  ),
  "404.html": notFoundPage,
};
