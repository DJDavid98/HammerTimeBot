import { APIApplicationCommandOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { TFunction } from 'i18next';
import { At12CommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getGlobalOptions, getTimezoneOption } from './global.options.js';
import { monthOptionMeta } from './metadata/month.option-meta.js';
import { dayOptionMeta } from './metadata/day.option-meta.js';
import { minuteOptionMeta } from './metadata/minute.option-meta.js';
import { secondOptionMeta } from './metadata/second.option-meta.js';
import { hour12OptionMeta } from './metadata/hour12.option-meta.js';

export const getAt12Options = (t: TFunction): APIApplicationCommandOption[] => [
  {
    name: At12CommandOptionName.YEAR,
    ...getLocalizedObject('name', (lng) => t('commands.at12.options.year.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at12.options.year.description', { lng })),
    type: ApplicationCommandOptionType.Integer,
  },
  {
    name: At12CommandOptionName.MONTH,
    ...getLocalizedObject('name', (lng) => t('commands.at12.options.month.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at12.options.month.description', { lng })),
    ...monthOptionMeta,
  },
  {
    name: At12CommandOptionName.DATE,
    ...getLocalizedObject('name', (lng) => t('commands.at12.options.day.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at12.options.day.description', { lng })),
    ...dayOptionMeta,
  },
  {
    name: At12CommandOptionName.HOUR,
    ...getLocalizedObject('name', (lng) => t('commands.at12.options.hour.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at12.options.hour.description', { lng })),
    ...hour12OptionMeta,
  },
  {
    name: At12CommandOptionName.AM,
    ...getLocalizedObject('name', (lng) => t('commands.at12.options.am.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at12.options.am.description', { lng })),
    type: ApplicationCommandOptionType.Boolean,
  },
  {
    name: At12CommandOptionName.PM,
    ...getLocalizedObject('name', (lng) => t('commands.at12.options.pm.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at12.options.pm.description', { lng })),
    type: ApplicationCommandOptionType.Boolean,
  },
  {
    name: At12CommandOptionName.MINUTE,
    ...getLocalizedObject('name', (lng) => t('commands.at12.options.minute.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at12.options.minute.description', { lng })),
    ...minuteOptionMeta,
  },
  {
    name: At12CommandOptionName.SECOND,
    ...getLocalizedObject('name', (lng) => t('commands.at12.options.second.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at12.options.second.description', { lng })),
    ...secondOptionMeta,
  },
  getTimezoneOption(t),
  ...getGlobalOptions(t),
];
