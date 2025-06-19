import moment, { Moment } from 'moment-timezone';
import { BotChatInputCommand } from '../types/bot-interaction.js';
import { constrain, convertHour12To24, getGmtTimezoneValue, gmtZoneRegex } from '../utils/time.js';
import { At12CommandOptionName, GlobalCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { ApplicationCommandType, MessageFlags } from 'discord-api-types/v10';
import { findTimezoneOptionValue, handleTimezoneAutocomplete } from '../utils/messaging.js';
import { interactionReply } from '../utils/interaction-reply.js';
import { getAt12Options } from '../options/at12.options.js';

export const at12Command: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.at12.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.at12.name', { lng })),
    options: getAt12Options(t),
  }),
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);

    switch (focusedOption.name) {
      case GlobalCommandOptionName.TIMEZONE:
        await handleTimezoneAutocomplete(interaction);
        break;
      default:
        throw new Error(`Unknown autocomplete option ${focusedOption.name}`);
    }
  },
  async handle(interaction, context) {
    const settings = await context.getSettings();
    const { t } = context;
    const year = interaction.options.getInteger(At12CommandOptionName.YEAR);
    const month = interaction.options.getInteger(At12CommandOptionName.MONTH);
    const date = interaction.options.getInteger(At12CommandOptionName.DATE);
    const hour12 = interaction.options.getInteger(At12CommandOptionName.HOUR) ?? settings.defaultAt12Hour;
    const minute = interaction.options.getInteger(At12CommandOptionName.MINUTE) ?? settings.defaultAtMinute;
    const second = interaction.options.getNumber(At12CommandOptionName.SECOND) ?? settings.defaultAtSecond;
    const am = interaction.options.getBoolean(At12CommandOptionName.AM);
    const pm = interaction.options.getBoolean(At12CommandOptionName.PM);

    if (am !== null && pm !== null) {
      await interactionReply(t, interaction, {
        content: t('commands.at12.responses.amOrPmOnly'),
        flags: MessageFlags.Ephemeral,
      });
      return;
    } else if (am === null && pm === null) {
      await interactionReply(t, interaction, {
        content: t('commands.at12.responses.meridiemRequired'),
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const hour = convertHour12To24(hour12, am, pm);

    const timezone = await findTimezoneOptionValue(t, interaction, settings);
    if (timezone === null) {
      return;
    }

    let localMoment: Moment;
    try {
      if (gmtZoneRegex.test(timezone)) {
        const utcOffset = getGmtTimezoneValue(timezone, 0);
        localMoment = moment.tz('UTC').utcOffset(utcOffset.toString());
      } else {
        localMoment = moment.tz(timezone);
      }
      localMoment = localMoment.millisecond(0);
      if (year !== null) localMoment.year(constrain(year, 0, 275759));
      if (month !== null) localMoment.month(constrain(month - 1, 0, 11));
      if (date !== null) localMoment.date(constrain(date, 1, 31));
      if (hour !== null) localMoment.hour(constrain(hour, 0, 23));
      if (minute !== null) localMoment.minute(constrain(minute, 0, 59));
      if (second !== null) localMoment.second(constrain(second, 0, 59));
    } catch (e) {
      if (e instanceof RangeError && e.message === 'Invalid date') {
        await interactionReply(t, interaction, {
          content: t('commands.global.responses.invalidDate'),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      throw e;
    }

    await replyWithSyntax({ localMoment, interaction, context, timezone, settings });
  },
};
