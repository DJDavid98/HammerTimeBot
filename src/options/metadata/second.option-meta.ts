import { NumberOptionMetadata } from '../../types/bot-interaction.js';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

export const secondOptionMeta: NumberOptionMetadata = {
  type: ApplicationCommandOptionType.Number,
  min_value: 0,
  max_value: 59.999,
};
