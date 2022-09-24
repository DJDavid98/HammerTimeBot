import { TFunction } from 'i18next';
import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { AgoCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getGlobalOptions } from './global.options.js';

export const getAgoOptions = (t: TFunction): APIApplicationCommandBasicOption[] => [
  {
    name: AgoCommandOptionName.YEARS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.years.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.years.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AgoCommandOptionName.MONTHS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.months.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.months.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AgoCommandOptionName.DAYS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.days.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.days.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AgoCommandOptionName.HOURS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.hours.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.hours.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AgoCommandOptionName.MINUTES_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.minutes.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.minutes.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AgoCommandOptionName.SECONDS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.seconds.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.seconds.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  ...getGlobalOptions(t),
];
