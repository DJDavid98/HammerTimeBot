import { NumberOptionMetadata } from '../../types/bot-interaction.js';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

export const positiveNumberOptionMeta: NumberOptionMetadata = {
  type: ApplicationCommandOptionType.Number,
  min_value: 1,
};
