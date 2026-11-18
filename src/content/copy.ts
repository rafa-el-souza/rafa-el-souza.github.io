import { en } from "./en.ts";
import { es } from "./es.ts";
import { pt } from "./pt.ts";
import type { Language } from "./site.ts";
import type { SoberCopy } from "./sober.ts";

/** The sober page's copy, by language; a language missing here fails the type check. */
export const COPY: Readonly<Record<Language, SoberCopy>> = { pt, en, es };
