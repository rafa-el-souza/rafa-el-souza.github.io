import { expect, test } from "vitest";

import { escape, relativeHref } from "./html.ts";

test("S-3 copy cannot end the element or the attribute it is written into", () => {
  expect(escape(`<script>"a" & 'b'</script>`)).toBe(
    "&lt;script&gt;&quot;a&quot; &amp; 'b'&lt;/script&gt;",
  );
  expect(escape("Balcão · UTC−3")).toBe("Balcão · UTC−3");
});

test("FR-11 links between the pages are relative, so the same build serves any path", () => {
  expect(relativeHref("/", "/")).toBe("./");
  expect(relativeHref("/", "/en/")).toBe("./en/");
  expect(relativeHref("/en/", "/en/")).toBe("./");
  expect(relativeHref("/en/", "/")).toBe("../");
  expect(relativeHref("/en/", "/es/")).toBe("../es/");
});
