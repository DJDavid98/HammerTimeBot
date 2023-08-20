import { TFunction } from 'i18next';
import { APIApplicationCommandOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { UnixCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getGlobalOptions } from './global.options.js';

export const getUnixCommandOptions = (t: TFunction): APIApplicationCommandOption[] => [
  {
    name: UnixCommandOptionName.VALUE,
    ...getLocalizedObject('name', (lng) => t('commands.unix.options.value.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.unix.options.value.description', { lng })),
    type: ApplicationCommandOptionType.Number,
    required: true,
  },
  ...getGlobalOptions(t),
];
