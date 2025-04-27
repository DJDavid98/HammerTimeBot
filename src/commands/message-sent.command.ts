import moment from 'moment-timezone';
import { BotMessageContextMenuCommand } from '../types/bot-interaction.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getSyntaxReplyOptions } from '../utils/reply-with-syntax.js';
import { ApplicationCommandType, MessageFlags } from 'discord-api-types/v10';
import { getSettings } from '../utils/settings.js';

export const messageSentCommand: BotMessageContextMenuCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.Message,
    ...getLocalizedObject('name', (lng) => t('commands.Message Sent.name', { lng }), true, false),
  }),
  async handle(interaction, context) {
    const settings = await getSettings(context, interaction);
    const { t } = context;
    const messageTarget = t('commands.Message Sent.responses.targetMessage', { replace: { url: interaction.targetMessage.url } });
    const contentPrefix = `${messageTarget}\n\n`;

    const localMoment = moment(interaction.targetMessage.createdAt).utc();
    const replyOptions = getSyntaxReplyOptions({ localMoment, interaction, t, settings });
    await interaction.reply({
      content: contentPrefix + replyOptions.content,
      flags: MessageFlags.Ephemeral,
    });
  },
};
