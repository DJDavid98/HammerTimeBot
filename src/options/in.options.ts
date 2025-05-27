import { TFunction } from 'i18next';
import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { InCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getGlobalOptions } from './global.options.js';
import { positiveIntegerOptionMeta } from './metadata/positive-integer-option.meta.js';
import { positiveNumberOptionMeta } from './metadata/positive-number-option.meta.js';

export const getInOptions = (t: TFunction): APIApplicationCommandOption[] => [
  {
    name: InCommandOptionName.IN_YEARS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.years.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.years.description', { lng })),
    ...positiveIntegerOptionMeta,
  },
  {
    name: InCommandOptionName.IN_MONTHS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.months.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.months.description', { lng })),
    ...positiveIntegerOptionMeta,
  },
  {
    name: InCommandOptionName.IN_DAYS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.days.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.days.description', { lng })),
    ...positiveIntegerOptionMeta,
  },
  {
    name: InCommandOptionName.IN_HOURS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.hours.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.hours.description', { lng })),
    ...positiveIntegerOptionMeta,
  },
  {
    name: InCommandOptionName.IN_MINUTES,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.minutes.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.minutes.description', { lng })),
    ...positiveIntegerOptionMeta,
  },
  {
    name: InCommandOptionName.IN_SECONDS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.seconds.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.seconds.description', { lng })),
    ...positiveNumberOptionMeta,
  },
  ...getGlobalOptions(t),
];
