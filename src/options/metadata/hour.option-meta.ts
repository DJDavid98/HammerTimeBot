import { StringOptionMetadata } from '../../types/bot-interaction.js';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

export const hourOptionMeta: StringOptionMetadata = {
  type: ApplicationCommandOptionType.String,
  autocomplete: true,
};
