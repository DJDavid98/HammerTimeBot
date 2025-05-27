import { IntegerOptionMetadata } from '../../types/bot-interaction.js';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

export const minuteOptionMeta: IntegerOptionMetadata = {
  type: ApplicationCommandOptionType.Integer,
  min_value: 0,
  max_value: 59,
};
