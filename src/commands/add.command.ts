import moment from 'moment-timezone';
import { BotCommand } from '../types/bot-interaction.js';
import { adjustMoment } from '../utils/time.js';
import { AddCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getAddOptions } from '../options/add.options.js';

export const addCommand: BotCommand = {
  getDefinition: (t) => ({
    ...getLocalizedObject('description', (lng) => t('commands.add.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.add.name', { lng })),
    options: getAddOptions(t),
  }),
  async handle(interaction, t) {
    const to = interaction.options.getNumber(AddCommandOptionName.TO, true);
    const now = moment.unix(to).utc();
    const addOptions = {
      years: interaction.options.getNumber(AddCommandOptionName.ADD_YEARS),
      months: interaction.options.getNumber(AddCommandOptionName.ADD_MONTHS),
      days: interaction.options.getNumber(AddCommandOptionName.ADD_DAYS),
      hours: interaction.options.getNumber(AddCommandOptionName.ADD_HOURS),
      minutes: interaction.options.getNumber(AddCommandOptionName.ADD_MINUTES),
      seconds: interaction.options.getNumber(AddCommandOptionName.ADD_SECONDS),
    };

    const localMoment = adjustMoment(addOptions, 'add', now);

    await replyWithSyntax(localMoment, interaction, t);
  },
};
