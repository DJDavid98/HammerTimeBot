import { Locale } from 'discord-api-types/rest/common.js';
import { LanguageConfig } from '../types/language-config.js';
import localeConfig from '../locales/config.json';

type LanguagesConfig = Record<Locale, LanguageConfig>;

/* eslint-disable @typescript-eslint/no-unused-vars -- This type validates the config for all locales at build time */
// noinspection JSUnusedGlobalSymbols
export const LANGUAGES: LanguagesConfig = localeConfig.languages;
/* eslint-enable @typescript-eslint/no-unused-vars */

