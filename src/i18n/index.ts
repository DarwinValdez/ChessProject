import { type Messages, es } from "./es";

export type Locale = "es";

const dictionaries: Record<Locale, Messages> = { es };

export const DEFAULT_LOCALE: Locale = "es";

export function getMessages(locale: Locale = DEFAULT_LOCALE): Messages {
  return dictionaries[locale];
}

/** Current UI messages. Single locale for now; a locale switch plugs in here. */
export const t = getMessages();
