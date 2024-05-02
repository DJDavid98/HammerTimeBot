import { join } from 'path';
import i18next, { i18n } from 'i18next';
import Backend from 'i18next-fs-backend';
import { env } from '../env.js';
import { Locale, LocaleString } from 'discord-api-types/v10';

// Type-safe language constants
export const SUPPORTED_LANGUAGES = Object.values(Locale) as LocaleString[];
export const DEFAULT_LANGUAGE = Locale.EnglishUS;

const localesPath = join('.', 'src', 'locales');

export const initI18next = async (): Promise<i18n> => {
  await i18next.use(Backend).init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    debug: env.DEBUG_I18N,
    preload: SUPPORTED_LANGUAGES,
    backend: {
      loadPath: join(localesPath, '{{lng}}', '{{ns}}.json'),
    },
    interpolation: {
      escapeValue: false,
    },
  });

  return i18next;
};
