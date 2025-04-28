import { Locale } from 'discord-api-types/rest/common.js';
import localeConfig from '../locales/config.json';
import { LanguageConfigV1 } from '../types/legacy.js';

type LanguagesConfig = Record<Locale, LanguageConfigV1>;

export const LANGUAGES: LanguagesConfig = localeConfig.languages;

export const isAvailableLanguage = (value: unknown): value is Locale => typeof value === 'string' && value in LANGUAGES;
