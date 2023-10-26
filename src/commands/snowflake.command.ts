import moment from 'moment';
import { getSnowflakeCommandOptions } from '../options/snowflake.options.js';
import { BotChatInputCommand } from '../types/bot-interaction.js';
import { SnowflakeCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import snowflakeToUnix from '../utils/snowflake.js';
import { SnowflakeError } from '../classes/snowflake-error.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { getSettings } from '../utils/settings.js';

export const snowflakeCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.snowflake.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.snowflake.name', { lng })),
    options: getSnowflakeCommandOptions(t),
  }),
  async handle(interaction, context) {
    const settings = await getSettings(context, interaction);
    const { t } = context;
    const snowflake = interaction.options.getString(SnowflakeCommandOptionName.VALUE, true);
    let unixValue;
    try {
      unixValue = snowflakeToUnix(snowflake);
    } catch (e) {
      if (e instanceof SnowflakeError) {
        await interaction.reply({
          content: t('commands.snowflake.responses.invalidSnowflake'),
          ephemeral: true,
        });
        return;
      }

      throw e;
    }
    const localMoment = moment.unix(unixValue).utc();

    await replyWithSyntax({ localMoment, interaction, t, settings, timezone: undefined });
  },
};
