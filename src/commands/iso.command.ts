import moment from 'moment-timezone';
import { BotChatInputCommand } from '../types/bot-interaction.js';
import { IsoCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { getIsoCommandOptions } from '../options/iso.options.js';

export const isoCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.iso.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.iso.name', { lng })),
    options: getIsoCommandOptions(t),
  }),
  async handle(interaction, t) {
    const value = interaction.options.getString(IsoCommandOptionName.VALUE, true);
    const parsedValue = moment(value, moment.ISO_8601);
    if (!parsedValue.isValid()) {
      await interaction.reply({
        content: t('commands.iso.responses.invalidIsoFormat'),
        ephemeral: true,
      });
      return;
    }
    const localMoment = parsedValue.utc();

    await replyWithSyntax(localMoment, interaction, t);
  },
};
