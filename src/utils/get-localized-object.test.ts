import {
  getLocalizedObject,
  LocalizedValue,
  SupportedLocalizationMap,
  TranslatorFunction,
} from './get-localized-object.js';

describe('getLocalizedObject', () => {
  const mockTranslator: TranslatorFunction = (lng) => `mock.key.${lng}`;

  it('should work with base key inclusion', () => {
    const actual = getLocalizedObject('name', mockTranslator);
    const expected: LocalizedValue<'name'> = {
      name: 'mock.key.undefined',
      name_localizations: {
        'en-US': 'mock.key.en-US',
        hu: 'mock.key.hu',
      },
    };
    expect(actual).toEqual(expected);
  });

  it('should work without base key inclusion', () => {
    const actual = getLocalizedObject('description', mockTranslator, false);
    const expected: SupportedLocalizationMap<'description'> = {
      description_localizations: {
        'en-US': 'mock.key.en-US',
        hu: 'mock.key.hu',
      },
    };
    expect(actual).toEqual(expected);
  });
});
