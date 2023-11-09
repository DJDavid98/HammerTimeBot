import { TFunction } from 'i18next';
import { APIApplicationCommandOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { IsoCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getGlobalOptions, getTimezoneOption } from './global.options.js';

export const getIsoCommandOptions = (t: TFunction): APIApplicationCommandOption[] => [
  {
    name: IsoCommandOptionName.VALUE,
    ...getLocalizedObject('name', (lng) => t('commands.iso.options.value.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.iso.options.value.description', { lng })),
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  getTimezoneOption(t),
  ...getGlobalOptions(t),
];
