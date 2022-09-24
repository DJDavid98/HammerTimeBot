import { join } from 'path';
import { LocalizationMap } from 'discord-api-types/v10';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { env } from '../env.js';
import { Localization } from '../types/localization.js';
import type huTranslation from '../locales/hu/translation.json';
import type enTranslation from '../locales/en/translation.json';
import type enGbTranslation from '../locales/en-GB/translation.json';
import type deTranslation from '../locales/de/translation.json';
import type elTranslation from '../locales/el/translation.json';
import type itTranslation from '../locales/it/translation.json';
import type plTranslation from '../locales/pl/translation.json';
import type ruTranslation from '../locales/ru/translation.json';
import type esTranslation from '../locales/es/translation.json';
import type ukTranslation from '../locales/uk/translation.json';
import type ptBrTranslation from '../locales/pt-BR/translation.json';
import type nlTranslation from '../locales/nl/translation.json';

export type SupportedLanguage = keyof Pick<LocalizationMap, (
  | 'hu'
  | 'en-US'
  | 'en-GB'
  | 'de'
  | 'el'
  | 'it'
  | 'pl'
  | 'ru'
  // | 'es-ES'
  | 'uk'
  | 'pt-BR'
  | 'nl'
)>;
const languagesRecord: Record<SupportedLanguage, true> = {
  hu: true,
  'en-US': true,
  'en-GB': true,
  de: true,
  el: true,
  it: true,
  pl: true,
  ru: true,
  // 'es-ES': true,
  uk: true,
  'pt-BR': true,
  nl: true,
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
  'en-GB': typeof enGbTranslation,
  de: typeof deTranslation,
  el: typeof elTranslation,
  it: typeof itTranslation,
  pl: typeof plTranslation,
  ru: typeof ruTranslation,
  'es-ES': typeof esTranslation,
  uk: typeof ukTranslation,
  'pt-BR': typeof ptBrTranslation,
  nl: typeof nlTranslation,
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
