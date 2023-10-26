import moment from 'moment-timezone';
import { BotChatInputCommand } from '../types/bot-interaction.js';
import { IsoCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { getIsoCommandOptions } from '../options/iso.options.js';
import { getSettings } from '../utils/settings.js';

export const isoCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.iso.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.iso.name', { lng })),
    options: getIsoCommandOptions(t),
  }),
  async handle(interaction, context) {
    const settings = await getSettings(context, interaction);
    const { t } = context;
    const value = interaction.options.getString(IsoCommandOptionName.VALUE, true);
    // Apply user's timezone settings, if available
    const timezone = settings.timezone ?? 'UTC';
    const localMoment = moment.tz(value, moment.ISO_8601, timezone);
    if (!localMoment.isValid()) {
      await interaction.reply({
        content: t('commands.iso.responses.invalidIsoFormat'),
        ephemeral: true,
      });
      return;
    }

    await replyWithSyntax({ localMoment, interaction, t, settings, timezone });
  },
};
