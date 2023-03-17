import moment from 'moment';
import { getSnowflakeCommandOptions } from '../options/snowflake.options.js';
import { BotCommand } from '../types/bot-interaction.js';
import { SnowflakeCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';

const DISCORD_EPOCH = 1420070400000;

export const snowflakeCommand: BotCommand = {
  getDefinition: (t) => ({
    ...getLocalizedObject('description', (lng) => t('commands.snowflake.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.snowflake.name', { lng })),
    options: getSnowflakeCommandOptions(t),
  }),
  async handle(interaction, t) {
    const snowflake = interaction.options.getString(SnowflakeCommandOptionName.VALUE, true);
    let unixValue;
    try {
      unixValue = snowflakeToUnix(snowflake);
    } catch (e) {
      await interaction.reply({
        content: t('commands.snowflake.responses.invalidSnowflake'),
        ephemeral: true,
      });
      return;
    }
    const localMoment = moment.unix(unixValue).utc();

    await replyWithSyntax(localMoment, interaction, t);
  },
};

function snowflakeToUnix(snowflake: string) {
  let snowflakeNumber;
  try {
    snowflakeNumber = BigInt(snowflake);
  } catch (e) {
    throw new Error('Invalid snowflake. Snowflakes must be a valid number.');
  }

  if (snowflakeNumber < 4194304) {
    throw new Error('Invalid snowflake. Snowflakes must be greater than 4194303.');
  }



  return (Number(BigInt(snowflake) >> 22n) + DISCORD_EPOCH) / 1000;
}
