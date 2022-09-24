import { TFunction } from 'i18next';
import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { InCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getGlobalOptions } from './global.options.js';

export const getInOptions = (t: TFunction): APIApplicationCommandBasicOption[] => [
  {
    name: InCommandOptionName.IN_YEARS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.years.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.years.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: InCommandOptionName.IN_MONTHS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.months.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.months.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: InCommandOptionName.IN_DAYS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.days.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.days.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: InCommandOptionName.IN_HOURS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.hours.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.hours.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: InCommandOptionName.IN_MINUTES,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.minutes.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.minutes.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: InCommandOptionName.IN_SECONDS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.seconds.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.seconds.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  ...getGlobalOptions(t),
];
