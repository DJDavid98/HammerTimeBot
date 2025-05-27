import { TFunction } from 'i18next';
import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { AgoCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getGlobalOptions } from './global.options.js';
import { positiveIntegerOptionMeta } from './metadata/positive-integer-option.meta.js';
import { positiveNumberOptionMeta } from './metadata/positive-number-option.meta.js';

export const getAgoOptions = (t: TFunction): APIApplicationCommandOption[] => [
  {
    name: AgoCommandOptionName.YEARS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.years.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.years.description', { lng })),
    ...positiveIntegerOptionMeta,
  },
  {
    name: AgoCommandOptionName.MONTHS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.months.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.months.description', { lng })),
    ...positiveIntegerOptionMeta,
  },
  {
    name: AgoCommandOptionName.DAYS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.days.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.days.description', { lng })),
    ...positiveIntegerOptionMeta,
  },
  {
    name: AgoCommandOptionName.HOURS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.hours.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.hours.description', { lng })),
    ...positiveIntegerOptionMeta,
  },
  {
    name: AgoCommandOptionName.MINUTES_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.minutes.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.minutes.description', { lng })),
    ...positiveIntegerOptionMeta,
  },
  {
    name: AgoCommandOptionName.SECONDS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.seconds.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.seconds.description', { lng })),
    ...positiveNumberOptionMeta,
  },
  ...getGlobalOptions(t),
];
