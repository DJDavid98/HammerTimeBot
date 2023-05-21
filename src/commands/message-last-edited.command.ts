import moment from 'moment-timezone';
import { BotMessageContextMenuCommand } from '../types/bot-interaction.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getSyntaxReplyOptions } from '../utils/reply-with-syntax.js';
import { ApplicationCommandType } from 'discord-api-types/v10';

export const messageLastEditedCommand: BotMessageContextMenuCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.Message,
    ...getLocalizedObject('name', (lng) => t('commands.Message Last Edited.name', { lng }), true, false),
  }),
  async handle(interaction, t) {
    const messageTarget = t('commands.Message Last Edited.responses.targetMessage', { replace: { url: interaction.targetMessage.url } });
    const contentPrefix = `${messageTarget}\n\n`;

    const editTime = interaction.targetMessage.editedAt;
    if (editTime === null) {
      await interaction.reply({
        content: contentPrefix + t('commands.Message Last Edited.responses.notEdited'),
        ephemeral: true,
      });
      return;
    }
    const localMoment = moment(interaction.targetMessage.editedAt).utc();
    const replyOptions = getSyntaxReplyOptions(localMoment, interaction, t);
    await interaction.reply({
      content: contentPrefix + replyOptions.content,
      ephemeral: replyOptions.ephemeral,
    });
  },
};
