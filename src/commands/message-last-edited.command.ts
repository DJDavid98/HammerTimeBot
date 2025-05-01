import moment from 'moment-timezone';
import { BotMessageContextMenuCommand } from '../types/bot-interaction.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getSyntaxReplyOptions } from '../utils/reply-with-syntax.js';
import { ApplicationCommandType, MessageFlags } from 'discord-api-types/v10';
import { getSettings } from '../utils/settings.js';
import { interactionReply } from '../utils/interaction-reply.js';

export const messageLastEditedCommand: BotMessageContextMenuCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.Message,
    ...getLocalizedObject('name', (lng) => t('commands.Message Last Edited.name', { lng }), true, false),
  }),
  async handle(interaction, context) {
    const settings = await getSettings(context, interaction);
    const { t } = context;
    const messageTarget = t('commands.Message Last Edited.responses.targetMessage', { replace: { url: interaction.targetMessage.url } });
    const contentPrefix = `${messageTarget}\n\n`;

    const editTime = interaction.targetMessage.editedAt;
    if (editTime === null) {
      await interactionReply(t, interaction, {
        content: contentPrefix + t('commands.Message Last Edited.responses.notEdited'),
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const localMoment = moment(interaction.targetMessage.editedAt).utc();
    const replyOptions = getSyntaxReplyOptions({ localMoment, interaction, context, settings });
    await interactionReply(t, interaction, {
      content: contentPrefix + replyOptions.content,
      flags: MessageFlags.Ephemeral,
    });
  },
};
