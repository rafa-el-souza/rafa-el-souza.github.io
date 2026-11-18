import { readFileSync, readdirSync } from "node:fs";
import { join, posix } from "node:path";
import { gzipSync } from "node:zlib";

import { describe, expect, test } from "vitest";

import { LANGUAGES, LOCALES } from "../src/content/site.ts";
import { SITE, rootPage, tags } from "./built.ts";

/** NFR-01's budgets, in bytes compressed with gzip (1 kB = 1000 bytes). */
const BUDGET = {
  html: 20_000,
  css: 30_000,
  js: 30_000,
  fonts: 120_000,
  firstView: 200_000,
  everything: 600_000,
};

function gzipped(path: string): number {
  return gzipSync(readFileSync(join(SITE, path))).length;
}

/** Every file of the build whose name ends so, as paths inside the build. */
function every(extension: string): string[] {
  return readdirSync(SITE, { recursive: true })
    .map(String)
    .filter((path) => path.endsWith(extension));
}

function sum(paths: readonly string[]): number {
  return paths.reduce((total, path) => total + gzipped(path), 0);
}

/** The files of the build a page loads by itself: its stylesheets, scripts and images, and what its stylesheets load. */
function loads(
  page: string,
  html: string,
): { first: string[]; later: string[] } {
  const from = (href: string) =>
    posix.normalize(posix.join(posix.dirname(page), href));
  const stylesheets = tags(html, "link")
    .filter((link) => link.rel === "stylesheet")
    .map((link) => from(link.href ?? ""));
  const scripts = tags(html, "script")
    .filter((script) => script.src !== undefined)
    .map((script) => from(script.src ?? ""));
  const fonts = stylesheets.flatMap((sheet) =>
    [
      ...readFileSync(join(SITE, sheet), "utf8").matchAll(/url\(([^)]+)\)/g),
    ].map(([, url = ""]) =>
      posix.join(posix.dirname(sheet), url.replaceAll(/["']/g, "")),
    ),
  );
  const images = tags(html, "img").map((image) => from(image.src ?? ""));
  return { first: [page, ...stylesheets, ...scripts, ...fonts], later: images };
}

test("NFR-01 all the CSS and all the JavaScript, each within its budget", () => {
  expect(sum(every(".css"))).toBeLessThanOrEqual(BUDGET.css);
  expect(sum(every(".js"))).toBeLessThanOrEqual(BUDGET.js);
  expect(sum([...every(".woff2"), ...every(".woff")])).toBeLessThanOrEqual(
    BUDGET.fonts,
  );
});

describe.each(LANGUAGES)("%s", (language) => {
  const page = `${LOCALES[language].path.slice(1)}index.html`;
  const { first, later } = loads(page, rootPage(language));

  test("NFR-01 the HTML within 20 kB, the first view within 200 kB, everything within 600 kB", () => {
    expect(gzipped(page)).toBeLessThanOrEqual(BUDGET.html);
    expect(sum(first)).toBeLessThanOrEqual(BUDGET.firstView);
    expect(sum([...first, ...later])).toBeLessThanOrEqual(BUDGET.everything);
  });
});
