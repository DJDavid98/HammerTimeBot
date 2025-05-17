import { BotChatInputCommand } from '../types/bot-interaction.js';
import { adjustDate, TimeMap } from '../utils/time.js';
import { SubtractCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getSubtractOptions } from '../options/subtract.options.js';
import { atLeastOneNonZeroKey } from '../utils/at-least-one-non-zero-key.js';
import { ApplicationCommandType, MessageFlags } from 'discord-api-types/v10';
import { getSettings } from '../utils/settings.js';
import { interactionReply } from '../utils/interaction-reply.js';
import { TZDate } from '@date-fns/tz';

export const subtractCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.subtract.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.subtract.name', { lng })),
    options: getSubtractOptions(t),
  }),
  async handle(interaction, context) {
    const settings = await getSettings(context, interaction);
    const { t } = context;
    const from = interaction.options.getNumber(SubtractCommandOptionName.FROM, true);
    const now = TZDate.tz('UTC', from * 1e3);
    const options: TimeMap = {
      years: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_YEARS),
      months: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_MONTHS),
      days: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_DAYS),
      hours: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_HOURS),
      minutes: interaction.options.getNumber(SubtractCommandOptionName.SUBTRACT_MINUTES),
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

    const localDate = adjustDate(options, 'subtract', now);

    await replyWithSyntax({ localDate, interaction, context, settings, timezone: undefined });
  },
};
