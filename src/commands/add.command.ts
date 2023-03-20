import moment from 'moment-timezone';
import { BotCommand } from '../types/bot-interaction.js';
import { adjustMoment } from '../utils/time.js';
import { AddCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getAddOptions } from '../options/add.options.js';
import { atLeastOneNonZeroKey } from '../utils/at-least-one-non-zero-key.js';

export const addCommand: BotCommand = {
  getDefinition: (t) => ({
    ...getLocalizedObject('description', (lng) => t('commands.add.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.add.name', { lng })),
    options: getAddOptions(t),
  }),
  async handle(interaction, t) {
    const to = interaction.options.getNumber(AddCommandOptionName.TO, true);
    const now = moment.unix(to).utc();
    const options = {
      years: interaction.options.getNumber(AddCommandOptionName.ADD_YEARS),
      months: interaction.options.getNumber(AddCommandOptionName.ADD_MONTHS),
      days: interaction.options.getNumber(AddCommandOptionName.ADD_DAYS),
      hours: interaction.options.getNumber(AddCommandOptionName.ADD_HOURS),
      minutes: interaction.options.getNumber(AddCommandOptionName.ADD_MINUTES),
      seconds: interaction.options.getNumber(AddCommandOptionName.ADD_SECONDS),
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

    const localMoment = adjustMoment(options, 'add', now);

    await replyWithSyntax(localMoment, interaction, t);
  },
};
