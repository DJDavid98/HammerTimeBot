import { TFunction } from 'i18next';
import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { IsoCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getGlobalOptions, getTimezoneOption } from './global.options.js';
import { isoValueOptionMeta } from './metadata/iso-value.option-meta.js';

export const getIsoCommandOptions = (t: TFunction): APIApplicationCommandOption[] => [
  {
    name: IsoCommandOptionName.VALUE,
    ...getLocalizedObject('name', (lng) => t('commands.iso.options.value.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.iso.options.value.description', { lng })),
    ...isoValueOptionMeta,
    required: true,
  },
  getTimezoneOption(t),
  ...getGlobalOptions(t),
];
