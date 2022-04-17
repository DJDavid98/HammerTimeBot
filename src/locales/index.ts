import { LocalizationMap } from 'discord-api-types/v10.js';
import { huLocale } from './hu.js';
import { enLocale } from './en.js';
import { Localization } from '../types/localization.js';

type SupportedLanguages = keyof Pick<LocalizationMap, 'hu' | 'en-US'>;

export const locales: Record<SupportedLanguages, Localization> = {
  hu: huLocale,
  'en-US': enLocale,
};
