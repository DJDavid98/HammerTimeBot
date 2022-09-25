import { TFunction } from 'i18next';
import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { AddCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getGlobalOptions } from './global.options.js';

export const getAddOptions = (t: TFunction): APIApplicationCommandBasicOption[] => [
  {
    name: AddCommandOptionName.TO,
    ...getLocalizedObject('name', (lng) => t('commands.add.options.to.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.add.options.to.description', { lng })),
    type: ApplicationCommandOptionType.Number,
    required: true,
  },
  {
    name: AddCommandOptionName.ADD_YEARS,
    ...getLocalizedObject('name', (lng) => t('commands.add.options.years.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.add.options.years.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AddCommandOptionName.ADD_MONTHS,
    ...getLocalizedObject('name', (lng) => t('commands.add.options.months.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.add.options.months.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AddCommandOptionName.ADD_DAYS,
    ...getLocalizedObject('name', (lng) => t('commands.add.options.days.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.add.options.days.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AddCommandOptionName.ADD_HOURS,
    ...getLocalizedObject('name', (lng) => t('commands.add.options.hours.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.add.options.hours.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AddCommandOptionName.ADD_MINUTES,
    ...getLocalizedObject('name', (lng) => t('commands.add.options.minutes.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.add.options.minutes.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AddCommandOptionName.ADD_SECONDS,
    ...getLocalizedObject('name', (lng) => t('commands.add.options.seconds.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.add.options.seconds.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  ...getGlobalOptions(t),
];
