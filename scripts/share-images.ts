// The preview images of the sober page (FR-19, FR-24), one per language: the
// name and the role line from the copy, in the colours of the page's light
// theme, the browser's own ground and text, at 1200 × 630. Each is drawn
// from HTML by Chromium and written as PNG to public/og/, which the build
// copies. The text is set in Noto Sans, which the machine that runs this
// needs installed, and the role's lines break after a separator, never
// before one. The images are kept in the repository, so the build never runs
// a browser. Run: npm run images

import { mkdirSync } from "node:fs";

import { chromium } from "@playwright/test";

import { COPY } from "../src/content/copy.ts";
import { LANGUAGES, SHARE_IMAGE } from "../src/content/site.ts";
import { escape } from "../src/pages/html.ts";

const OUT = new URL("../public/og/", import.meta.url);

function picture(name: string, role: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      :root { color-scheme: light; }
      body {
        box-sizing: border-box;
        width: ${String(SHARE_IMAGE.width)}px;
        height: ${String(SHARE_IMAGE.height)}px;
        margin: 0;
        padding: 0 96px;
        display: grid;
        place-content: center;
        text-align: center;
        background: Canvas;
        color: CanvasText;
        font-family: "Noto Sans";
      }
      h1 { margin: 0 0 32px; font-size: 96px; line-height: 1.1; }
      p { margin: 0; font-size: 40px; line-height: 1.35; text-wrap: balance; }
    </style>
  </head>
  <body>
    <h1>${escape(name)}</h1>
    <p>${escape(role).replaceAll(" · ", "\u00a0· ")}</p>
  </body>
</html>`;
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: SHARE_IMAGE.width, height: SHARE_IMAGE.height },
    deviceScaleFactor: 1,
  });
  for (const language of LANGUAGES) {
    const { name, role } = COPY[language];
    await page.setContent(picture(name, role));
    await page.evaluate(() => document.fonts.ready);
    const path = new URL(`${language}.png`, OUT);
    await page.screenshot({ path: path.pathname, type: "png" });
    console.log(`wrote ${path.pathname}`);
  }
} finally {
  await browser.close();
}
