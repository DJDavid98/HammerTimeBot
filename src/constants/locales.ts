import { LocalizationMap } from 'discord-api-types/v10';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { env } from '../env.js';
import { Localization } from '../types/localization.js';
import type huTranslation from '../locales/hu/translation.json';
import type enTranslation from '../locales/en/translation.json';
import { join } from 'path';

export type SupportedLanguage = keyof Pick<LocalizationMap, 'hu' | 'en-US'>;
const languagesRecord: Record<SupportedLanguage, true> = {
  hu: true,
  'en-US': true,
};

// Type-safe language constants
export const SUPPORTED_LANGUAGES = Object.keys(languagesRecord) as SupportedLanguage[];
const DEFAULT_LANGUAGE: SupportedLanguage = 'en-US';

type TypeValidator<T extends Record<SupportedLanguage, Localization>> = T;
/* eslint-disable @typescript-eslint/no-unused-vars -- This type validates the structure of the i18n files at build time */
// noinspection JSUnusedLocalSymbols
type ValidatedLocalizationMap = TypeValidator<{
  hu: typeof huTranslation,
  'en-US': typeof enTranslation,
}>;
/* eslint-enable @typescript-eslint/no-unused-vars */

const localesPath = join('.', 'src', 'locales');

export const initI18next = () => i18next.use(Backend).init({
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  debug: env.LOCAL,
  preload: SUPPORTED_LANGUAGES,
  backend: {
    loadPath: join(localesPath, '{{lng}}', '{{ns}}.json'),
    addPath: join(localesPath, '{{lng}}', '{{ns}}.missing.json'),
  },
});
