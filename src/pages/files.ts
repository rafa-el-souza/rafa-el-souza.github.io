import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  LOCALES,
  ORIGIN,
  rootUrl,
} from "../content/site.ts";

/** The sitemap (FR-20): the three roots, each listing the four alternates, itself among them. */
export function sitemap(): string {
  const alternates = [
    ...LANGUAGES.map((language) => [LOCALES[language].lang, rootUrl(language)]),
    ["x-default", rootUrl(DEFAULT_LANGUAGE)],
  ]
    .map(
      ([hreflang = "", href = ""]) =>
        `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`,
    )
    .join("\n");
  const urls = LANGUAGES.map(
    (language) =>
      `  <url>\n    <loc>${rootUrl(language)}</loc>\n${alternates}\n  </url>`,
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

/** robots.txt (FR-20): everything allowed, and where the sitemap is. */
export function robots(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`;
}
