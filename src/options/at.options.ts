import { APIApplicationCommandOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { TFunction } from 'i18next';
import { AtCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getGlobalOptions, getTimezoneOption } from './global.options.js';
import { monthOptionMeta } from './metadata/month.option-meta.js';
import { dayOptionMeta } from './metadata/day.option-meta.js';
import { hourOptionMeta } from './metadata/hour.option-meta.js';
import { minuteOptionMeta } from './metadata/minute.option-meta.js';
import { secondOptionMeta } from './metadata/second.option-meta.js';

export const getAtOptions = (t: TFunction): APIApplicationCommandOption[] => [
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
    ...monthOptionMeta,
  },
  {
    name: AtCommandOptionName.DATE,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.day.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.day.description', { lng })),
    ...dayOptionMeta,
  },
  {
    name: AtCommandOptionName.HOUR,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.hour.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.hour.description', { lng })),
    ...hourOptionMeta,
  },
  {
    name: AtCommandOptionName.MINUTE,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.minute.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.minute.description', { lng })),
    ...minuteOptionMeta,
  },
  {
    name: AtCommandOptionName.SECOND,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.second.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.second.description', { lng })),
    ...secondOptionMeta,
  },
  getTimezoneOption(t),
  ...getGlobalOptions(t),
];
