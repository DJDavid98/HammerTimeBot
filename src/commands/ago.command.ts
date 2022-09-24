import { BotCommand } from '../types/bot-interaction.js';
import { adjustMoment } from '../utils/time.js';
import { AgoCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getAgoOptions } from '../options/ago.options.js';

export const agoCommand: BotCommand = {
  getDefinition: (t) => ({
    ...getLocalizedObject('description', (lng) => t('commands.ago.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.ago.name', { lng })),
    options: getAgoOptions(t),
  }),
  async handle(interaction, t) {
    const subtractOptions = {
      years: interaction.options.getNumber(AgoCommandOptionName.YEARS_AGO),
      months: interaction.options.getNumber(AgoCommandOptionName.MONTHS_AGO),
      days: interaction.options.getNumber(AgoCommandOptionName.DAYS_AGO),
      hours: interaction.options.getNumber(AgoCommandOptionName.HOURS_AGO),
      minutes: interaction.options.getNumber(AgoCommandOptionName.MINUTES_AGO),
      seconds: interaction.options.getNumber(AgoCommandOptionName.SECONDS_AGO),
    };

    const localMoment = adjustMoment(subtractOptions, 'subtract');

    await replyWithSyntax(localMoment, interaction, t);
  },
};
