import { readFileSync } from "node:fs";
import { join } from "node:path";

import { inject } from "vitest";

import { LOCALES, type Language } from "../src/content/site.ts";

/** The directory of the build under test (global-setup.ts). */
export const SITE = inject("site");

/** A file of the build, as text. */
export function built(path: string): string {
  return readFileSync(join(SITE, path), "utf8");
}

/** The built page of a language's root. */
export function rootPage(language: Language): string {
  return built(`${LOCALES[language].path}index.html`);
}

/** Every page of the build. */
export const PAGE_FILES = [
  "index.html",
  "en/index.html",
  "es/index.html",
  "404.html",
] as const;

function unescape(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

/**
 * The attributes of every start tag of one name, in order. They are read
 * with a pattern, not a parser: the pages are this build's own output, whose
 * attribute values are always double-quoted and escaped (src/pages/html.ts),
 * and a parser would be a dependency for the tests alone. The browser tests
 * read the same pages through a real DOM.
 */
export function tags(html: string, name: string): Record<string, string>[] {
  return [...html.matchAll(new RegExp(`<${name}(\\s[^>]*)?>`, "g"))].map(
    ([, attributes = ""]) =>
      Object.fromEntries(
        [...attributes.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map(
          ([, key = "", value = ""]) => [key, unescape(value)],
        ),
      ),
  );
}

/** The `content` of every meta tag whose attribute `key` is `value`. */
export function meta(html: string, key: string, value: string): string[] {
  return tags(html, "meta")
    .filter((tag) => tag[key] === value)
    .map((tag) => tag.content ?? "");
}

/** The text of the first element of one name. */
export function text(html: string, name: string): string | undefined {
  const found = new RegExp(`<${name}(?:\\s[^>]*)?>([^<]*)</${name}>`).exec(
    html,
  )?.[1];
  return found === undefined ? undefined : unescape(found);
}

/** The structured data blocks of a page, parsed. */
export function jsonLd(html: string): unknown[] {
  return [
    ...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g),
  ].map(([, json = ""]) => JSON.parse(json) as unknown);
}

/** The width and height a PNG file declares in its header, or nothing if it is not a PNG. */
export function pngSize(
  file: Buffer,
): { width: number; height: number } | undefined {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!file.subarray(0, 8).equals(signature)) return undefined;
  if (file.toString("latin1", 12, 16) !== "IHDR") return undefined;
  return { width: file.readUInt32BE(16), height: file.readUInt32BE(20) };
}
