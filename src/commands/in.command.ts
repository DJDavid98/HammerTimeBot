import { BotCommand } from '../types/bot-interaction.js';
import { adjustMoment } from '../utils/time.js';
import { InCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getInOptions } from '../options/in.options.js';

export const inCommand: BotCommand = {
  getDefinition: (t) => ({
    ...getLocalizedObject('description', (lng) => t('commands.in.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.in.name', { lng })),
    options: getInOptions(t),
  }),
  async handle(interaction, t) {
    const addOptions = {
      years: interaction.options.getNumber(InCommandOptionName.IN_YEARS),
      months: interaction.options.getNumber(InCommandOptionName.IN_MONTHS),
      days: interaction.options.getNumber(InCommandOptionName.IN_DAYS),
      hours: interaction.options.getNumber(InCommandOptionName.IN_HOURS),
      minutes: interaction.options.getNumber(InCommandOptionName.IN_MINUTES),
      seconds: interaction.options.getNumber(InCommandOptionName.IN_SECONDS),
    };

    const localMoment = adjustMoment(addOptions, 'add');

    await replyWithSyntax(localMoment, interaction, t);
  },
};
