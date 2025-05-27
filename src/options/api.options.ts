import { APIApplicationCommandOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { ApiCommandOptionName } from '../types/localization.js';

export const getApiCommandOptions = (): APIApplicationCommandOption[] => [
  {
    type: ApplicationCommandOptionType.Subcommand,
    name: ApiCommandOptionName.UPDATE_BOT_COMMANDS,
    description: 'Update bot command data in the API',
  },
  {
    type: ApplicationCommandOptionType.Subcommand,
    name: ApiCommandOptionName.UPDATE_BOT_TIMEZONES,
    description: 'Update bot timezone data in the API',
  },
];
