import { LocalizationMap } from 'discord-api-types/v10';
import { Localization } from '../types/localization.js';
import { locale as huLocale } from '../locales/hu.js';
import { locale as enLocale } from '../locales/en.js';

type SupportedLanguages = keyof Pick<LocalizationMap, 'hu' | 'en-US'>;

export const locales: Record<SupportedLanguages, Localization> = {
  hu: huLocale,
  'en-US': enLocale,
};
