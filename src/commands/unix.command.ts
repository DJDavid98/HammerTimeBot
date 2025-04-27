import moment from 'moment-timezone';
import { BotChatInputCommand } from '../types/bot-interaction.js';
import { UnixCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getUnixCommandOptions } from '../options/unix.options.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { getSettings } from '../utils/settings.js';

export const unixCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.unix.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.unix.name', { lng })),
    options: getUnixCommandOptions(t),
  }),
  async handle(interaction, context) {
    const settings = await getSettings(context, interaction);
    const value = interaction.options.getNumber(UnixCommandOptionName.VALUE, true);
    const localMoment = moment.unix(value).utc();

    await replyWithSyntax({ localMoment, interaction, context, settings, timezone: undefined });
  },
};
