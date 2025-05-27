import { StringOptionMetadata } from '../../types/bot-interaction.js';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

export const snowflakeOptionMeta: StringOptionMetadata = {
  type: ApplicationCommandOptionType.String,
  min_length: 1,
};
