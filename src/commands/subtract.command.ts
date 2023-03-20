import moment from 'moment-timezone';
import { BotChatInputCommand } from '../types/bot-interaction.js';
import { adjustMoment } from '../utils/time.js';
import { SubtractCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getSubtractOptions } from '../options/subtract.options.js';
import { atLeastOneNonZeroKey } from '../utils/at-least-one-non-zero-key.js';
import { ApplicationCommandType } from 'discord-api-types/v10';

export const subtractCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.subtract.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.subtract.name', { lng })),
    options: getSubtractOptions(t),
  }),
  async handle(interaction, t) {
    const from = interaction.options.getNumber(SubtractCommandOptionName.FROM, true);
    const now = moment.unix(from).utc();
    const options = {
      years: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_YEARS),
      months: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_MONTHS),
      days: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_DAYS),
      hours: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_HOURS),
      minutes: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_MINUTES),
      seconds: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_SECONDS),
    };

    if (!atLeastOneNonZeroKey(options)) {
      await interaction.reply({
        content: t('commands.global.responses.noComponentsUnix', {
          replace: {
            unixCommand: t('commands.unix.name'),
          },
        }),
        ephemeral: true,
      });
      return;
    }

    const localMoment = adjustMoment(options, 'subtract', now);

    await replyWithSyntax(localMoment, interaction, t);
  },
};
