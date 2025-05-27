import { IntegerOptionMetadata } from '../../types/bot-interaction.js';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

export const dayOptionMeta: IntegerOptionMetadata = {
  type: ApplicationCommandOptionType.Integer,
  min_value: 1,
  max_value: 31,
};
