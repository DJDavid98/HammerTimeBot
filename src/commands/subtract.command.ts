import moment from 'moment-timezone';
import { BotCommand } from '../types/bot-interaction.js';
import { adjustMoment } from '../utils/time.js';
import { SubtractCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getSubtractOptions } from '../options/subtract.options.js';

export const subtractCommand: BotCommand = {
  getDefinition: (t) => ({
    ...getLocalizedObject('description', (lng) => t('commands.subtract.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.subtract.name', { lng })),
    options: getSubtractOptions(t),
  }),
  async handle(interaction, t) {
    const from = interaction.options.getNumber(SubtractCommandOptionName.FROM, true);
    const now = moment.unix(from).utc();
    const addOptions = {
      years: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_YEARS),
      months: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_MONTHS),
      days: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_DAYS),
      hours: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_HOURS),
      minutes: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_MINUTES),
      seconds: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_SECONDS),
    };

    const localMoment = adjustMoment(addOptions, 'subtract', now);

    await replyWithSyntax(localMoment, interaction, t);
  },
};
