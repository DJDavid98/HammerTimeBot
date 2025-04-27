import moment from 'moment-timezone';
import { BotChatInputCommand } from '../types/bot-interaction.js';
import { GlobalCommandOptionName, IsoCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { ApplicationCommandType, MessageFlags } from 'discord-api-types/v10';
import { getIsoCommandOptions } from '../options/iso.options.js';
import { getSettings } from '../utils/settings.js';
import { findTimezoneOptionValue, handleTimezoneAutocomplete } from '../utils/messaging.js';

export const isoCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.iso.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.iso.name', { lng })),
    options: getIsoCommandOptions(t),
  }),
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);

    switch (focusedOption.name) {
      case GlobalCommandOptionName.TIMEZONE:
        await handleTimezoneAutocomplete(interaction);
        break;
      default:
        throw new Error(`Unknown autocomplete option ${focusedOption.name}`);
    }
  },
  async handle(interaction, context) {
    const settings = await getSettings(context, interaction);
    const { t } = context;
    const value = interaction.options.getString(IsoCommandOptionName.VALUE, true);
    const timezone = await findTimezoneOptionValue(t, interaction, settings);
    if (timezone === null) {
      return;
    }

    const localMoment = moment.tz(value, moment.ISO_8601, timezone);
    if (!localMoment.isValid()) {
      await interaction.reply({
        content: t('commands.iso.responses.invalidIsoFormat'),
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await replyWithSyntax({ localMoment, interaction, context, settings, timezone });
  },
};
