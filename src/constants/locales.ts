import { join } from 'path';
import i18next, { i18n } from 'i18next';
import Backend from 'i18next-fs-backend';
import { env } from '../env.js';
import { Locale } from 'discord-api-types/v10';

// Type-safe language constants
export const SUPPORTED_LANGUAGES = Object.values(Locale) as Locale[];
export const DEFAULT_LANGUAGE = Locale.EnglishUS;
export const CROWDIN_PROJECT_URL = `https://crowdin.com/project/${env.CROWDIN_PROJECT_IDENTIFIER}`;

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
