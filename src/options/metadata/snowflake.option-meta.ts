import { StringOptionMetadata } from '../../types/bot-interaction.js';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

const exampleSnowflake = '952258283882819595';

export const snowflakeOptionMeta: StringOptionMetadata = {
  type: ApplicationCommandOptionType.String,
  min_length: exampleSnowflake.length,
  max_length: exampleSnowflake.length,
};
