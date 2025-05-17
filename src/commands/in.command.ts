import { BotChatInputCommand } from '../types/bot-interaction.js';
import { adjustDate, TimeMap } from '../utils/time.js';
import { InCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getInOptions } from '../options/in.options.js';
import { atLeastOneNonZeroKey } from '../utils/at-least-one-non-zero-key.js';
import { ApplicationCommandType, MessageFlags } from 'discord-api-types/v10';
import { getSettings } from '../utils/settings.js';
import { TZDate } from '@date-fns/tz';

export const inCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.in.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.in.name', { lng })),
    options: getInOptions(t),
  }),
  async handle(interaction, context) {
    const settings = await getSettings(context, interaction);
    const { t } = context;
    const options: TimeMap = {
      years: interaction.options.getNumber(InCommandOptionName.IN_YEARS),
      months: interaction.options.getNumber(InCommandOptionName.IN_MONTHS),
      days: interaction.options.getNumber(InCommandOptionName.IN_DAYS),
      hours: interaction.options.getNumber(InCommandOptionName.IN_HOURS),
      minutes: interaction.options.getNumber(InCommandOptionName.IN_MINUTES),
      seconds: interaction.options.getNumber(InCommandOptionName.IN_SECONDS),
    };

    if (!atLeastOneNonZeroKey(options)) {
      await interaction.reply({
        content: t('commands.global.responses.noComponentsCurrentTime', {
          replace: {
            atCommand: t('commands.at.name'),
          },
        }),
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // Fixed value for relative timestamps
    const timezone = 'UTC';
    const localDate = adjustDate(options, 'add', TZDate.tz(timezone));

    await replyWithSyntax({ localDate, interaction, context, timezone, settings });
  },
};
