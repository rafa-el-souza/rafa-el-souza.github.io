import { escape } from "./html.ts";

/**
 * The Content Security Policy (S-3), by meta tag, because the host sends no
 * headers of ours. Nothing is allowed by default; the site's own stylesheet
 * and images are, images because the browser asks for `/favicon.ico` by
 * itself. The sober page has no script and calls no other origin, so there
 * is nothing for `script-src` or `connect-src` to allow. A meta policy
 * cannot set `frame-ancestors`; the page holds nothing worth framing.
 */
export const POLICY = [
  "default-src 'none'",
  "style-src 'self'",
  "img-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

/**
 * The stylesheet, as the build's source names it; the build bundles it and
 * writes its final address into each page.
 */
export const STYLESHEET = "/src/styles/sober.css";

/**
 * The start of every page's head: the encoding, then the policy before
 * anything it governs, then the viewport and the two colour schemes, so
 * that the first frame is drawn in the browser's own.
 */
export function headStart(): string {
  return `<meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="${escape(POLICY)}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />`;
}
