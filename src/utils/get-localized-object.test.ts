import {
  getLocalizedObject,
  LocalizedValue,
  SupportedLocalizationMap,
  SupportedLocalizations,
  TranslatorFunction,
} from './get-localized-object.js';
import { SUPPORTED_LANGUAGES } from '../constants/locales.js';

describe('getLocalizedObject', () => {
  const mockTranslator: TranslatorFunction = (lng) => `mock.key.${lng}`;
  const mockNameLocalizationMap = SUPPORTED_LANGUAGES.reduce((mockObject, language) => ({
    ...mockObject,
    [language]: `mock.key.${language.toLowerCase()}`,
  }), {} as SupportedLocalizations);
  const mockDescriptionLocalizationMap = SUPPORTED_LANGUAGES.reduce((mockObject, language) => ({
    ...mockObject,
    [language]: `mock.key.${language}`,
  }), {} as SupportedLocalizations);

  it('should work with base key inclusion', () => {
    const actual = getLocalizedObject('name', mockTranslator);
    const expected: LocalizedValue<'name'> = {
      name: 'mock.key.undefined',
      name_localizations: mockNameLocalizationMap,
    };
    expect(actual).toEqual(expected);
  });

  it('should work without base key inclusion', () => {
    const actual = getLocalizedObject('description', mockTranslator, false);
    const expected: SupportedLocalizationMap<'description'> = {
      description_localizations: mockDescriptionLocalizationMap,
    };
    expect(actual).toEqual(expected);
  });
});
