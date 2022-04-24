import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../constants/locales.js';

type LocalizedKey = 'description' | 'name';
type LocalizationsKey<Key extends LocalizedKey> = `${Key}_localizations`;
type SupportedLocalizations = Record<SupportedLanguage, string>;
export type SupportedLocalizationMap<Key extends LocalizedKey> = Record<LocalizationsKey<Key>, SupportedLocalizations>;
export type LocalizedValue<Key extends LocalizedKey> =
  Record<Key, string>
  & SupportedLocalizationMap<Key>;

export type TranslatorFunction = (lng?: SupportedLanguage) => string;

export function getLocalizedObject<Key extends LocalizedKey>(key: Key, translator: TranslatorFunction, includeBaseKey: false): SupportedLocalizationMap<Key>;
export function getLocalizedObject<Key extends LocalizedKey>(key: Key, translator: TranslatorFunction, includeBaseKey?: true): LocalizedValue<Key>;

export function getLocalizedObject<Key extends LocalizedKey>(key: Key, translator: TranslatorFunction, includeBaseKey = true): LocalizedValue<Key> {
  const localizationsKey: LocalizationsKey<Key> = `${key}_localizations` as const;
  const baseObject = includeBaseKey ? { [key]: translator() } : undefined;
  return {
    ...baseObject,
    [localizationsKey]: SUPPORTED_LANGUAGES.reduce((localizations, locale) => ({
      ...localizations,
      [locale]: translator(locale),
    }), {} as SupportedLocalizations),
  } as LocalizedValue<Key>;
}
