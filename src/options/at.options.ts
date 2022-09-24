import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { TFunction } from 'i18next';
import { AtCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getGlobalOptions } from './global.options.js';

export const getAtOptions = (t: TFunction): APIApplicationCommandBasicOption[] => [
  {
    name: AtCommandOptionName.YEAR,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.year.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.year.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AtCommandOptionName.MONTH,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.month.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.month.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AtCommandOptionName.DATE,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.day.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.day.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AtCommandOptionName.HOUR,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.hour.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.hour.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AtCommandOptionName.MINUTE,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.minute.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.minute.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AtCommandOptionName.SECOND,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.second.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.second.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: AtCommandOptionName.TIMEZONE,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.timezone.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.timezone.description', { lng })),
    type: ApplicationCommandOptionType.String,
    autocomplete: true,
  },
  ...getGlobalOptions(t),
];
