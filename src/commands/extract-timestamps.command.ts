import { BotMessageContextMenuCommand } from '../types/bot-interaction.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { extractTimestampsFromString } from '../utils/extract-timestamps-from-string.js';
import { RESPONSE_FORMATTERS } from '../utils/time.js';
import { ResponseColumnChoices } from '../types/localization.js';

export const extractTimestampsCommand: BotMessageContextMenuCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.Message,
    ...getLocalizedObject('name', (lng) => t('commands.Extract Timestamps.name', { lng })),
  }),
  async handle(interaction, t) {
    const messageTarget = t('commands.Extract Timestamps.responses.targetMessage', { replace: { url: interaction.targetMessage.url } });
    const contentPrefix = `${messageTarget}\n\n`;

    const timestamps = extractTimestampsFromString(interaction.targetMessage.content);
    if (timestamps.length === 0) {
      await interaction.reply({
        content: contentPrefix + t('commands.Extract Timestamps.responses.noTimestamps'),
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: contentPrefix + timestamps.map(ts => `• ${RESPONSE_FORMATTERS[ResponseColumnChoices.BOTH](ts)}`).join('\n'),
      ephemeral: true,
    });
  },
};
