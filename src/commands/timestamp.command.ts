/* eslint-disable @typescript-eslint/no-non-null-assertion */
import moment, { Moment } from 'moment-timezone';
import { BotCommand } from '../types/bot-interaction.js';
import {
  adjustMoment,
  constrain,
  findTimezone,
  formattedResponse, getGmtTimezoneValue,
  gmtTimezoneOptions, gmtZoneRegex,
  supportedFormats,
} from '../utils/time.js';
import {
  TimestampAddSubcommandOptionName,
  TimestampAgoSubcommandOptionName,
  TimestampAtSubcommandOptionName,
  TimestampCommandOptionName,
  TimestampInSubcommandOptionName, TimestampSubtractSubcommandOptionName,
  TimestampUnixSubcommandOptionName,
} from '../types/localization.js';
import { getTimestampCommandOptions } from '../options/timestamp.options.js';
import { MessageTimestamp, MessageTimestampFormat } from '../utils/message-timestamp.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { TimezoneError } from '../utils/timezone-error.js';
import { getExactTimePrefix } from '../utils/get-exact-time-prefix.js';

export const timestampCommand: BotCommand = {
  getDefinition: (t) => ({
    ...getLocalizedObject('description', (lng) => t('commands.timestamp.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.timestamp.name', { lng })),
    options: getTimestampCommandOptions(t),
  }),
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);

    switch (focusedOption.name) {
      case TimestampAtSubcommandOptionName.TIMEZONE: {
        const value = interaction.options.getString(TimestampAtSubcommandOptionName.TIMEZONE)?.trim();
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
    const subcommand = interaction.options.getSubcommand(true);
    const formatInput = interaction.options.getString(TimestampAtSubcommandOptionName.FORMAT);
    let ts: MessageTimestamp;
    let prefix: string | undefined;
    switch (subcommand) {
      case TimestampCommandOptionName.UNIX: {
        const value = interaction.options.getNumber(TimestampUnixSubcommandOptionName.VALUE, true);
        const localMoment = moment.unix(value).utc();
        ts = new MessageTimestamp(localMoment.toDate());
        prefix = getExactTimePrefix(localMoment, 'UTC');
      }
        break;
      case TimestampCommandOptionName.AT: {
        const year = interaction.options.getNumber(TimestampAtSubcommandOptionName.YEAR);
        const month = interaction.options.getNumber(TimestampAtSubcommandOptionName.MONTH);
        const date = interaction.options.getNumber(TimestampAtSubcommandOptionName.DATE);
        const hour = interaction.options.getNumber(TimestampAtSubcommandOptionName.HOUR);
        const minute = interaction.options.getNumber(TimestampAtSubcommandOptionName.MINUTE);
        const second = interaction.options.getNumber(TimestampAtSubcommandOptionName.SECOND);
        const timezoneInput = interaction.options.getString(TimestampAtSubcommandOptionName.TIMEZONE);
        let timezone: string;
        try {
          timezone = (timezoneInput && findTimezone(timezoneInput)[0]) || 'GMT';
        } catch (e) {
          if (!(e instanceof TimezoneError)) {
            throw e;
          }
          await interaction.reply({
            content: t('commands.timestamp.responses.timezoneNotFound'),
            ephemeral: true,
          });
          return;
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
              content: t('commands.timestamp.responses.invalidDate'),
              ephemeral: true,
            });
            return;
          }

          throw e;
        }
        ts = new MessageTimestamp(localMoment.toDate());
        prefix = getExactTimePrefix(localMoment, timezone);
      }
        break;
      case TimestampCommandOptionName.AGO: {
        const subtractOptions = {
          years: interaction.options.getNumber(TimestampAgoSubcommandOptionName.YEARS_AGO),
          months: interaction.options.getNumber(TimestampAgoSubcommandOptionName.MONTHS_AGO),
          days: interaction.options.getNumber(TimestampAgoSubcommandOptionName.DAYS_AGO),
          hours: interaction.options.getNumber(TimestampAgoSubcommandOptionName.HOURS_AGO),
          minutes: interaction.options.getNumber(TimestampAgoSubcommandOptionName.MINUTES_AGO),
          seconds: interaction.options.getNumber(TimestampAgoSubcommandOptionName.SECONDS_AGO),
        };

        const localMoment = adjustMoment(subtractOptions, 'subtract');
        ts = new MessageTimestamp(localMoment.toDate());
      }
        break;
      case TimestampCommandOptionName.IN: {
        const addOptions = {
          years: interaction.options.getNumber(TimestampInSubcommandOptionName.IN_YEARS),
          months: interaction.options.getNumber(TimestampInSubcommandOptionName.IN_MONTHS),
          days: interaction.options.getNumber(TimestampInSubcommandOptionName.IN_DAYS),
          hours: interaction.options.getNumber(TimestampInSubcommandOptionName.IN_HOURS),
          minutes: interaction.options.getNumber(TimestampInSubcommandOptionName.IN_MINUTES),
          seconds: interaction.options.getNumber(TimestampInSubcommandOptionName.IN_SECONDS),
        };

        const localMoment = adjustMoment(addOptions, 'add');
        ts = new MessageTimestamp(localMoment.toDate());
      }
        break;
      case TimestampCommandOptionName.ADD: {
        const nowTimestamp = interaction.options.getNumber(TimestampAddSubcommandOptionName.TO, true);
        let now: Date;
        try {
          now = new Date(nowTimestamp);
        } catch (e) {
          if (e instanceof RangeError && e.message === 'Invalid date') {
            await interaction.reply({
              content: t('commands.timestamp.responses.invalidDate'),
              ephemeral: true,
            });
            return;
          }

          throw e;
        }
        const addOptions = {
          years: interaction.options.getNumber(TimestampAddSubcommandOptionName.ADD_YEARS),
          months: interaction.options.getNumber(TimestampAddSubcommandOptionName.ADD_MONTHS),
          days: interaction.options.getNumber(TimestampAddSubcommandOptionName.ADD_DAYS),
          hours: interaction.options.getNumber(TimestampAddSubcommandOptionName.ADD_HOURS),
          minutes: interaction.options.getNumber(TimestampAddSubcommandOptionName.ADD_MINUTES),
          seconds: interaction.options.getNumber(TimestampAddSubcommandOptionName.ADD_SECONDS),
        };

        const localMoment = adjustMoment(addOptions, 'add', now);
        ts = new MessageTimestamp(localMoment.toDate());
      }
        break;
      case TimestampCommandOptionName.SUBTRACT: {
        const nowTimestamp = interaction.options.getNumber(TimestampSubtractSubcommandOptionName.FROM, true);
        let now: Date;
        try {
          now = new Date(nowTimestamp);
        } catch (e) {
          if (e instanceof RangeError && e.message === 'Invalid date') {
            await interaction.reply({
              content: t('commands.timestamp.responses.invalidDate'),
              ephemeral: true,
            });
            return;
          }

          throw e;
        }
        const addOptions = {
          years: interaction.options.getNumber(TimestampSubtractSubcommandOptionName.SUBTRACT_YEARS),
          months: interaction.options.getNumber(TimestampSubtractSubcommandOptionName.SUBTRACT_MONTHS),
          days: interaction.options.getNumber(TimestampSubtractSubcommandOptionName.SUBTRACT_DAYS),
          hours: interaction.options.getNumber(TimestampSubtractSubcommandOptionName.SUBTRACT_HOURS),
          minutes: interaction.options.getNumber(TimestampSubtractSubcommandOptionName.SUBTRACT_MINUTES),
          seconds: interaction.options.getNumber(TimestampSubtractSubcommandOptionName.SUBTRACT_SECONDS),
        };

        const localMoment = adjustMoment(addOptions, 'subtract', now);
        ts = new MessageTimestamp(localMoment.toDate());
      }
        break;
      default:
        throw new Error(`Unhandled subcommand "${subcommand}"`);
    }

    const timestamp = ts.getDate().getTime();
    if (Number.isNaN(timestamp)) {
      await interaction.reply({
        content: t('commands.timestamp.responses.invalidDate'),
        ephemeral: true,
      });
      return;
    }

    const formats = (formatInput ? [formatInput as MessageTimestampFormat] : supportedFormats);
    await interaction.reply(`${prefix ? `${prefix}\n` : ''}${formattedResponse(ts, formats)}`);
  },
};
