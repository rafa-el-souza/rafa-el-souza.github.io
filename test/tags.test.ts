import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

import { COPY } from "../src/content/copy.ts";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  LOCALES,
  ORIGIN,
  PLACE,
  SAME_AS,
  SHARE_IMAGE,
  rootUrl,
  shareImageUrl,
} from "../src/content/site.ts";
import {
  SITE,
  built,
  jsonLd,
  meta,
  pngSize,
  rootPage,
  tags,
  text,
} from "./built.ts";

describe.each(LANGUAGES)("the root of %s", (language) => {
  const html = rootPage(language);
  const copy = COPY[language];
  const others = LANGUAGES.filter((other) => other !== language);

  test("FR-11 the page declares its own language", () => {
    expect(tags(html, "html")[0]?.lang).toBe(LOCALES[language].lang);
  });

  test("FR-20 its title, its description and its own canonical address", () => {
    expect(text(html, "title")).toBe(copy.title);
    expect(meta(html, "name", "description")).toEqual([copy.description]);
    const canonical = tags(html, "link").filter(
      (link) => link.rel === "canonical",
    );
    expect(canonical.map((link) => link.href)).toEqual([rootUrl(language)]);
  });

  test("FR-20 the alternates name the three roots and x-default, the English page", () => {
    const alternates = tags(html, "link")
      .filter((link) => link.rel === "alternate")
      .map((link) => [link.hreflang, link.href]);
    expect(alternates).toEqual([
      ...LANGUAGES.map((each) => [LOCALES[each].lang, rootUrl(each)]),
      ["x-default", rootUrl(DEFAULT_LANGUAGE)],
    ]);
  });

  test("FR-19 Open Graph tags for a link preview, in the page's language", () => {
    expect(meta(html, "property", "og:type")).toEqual(["website"]);
    expect(meta(html, "property", "og:title")).toEqual([copy.title]);
    expect(meta(html, "property", "og:description")).toEqual([
      copy.description,
    ]);
    expect(meta(html, "property", "og:url")).toEqual([rootUrl(language)]);
    expect(meta(html, "property", "og:locale")).toEqual([
      LOCALES[language].ogLocale,
    ]);
    expect(meta(html, "property", "og:locale:alternate")).toEqual(
      others.map((other) => LOCALES[other].ogLocale),
    );
    expect(meta(html, "property", "og:image")).toEqual([
      shareImageUrl(language),
    ]);
    expect(meta(html, "property", "og:image:type")).toEqual(["image/png"]);
    expect(meta(html, "property", "og:image:width")).toEqual([
      String(SHARE_IMAGE.width),
    ]);
    expect(meta(html, "property", "og:image:height")).toEqual([
      String(SHARE_IMAGE.height),
    ]);
  });

  test("FR-19 a Twitter card with the large image, which reads the Open Graph tags", () => {
    expect(meta(html, "name", "twitter:card")).toEqual(["summary_large_image"]);
  });

  test("FR-20 one Person block, its codes and addresses the constants beside the copy", () => {
    expect(jsonLd(html)).toEqual([
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: copy.name,
        jobTitle: copy.role,
        url: `${ORIGIN}/`,
        sameAs: [...SAME_AS],
        knowsLanguage: LANGUAGES.map((each) => LOCALES[each].lang),
        address: {
          "@type": "PostalAddress",
          addressLocality: PLACE.city,
          addressCountry: PLACE.country,
        },
      },
    ]);
  });
});

test("FR-19 every preview image a page names is in the build, a PNG of 1200 × 630", () => {
  for (const language of LANGUAGES) {
    const image = meta(rootPage(language), "property", "og:image")[0] ?? "";
    expect(image.startsWith(`${ORIGIN}/`), image).toBe(true);
    const file = readFileSync(join(SITE, image.slice(ORIGIN.length)));
    expect(pngSize(file), image).toEqual(SHARE_IMAGE);
  }
});

test("FR-20 the sitemap lists the three roots, each with the four alternates", () => {
  const sitemap = built("sitemap.xml");
  const alternates = [
    ...LANGUAGES.map(
      (each) =>
        `<xhtml:link rel="alternate" hreflang="${LOCALES[each].lang}" href="${rootUrl(each)}"/>`,
    ),
    `<xhtml:link rel="alternate" hreflang="x-default" href="${rootUrl(DEFAULT_LANGUAGE)}"/>`,
  ];
  const urls = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
    ([, url = ""]) => url,
  );
  expect(urls).toHaveLength(LANGUAGES.length);
  LANGUAGES.forEach((language, index) => {
    const url = urls[index] ?? "";
    expect(url).toContain(`<loc>${rootUrl(language)}</loc>`);
    for (const alternate of alternates) expect(url).toContain(alternate);
  });
  expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
    true,
  );
});

test("FR-20 robots.txt allows everything and names the sitemap", () => {
  expect(built("robots.txt")).toBe(
    `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
  );
});
