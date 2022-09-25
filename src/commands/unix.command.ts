import moment from 'moment-timezone';
import { BotCommand } from '../types/bot-interaction.js';
import { UnixCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getUnixCommandOptions } from '../options/unix.options.js';

export const unixCommand: BotCommand = {
  getDefinition: (t) => ({
    ...getLocalizedObject('description', (lng) => t('commands.unix.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.unix.name', { lng })),
    options: getUnixCommandOptions(t),
  }),
  async handle(interaction, t) {
    const value = interaction.options.getNumber(UnixCommandOptionName.VALUE, true);
    const localMoment = moment.unix(value).utc();

    await replyWithSyntax(localMoment, interaction, t);
  },
};
