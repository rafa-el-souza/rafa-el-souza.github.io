/**
 * The copy of the sober page, the plain page the domain serves until launch
 * (FR-24): every string a visitor reads on it, in one module per language
 * over this one type, so that a key missing from a language fails the type
 * check (FR-11). The author supplies and approves the text; it is kept in
 * the modules exactly as approved, and the pages never write or reword any.
 */
export interface SoberCopy {
  /** The document's title, in search results and link previews. */
  readonly title: string;
  /** The meta description, in search results and link previews. */
  readonly description: string;
  readonly name: string;
  /** The role and the stack, in one line. */
  readonly role: string;
  /** One sentence of who he is. */
  readonly sentence: string;
  /** The city and the time zone. */
  readonly place: string;
  /** The text of each link; where each leads is in `site.ts`. */
  readonly links: {
    readonly balcao: string;
    readonly pendulum: string;
    readonly github: string;
    readonly linkedin: string;
    /** The e-mail address itself, shown as the link's text. */
    readonly email: string;
  };
  /**
   * The names of the three languages, each in its own, in the order of
   * `LANGUAGES` and separated by `LANGUAGE_SEPARATOR`: the language links,
   * as one line.
   */
  readonly languages: string;
}
