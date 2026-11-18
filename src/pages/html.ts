/**
 * A string as HTML text or as the value of a double-quoted attribute, the
 * only kind the templates write: nothing in it can end either.
 */
export function escape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * The link from one root-relative directory path to another, written
 * relative to the first (docs/design.md §6.2), so that the same build works
 * at the root and under any path.
 */
export function relativeHref(from: string, to: string): string {
  if (from === to) return "./";
  const depth = from.split("/").length - 2;
  const rest = to.slice(1);
  return depth === 0 ? `./${rest}` : `${"../".repeat(depth)}${rest}`;
}
