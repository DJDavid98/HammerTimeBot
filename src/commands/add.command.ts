import moment from 'moment-timezone';
import { BotChatInputCommand } from '../types/bot-interaction.js';
import { adjustMoment } from '../utils/time.js';
import { AddCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getAddOptions } from '../options/add.options.js';
import { atLeastOneNonZeroKey } from '../utils/at-least-one-non-zero-key.js';
import { getSettings } from '../utils/settings.js';
import { MessageFlags } from 'discord-api-types/v10';
import { interactionReply } from '../utils/interaction-reply.js';

export const addCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    ...getLocalizedObject('description', (lng) => t('commands.add.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.add.name', { lng })),
    options: getAddOptions(t),
  }),
  async handle(interaction, context) {
    const settings = await getSettings(context, interaction);
    const { t } = context;
    const to = interaction.options.getNumber(AddCommandOptionName.TO, true);
    const now = moment.unix(to).utc();
    const options = {
      years: interaction.options.getInteger(AddCommandOptionName.ADD_YEARS),
      months: interaction.options.getInteger(AddCommandOptionName.ADD_MONTHS),
      days: interaction.options.getInteger(AddCommandOptionName.ADD_DAYS),
      hours: interaction.options.getInteger(AddCommandOptionName.ADD_HOURS),
      minutes: interaction.options.getInteger(AddCommandOptionName.ADD_MINUTES),
      seconds: interaction.options.getNumber(AddCommandOptionName.ADD_SECONDS),
    };

    if (!atLeastOneNonZeroKey(options)) {
      await interactionReply(t, interaction, {
        content: t('commands.global.responses.noComponentsUnix', {
          replace: {
            unixCommand: t('commands.unix.name'),
          },
        }),
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const localMoment = adjustMoment(options, 'add', now);

    await replyWithSyntax({
      localMoment,
      interaction,
      context,
      settings,
      timezone: undefined,
    });
  },
};
