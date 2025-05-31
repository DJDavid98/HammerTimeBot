import moment from 'moment-timezone';
import { BotChatInputCommand } from '../types/bot-interaction.js';
import { adjustMoment } from '../utils/time.js';
import { SubtractCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getSubtractOptions } from '../options/subtract.options.js';
import { atLeastOneNonZeroKey } from '../utils/at-least-one-non-zero-key.js';
import { ApplicationCommandType, MessageFlags } from 'discord-api-types/v10';
import { interactionReply } from '../utils/interaction-reply.js';

export const subtractCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.subtract.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.subtract.name', { lng })),
    options: getSubtractOptions(t),
  }),
  async handle(interaction, context) {
    const settings = await context.getSettings();
    const { t } = context;
    const from = interaction.options.getNumber(SubtractCommandOptionName.FROM, true);
    const now = moment.unix(from).utc();
    const options = {
      years: interaction.options.getInteger(SubtractCommandOptionName.SUBTRACT_YEARS),
      months: interaction.options.getInteger(SubtractCommandOptionName.SUBTRACT_MONTHS),
      days: interaction.options.getInteger(SubtractCommandOptionName.SUBTRACT_DAYS),
      hours: interaction.options.getInteger(SubtractCommandOptionName.SUBTRACT_HOURS),
      minutes: interaction.options.getInteger(SubtractCommandOptionName.SUBTRACT_MINUTES),
      seconds: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_SECONDS),
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

    const localMoment = adjustMoment(options, 'subtract', now);

    await replyWithSyntax({ localMoment, interaction, context, settings, timezone: undefined });
  },
};
