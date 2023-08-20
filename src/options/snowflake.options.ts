import { ApplicationCommandOptionType } from 'discord.js';
import { TFunction } from 'i18next';
import { SnowflakeCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getGlobalOptions } from './global.options.js';
import { APIApplicationCommandOption } from 'discord-api-types/v10';

export const getSnowflakeCommandOptions = (t: TFunction): APIApplicationCommandOption[] => [
  {
    name: SnowflakeCommandOptionName.VALUE,
    ...getLocalizedObject('name', (lng) => t('commands.snowflake.options.value.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.snowflake.options.value.description', { lng })),
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  ...getGlobalOptions(t),
];
