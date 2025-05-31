import moment, { Moment } from 'moment-timezone';
import { BotChatInputCommand } from '../types/bot-interaction.js';
import { constrain, getGmtTimezoneValue, gmtZoneRegex } from '../utils/time.js';
import { AtCommandOptionName, GlobalCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getAtOptions } from '../options/at.options.js';
import { ApplicationCommandType, MessageFlags } from 'discord-api-types/v10';
import { findTimezoneOptionValue, handleTimezoneAutocomplete } from '../utils/messaging.js';
import { interactionReply } from '../utils/interaction-reply.js';

export const atCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.at.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.at.name', { lng })),
    options: getAtOptions(t),
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
    const year = interaction.options.getInteger(AtCommandOptionName.YEAR);
    const month = interaction.options.getInteger(AtCommandOptionName.MONTH);
    const date = interaction.options.getInteger(AtCommandOptionName.DATE);
    const hour = interaction.options.getInteger(AtCommandOptionName.HOUR) ?? settings.defaultAtHour;
    const minute = interaction.options.getInteger(AtCommandOptionName.MINUTE) ?? settings.defaultAtMinute;
    const second = interaction.options.getNumber(AtCommandOptionName.SECOND) ?? settings.defaultAtSecond;

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
