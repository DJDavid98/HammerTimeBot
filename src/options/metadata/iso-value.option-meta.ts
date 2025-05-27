import { StringOptionMetadata } from '../../types/bot-interaction.js';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

export const isoValueOptionMeta: StringOptionMetadata = {
  type: ApplicationCommandOptionType.String,
  min_length: '1970-01-01'.length,
  max_length: '1970-01-01T00:00:00+00:00'.length,
};
