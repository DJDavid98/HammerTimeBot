import { BotMessageContextMenuCommand } from '../types/bot-interaction.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { ApplicationCommandType, MessageFlags } from 'discord-api-types/v10';
import { extractTimestampsFromStrings } from '../utils/extract-timestamps-from-strings.js';
import { RESPONSE_FORMATTERS } from '../utils/time.js';
import { ResponseColumnChoices } from '../types/localization.js';

export const extractTimestampsCommand: BotMessageContextMenuCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.Message,
    ...getLocalizedObject('name', (lng) => t('commands.Extract Timestamps.name', { lng }), true, false),
  }),
  async handle(interaction, { t }) {
    const messageTarget = t('commands.Extract Timestamps.responses.targetMessage', { replace: { url: interaction.targetMessage.url } });
    const contentPrefix = `${messageTarget}\n\n`;

    const timestamps = extractTimestampsFromStrings([
      interaction.targetMessage.content,
      ...interaction.targetMessage.embeds.reduce((acc, embed) => {
        if (embed.title) {
          acc.push(embed.title);
        }
        if (embed.description) {
          acc.push(embed.description);
        }
        if (embed.footer?.text) {
          acc.push(embed.footer.text);
        }
        if (embed.fields) {
          embed.fields.forEach(field => {
            if (field.name) {
              acc.push(field.name);
            }
            if (field.value) {
              acc.push(field.value);
            }
          });
        }
        return acc;
      }, [] as string[]),
    ]);
    if (timestamps.length === 0) {
      await interaction.reply({
        content: contentPrefix + t('commands.Extract Timestamps.responses.noTimestamps'),
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.reply({
      content: contentPrefix + timestamps.map(ts => `• ${RESPONSE_FORMATTERS[ResponseColumnChoices.BOTH](ts)}`).join('\n'),
      flags: MessageFlags.Ephemeral,
    });
  },
};
