import { COPY } from "../content/copy.ts";
import {
  ADDRESSES,
  DEFAULT_LANGUAGE,
  EMAIL,
  LANGUAGES,
  LANGUAGE_SEPARATOR,
  LOCALES,
  ORIGIN,
  PLACE,
  SAME_AS,
  SHARE_IMAGE,
  rootUrl,
  shareImageUrl,
  type Language,
} from "../content/site.ts";
import { STYLESHEET, headStart } from "./head.ts";
import { escape, relativeHref } from "./html.ts";

/**
 * The language links: the three languages, each named in its own and
 * carrying its `lang`, each a link to the same page in that language, and
 * the current one, if any, marked. The separators of the copy's line are
 * drawn but not read aloud.
 */
export function languageLinks(
  href: (language: Language) => string,
  current?: Language,
): string {
  const names = COPY.pt.languages.split(LANGUAGE_SEPARATOR);
  const links = LANGUAGES.map((language, index) => {
    const name = names[index];
    if (name === undefined) {
      throw new Error(`the language line names no language ${language}`);
    }
    const { lang } = LOCALES[language];
    const marked = language === current ? ' aria-current="page"' : "";
    return `<a href="${escape(href(language))}" hreflang="${lang}" lang="${lang}"${marked}>${escape(name)}</a>`;
  });
  return links.join(
    `<span aria-hidden="true">${escape(LANGUAGE_SEPARATOR)}</span>`,
  );
}

/** The structured data (FR-20): one Person, with the copy's name and role and the codes and addresses of `site.ts`. */
function person(language: Language): string {
  const copy = COPY[language];
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: copy.name,
    jobTitle: copy.role,
    url: `${ORIGIN}/`,
    sameAs: SAME_AS,
    knowsLanguage: LANGUAGES.map((each) => LOCALES[each].lang),
    address: {
      "@type": "PostalAddress",
      addressLocality: PLACE.city,
      addressCountry: PLACE.country,
    },
  };
  // written with "<" escaped, so that nothing in the data can end the script element
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

/** The tags of search and of link previews (FR-19, FR-20). */
function findingTags(language: Language): string {
  const copy = COPY[language];
  const others = LANGUAGES.filter((each) => each !== language);
  return [
    `<meta name="description" content="${escape(copy.description)}" />`,
    `<link rel="canonical" href="${escape(rootUrl(language))}" />`,
    ...LANGUAGES.map(
      (each) =>
        `<link rel="alternate" hreflang="${LOCALES[each].lang}" href="${escape(rootUrl(each))}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${escape(rootUrl(DEFAULT_LANGUAGE))}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escape(copy.title)}" />`,
    `<meta property="og:description" content="${escape(copy.description)}" />`,
    `<meta property="og:url" content="${escape(rootUrl(language))}" />`,
    `<meta property="og:locale" content="${LOCALES[language].ogLocale}" />`,
    ...others.map(
      (each) =>
        `<meta property="og:locale:alternate" content="${LOCALES[each].ogLocale}" />`,
    ),
    `<meta property="og:image" content="${escape(shareImageUrl(language))}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="${String(SHARE_IMAGE.width)}" />`,
    `<meta property="og:image:height" content="${String(SHARE_IMAGE.height)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join("\n    ");
}

/**
 * The sober page in one language (FR-24): the name, the role, one
 * sentence, the place, the links to the two live projects, GitHub, LinkedIn
 * and the e-mail address, and the links to the other languages. No script,
 * no animation, no web font; the browser's own colours in its own theme.
 */
export function soberPage(language: Language): string {
  const copy = COPY[language];
  const here = LOCALES[language].path;
  const links: [string, string][] = [
    [ADDRESSES.balcao, copy.links.balcao],
    [ADDRESSES.pendulum, copy.links.pendulum],
    [ADDRESSES.github, copy.links.github],
    [ADDRESSES.linkedin, copy.links.linkedin],
    [`mailto:${EMAIL}`, copy.links.email],
  ];
  return `<!doctype html>
<html lang="${LOCALES[language].lang}">
  <head>
    ${headStart()}
    <title>${escape(copy.title)}</title>
    ${findingTags(language)}
    <link rel="stylesheet" href="${STYLESHEET}" />
    <script type="application/ld+json">${person(language)}</script>
  </head>
  <body>
    <header>
      <nav>${languageLinks((each) => relativeHref(here, LOCALES[each].path), language)}</nav>
    </header>
    <main>
      <h1>${escape(copy.name)}</h1>
      <p>${escape(copy.role)}</p>
      <p>${escape(copy.sentence)}</p>
      <p>${escape(copy.place)}</p>
      <ul>
        ${links.map(([href, label]) => `<li><a href="${escape(href)}">${escape(label)}</a></li>`).join("\n        ")}
      </ul>
    </main>
  </body>
</html>
`;
}
