import moment, { Moment } from 'moment-timezone';
import { BotCommand } from '../types/bot-interaction.js';
import { constrain, findTimezone, getGmtTimezoneValue, gmtTimezoneOptions, gmtZoneRegex } from '../utils/time.js';
import { AtCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { TimezoneError } from '../classes/timezone-error.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getAtOptions } from '../options/at.options.js';

export const atCommand: BotCommand = {
  getDefinition: (t) => ({
    ...getLocalizedObject('description', (lng) => t('commands.at.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.at.name', { lng })),
    options: getAtOptions(t),
  }),
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);

    switch (focusedOption.name) {
      case AtCommandOptionName.TIMEZONE: {
        const value = interaction.options.getString(AtCommandOptionName.TIMEZONE)?.trim();
        let tzNames: string[];
        if (typeof value !== 'string' || value.length === 0) {
          tzNames = gmtTimezoneOptions;
        } else {
          try {
            tzNames = findTimezone(value);
          } catch (e) {
            if (!(e instanceof TimezoneError)) {
              throw e;
            }
            await interaction.respond([]);
            return;
          }
        }

        await interaction.respond(tzNames.slice(0, 25).map(name => ({ name, value: name })));
      }
        break;
      default:
        throw new Error(`Unknown autocomplete option ${focusedOption.name}`);
    }
  },
  async handle(interaction, t) {
    const year = interaction.options.getNumber(AtCommandOptionName.YEAR);
    const month = interaction.options.getNumber(AtCommandOptionName.MONTH);
    const date = interaction.options.getNumber(AtCommandOptionName.DATE);
    const hour = interaction.options.getNumber(AtCommandOptionName.HOUR);
    const minute = interaction.options.getNumber(AtCommandOptionName.MINUTE);
    const second = interaction.options.getNumber(AtCommandOptionName.SECOND);

    const timezoneInput = interaction.options.getString(AtCommandOptionName.TIMEZONE);
    let timezone = 'GMT';
    if (timezoneInput) {
      try {
        timezone = findTimezone(timezoneInput)[0];
      } catch (e) {
        if (!(e instanceof TimezoneError)) {
          throw e;
        }
        await interaction.reply({
          content: t('commands.at.responses.timezoneNotFound'),
          ephemeral: true,
        });
        return;
      }
    }

    let localMoment: Moment;
    try {
      if (gmtZoneRegex.test(timezone)) {
        const utcOffset = Math.round(constrain(getGmtTimezoneValue(timezone, 0), -16, 16));
        localMoment = moment.tz('UTC').utcOffset(utcOffset);
      } else {
        localMoment = moment.tz(timezone);
      }
      localMoment = localMoment.millisecond(0);
      if (year !== null) localMoment.year(constrain(year, 0));
      if (month !== null) localMoment.month(constrain(month - 1, 0, 11));
      if (date !== null) localMoment.date(constrain(date, 1, 31));
      if (hour !== null) localMoment.hour(constrain(hour, 0, 23));
      if (minute !== null) localMoment.minute(constrain(minute, 0, 59));
      localMoment.second(second !== null ? constrain(second, 0, 59) : 0);
    } catch (e) {
      if (e instanceof RangeError && e.message === 'Invalid date') {
        await interaction.reply({
          content: t('commands.global.responses.invalidDate'),
          ephemeral: true,
        });
        return;
      }

      throw e;
    }

    await replyWithSyntax(localMoment, interaction, t, timezone);
  },
};
