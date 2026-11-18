import { expect, test } from "@playwright/test";

import { WALK } from "./pages.ts";

// What a visit costs the visitor (docs/design.md, NFR-05 and S-1): every
// request a walk through every page makes, and what the walk leaves stored.

test("NFR-05 a walk through every page asks nothing of another host", async ({
  page,
  baseURL,
}) => {
  const hosts = new Set<string>();
  page.on("request", (request) => hosts.add(new URL(request.url()).host));
  for (const path of WALK) await page.goto(path);
  expect([...hosts]).toEqual([new URL(baseURL ?? "").host]);
});

test("S-1 a walk through every page leaves no cookie and nothing stored", async ({
  page,
  context,
}) => {
  for (const path of WALK) await page.goto(path);
  expect(await context.cookies()).toEqual([]);
  expect(
    await page.evaluate(() => ({
      cookie: document.cookie,
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage),
    })),
  ).toEqual({ cookie: "", local: [], session: [] });
});
