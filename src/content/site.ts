/**
 * What the pages need that is data and not prose (docs/design.md §6.3): the
 * site's own address, the languages and their codes, where the links lead,
 * and the city and country of the structured data.
 */

/**
 * The site's address. Canonical, alternate and preview-image addresses are
 * absolute and always name the final addresses (§6.2), wherever the build
 * is served.
 */
export const ORIGIN = "https://rafasouza.dev.br";

export const LANGUAGES = ["pt", "en", "es"] as const;
export type Language = (typeof LANGUAGES)[number];

interface Locale {
  /** The page's `lang`, and its `hreflang` in the alternates. */
  readonly lang: string;
  /**
   * Open Graph's locale, which takes a language and a country. The English
   * copy spells as in Britain; `es_LA` is the code Facebook, the protocol's
   * author, uses for Latin American Spanish, which the Spanish copy is.
   */
  readonly ogLocale: string;
  /** The path of the language's root (FR-11). */
  readonly path: string;
}

export const LOCALES: Readonly<Record<Language, Locale>> = {
  pt: { lang: "pt-BR", ogLocale: "pt_BR", path: "/" },
  en: { lang: "en", ogLocale: "en_GB", path: "/en/" },
  es: { lang: "es", ogLocale: "es_LA", path: "/es/" },
};

/** The page for a reader whose language is none of the three: `x-default` (FR-20). */
export const DEFAULT_LANGUAGE: Language = "en";

/** How the language links are separated on one line, in the copy as on the page. */
export const LANGUAGE_SEPARATOR = " · ";

/** Where the sober page's links lead. */
export const ADDRESSES = {
  balcao: "https://balcao.rafasouza.dev.br",
  pendulum: "https://pendulum.rafasouza.dev.br/",
  github: "https://github.com/rafa-el-souza",
  linkedin: "https://www.linkedin.com/in/rafa-el-souza",
} as const;

export const EMAIL = "rafasouza.dev@pm.me";

/** The profiles that are the same person, for the structured data (FR-20). */
export const SAME_AS = [ADDRESSES.github, ADDRESSES.linkedin] as const;

/** Where he is, for the structured data (FR-20): the city, and the country's ISO code. */
export const PLACE = { city: "Belo Horizonte", country: "BR" } as const;

/** The absolute address of a language's root. */
export function rootUrl(language: Language): string {
  return `${ORIGIN}${LOCALES[language].path}`;
}

/** The absolute address of a language's preview image (FR-19), 1200 × 630. */
export function shareImageUrl(language: Language): string {
  return `${ORIGIN}/og/${language}.png`;
}

/** The preview image's size, in pixels. */
export const SHARE_IMAGE = { width: 1200, height: 630 } as const;
