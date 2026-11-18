import { expect, test, type Page } from "@playwright/test";

import { COPY } from "../src/content/copy.ts";
import { ADDRESSES, EMAIL, LANGUAGES, LOCALES } from "../src/content/site.ts";
import { collectErrors } from "./errors.ts";
import { LANGUAGE_NAMES, UNKNOWN_PATH, root } from "./pages.ts";

// The sober page, the first the domain serves (docs/design.md, FR-24): each
// root answers in its language with the name, the role, a sentence, the
// place and the links; the three link to one another; the page follows the
// browser's theme in the browser's own colours, with no script, no
// animation and no web font.

for (const language of LANGUAGES) {
  test(`FR-24 ${language}: the root answers in its language, with the name, the role, the sentence, the place and the links`, async ({
    page,
  }) => {
    const errors = collectErrors(page);
    const copy = COPY[language];
    const response = await page.goto(root(language));
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      LOCALES[language].lang,
    );
    await expect(page).toHaveTitle(copy.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      copy.description,
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(copy.name);
    for (const line of [copy.role, copy.sentence, copy.place]) {
      await expect(page.getByText(line, { exact: true })).toBeVisible();
    }
    const links = [
      [copy.links.balcao, ADDRESSES.balcao],
      [copy.links.pendulum, ADDRESSES.pendulum],
      [copy.links.github, ADDRESSES.github],
      [copy.links.linkedin, ADDRESSES.linkedin],
      [copy.links.email, `mailto:${EMAIL}`],
    ] as const;
    for (const [name, href] of links) {
      await expect(
        page.getByRole("link", { name, exact: true }),
      ).toHaveAttribute("href", href);
    }
    await expect(page.getByRole("main")).toHaveText(
      new RegExp(`^\\s*${copy.name}`),
    );
    expect(errors).toEqual([]);
  });
}

test("FR-24 the language links lead to the same page in each language, the current one marked", async ({
  page,
}) => {
  await page.goto(root("pt"));
  for (const language of ["en", "es", "pt"] as const) {
    await page
      .getByRole("link", { name: LANGUAGE_NAMES[language], exact: true })
      .click();
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      LOCALES[language].lang,
    );
    expect(new URL(page.url()).pathname).toBe(LOCALES[language].path);
    const current = page.locator('a[aria-current="page"]');
    await expect(current).toHaveText(LANGUAGE_NAMES[language]);
    await expect(current).toHaveAttribute("lang", LOCALES[language].lang);
  }
});

test("FR-24 no script runs, nothing moves and no web font is loaded", async ({
  page,
}) => {
  for (const language of LANGUAGES) {
    await page.goto(root(language));
    await expect(
      page.locator('script:not([type="application/ld+json"])'),
    ).toHaveCount(0);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    expect(await page.evaluate(() => document.fonts.size)).toBe(0);
  }
});

/** The colours of the page as drawn: its ground, its text and its links, as sRGB. */
async function colours(
  page: Page,
): Promise<Record<"ground" | "text" | "link", number[]>> {
  return page.evaluate(() => {
    const rgb = (value: string) =>
      (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
    // the ground is the canvas, drawn in the browser's own Canvas colour
    const probe = document.createElement("i");
    probe.style.color = "Canvas";
    document.body.append(probe);
    const ground = rgb(getComputedStyle(probe).color);
    probe.remove();
    const text = rgb(getComputedStyle(document.body).color);
    const link = document.querySelector("main a");
    return {
      ground,
      text,
      link: rgb(link === null ? "" : getComputedStyle(link).color),
    };
  });
}

function luminance([r = 0, g = 0, b = 0]: number[]): number {
  const linear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrast(a: number[], b: number[]): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
}

for (const scheme of ["light", "dark"] as const) {
  test(`FR-24 the page follows the browser's ${scheme} theme in its own colours; NFR-04 text and links reach 4.5:1`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto(root("pt"));
    const { ground, text, link } = await colours(page);
    const groundIsDark = luminance(ground) < luminance(text);
    expect(groundIsDark, `ground ${ground.join(",")}`).toBe(scheme === "dark");
    expect(contrast(text, ground)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(link, ground)).toBeGreaterThanOrEqual(4.5);
  });
}

test("FR-21 an unknown path, however deep, answers 404 with a styled page that leads to the three roots", async ({
  page,
}) => {
  const response = await page.goto(UNKNOWN_PATH);
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    COPY.pt.name,
  );
  // the stylesheet came, from the root: the column has its measure
  const measure = await page
    .getByRole("main")
    .evaluate((main) => getComputedStyle(main).maxWidth);
  expect(measure).toBe("640px");
  await page
    .getByRole("link", { name: LANGUAGE_NAMES.en, exact: true })
    .click();
  expect(new URL(page.url()).pathname).toBe(LOCALES.en.path);
});
