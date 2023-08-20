import { TFunction } from 'i18next';
import { APIApplicationCommandOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { SubtractCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getGlobalOptions } from './global.options.js';

export const getSubtractOptions = (t: TFunction): APIApplicationCommandOption[] => [
  {
    name: SubtractCommandOptionName.FROM,
    ...getLocalizedObject('name', (lng) => t('commands.subtract.options.from.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.subtract.options.from.description', { lng })),
    type: ApplicationCommandOptionType.Number,
    required: true,
  },
  {
    name: SubtractCommandOptionName.SUBTRACT_YEARS,
    ...getLocalizedObject('name', (lng) => t('commands.subtract.options.years.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.subtract.options.years.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: SubtractCommandOptionName.SUBTRACT_MONTHS,
    ...getLocalizedObject('name', (lng) => t('commands.subtract.options.months.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.subtract.options.months.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: SubtractCommandOptionName.SUBTRACT_DAYS,
    ...getLocalizedObject('name', (lng) => t('commands.subtract.options.days.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.subtract.options.days.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: SubtractCommandOptionName.SUBTRACT_HOURS,
    ...getLocalizedObject('name', (lng) => t('commands.subtract.options.hours.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.subtract.options.hours.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: SubtractCommandOptionName.SUBTRACT_MINUTES,
    ...getLocalizedObject('name', (lng) => t('commands.subtract.options.minutes.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.subtract.options.minutes.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: SubtractCommandOptionName.SUBTRACT_SECONDS,
    ...getLocalizedObject('name', (lng) => t('commands.subtract.options.seconds.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.subtract.options.seconds.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  ...getGlobalOptions(t),
];
