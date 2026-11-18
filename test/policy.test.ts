import { readdirSync } from "node:fs";

import { describe, expect, test } from "vitest";

import { COPY } from "../src/content/copy.ts";
import { LANGUAGES, LOCALES } from "../src/content/site.ts";
import { POLICY } from "../src/pages/head.ts";
import { PAGE_FILES, SITE, built, tags, text } from "./built.ts";

describe.each(PAGE_FILES)("%s", (file) => {
  const html = built(file);

  test("S-3 the Content Security Policy comes first, before anything it governs", () => {
    const policies = tags(html, "meta").filter(
      (tag) => tag["http-equiv"] === "Content-Security-Policy",
    );
    expect(policies.map((tag) => tag.content)).toEqual([POLICY]);
    const head =
      /<head>\s*<meta charset="utf-8"\s*\/?>\s*<meta http-equiv="Content-Security-Policy"/;
    expect(html).toMatch(head);
  });

  test("S-3 no inline style, no handler attribute, no script but the structured data", () => {
    expect(html).not.toMatch(/\sstyle=/i);
    expect(html).not.toMatch(/<style/i);
    expect(html).not.toMatch(/\son[a-z]+=/i);
    for (const script of tags(html, "script")) {
      expect(script).toEqual({ type: "application/ld+json" });
    }
  });
});

test("S-3 the policy forbids by default and allows the site's own styles and images only", () => {
  expect(POLICY).toBe(
    "default-src 'none'; style-src 'self'; img-src 'self'; base-uri 'none'; form-action 'none'",
  );
});

test("FR-24 no script, no web font: the build holds HTML, one stylesheet and images", () => {
  const files = readdirSync(SITE, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);
  const kinds = new Set(files.map((name) => name.split(".").pop()));
  expect([...kinds].sort()).toEqual(["css", "html", "png", "txt", "xml"]);
  expect(files.filter((name) => name.endsWith(".css"))).toHaveLength(1);
});

test("FR-24 the stylesheet uses the browser's own fonts and colours", () => {
  const css = readdirSync(SITE, { recursive: true })
    .map(String)
    .filter((path) => path.endsWith(".css"))
    .map((path) => built(path))
    .join("");
  expect(css).toMatch(/color-scheme:\s*light dark/);
  expect(css).not.toMatch(/@font-face|url\(/);
  expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|rgb|hsl|oklch|lab\(/i);
});

test("FR-21 the 404 page names the site and leads to the three roots, from any depth", () => {
  const html = built("404.html");
  expect(text(html, "title")).toBe(COPY.pt.name);
  const roots = tags(html, "a")
    .map((link) => link.href)
    .filter((href) => href !== undefined);
  expect(roots).toEqual(
    expect.arrayContaining(LANGUAGES.map((language) => LOCALES[language].path)),
  );
  const stylesheets = tags(html, "link").filter(
    (link) => link.rel === "stylesheet",
  );
  expect(stylesheets).toHaveLength(1);
  expect(stylesheets[0]?.href).toMatch(/^\/assets\/[\w-]+\.css$/);
});
