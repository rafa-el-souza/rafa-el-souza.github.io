import { COPY } from "../content/copy.ts";
import { LOCALES } from "../content/site.ts";
import { STYLESHEET, headStart } from "./head.ts";
import { escape } from "./html.ts";
import { languageLinks } from "./sober.ts";

/**
 * The page GitHub Pages serves at any unknown path (FR-21), in its first,
 * minimal form: the name and the links to the three roots, from the sober
 * page's copy alone. The host serves it at any depth, so its links start
 * from the root, and so does its stylesheet (vite.config.ts).
 */
export function notFoundPage(): string {
  const { name } = COPY.pt;
  return `<!doctype html>
<html lang="${LOCALES.pt.lang}">
  <head>
    ${headStart()}
    <title>${escape(name)}</title>
    <link rel="stylesheet" href="${STYLESHEET}" />
  </head>
  <body>
    <main>
      <h1>${escape(name)}</h1>
      <nav>${languageLinks((language) => LOCALES[language].path)}</nav>
    </main>
  </body>
</html>
`;
}
