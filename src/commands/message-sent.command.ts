import { BotMessageContextMenuCommand } from '../types/bot-interaction.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { getSyntaxReplyOptions } from '../utils/reply-with-syntax.js';
import { ApplicationCommandType, ComponentType, MessageFlags } from 'discord-api-types/v10';
import { getSettings } from '../utils/settings.js';
import { interactionReply } from '../utils/interaction-reply.js';
import { TZDate } from '@date-fns/tz';

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

    const localDate = TZDate.tz('UTC', interaction.targetMessage.createdAt);
    const replyOptions = getSyntaxReplyOptions({ localDate, interaction, context, settings });
    await interactionReply(t, interaction, replyOptions.components ? {
      ...replyOptions,
      components: [
        {
          type: ComponentType.TextDisplay,
          content: contentPrefix,
        },
        ...replyOptions.components,
      ],
    } : {
      content: contentPrefix + replyOptions.content,
      flags: MessageFlags.Ephemeral,
    });
  },
};
