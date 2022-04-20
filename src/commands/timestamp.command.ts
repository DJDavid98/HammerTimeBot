/* eslint-disable @typescript-eslint/no-non-null-assertion */
import moment, { Moment } from 'moment-timezone';
import { BotCommand, BotCommandName } from '../bot-interaction-types.js';
import {
  adjustMoment, constrain,
  findTimezone,
  formattedResponse,
  supportedFormats,
} from '../utils/time.js';
import {
  TimestampAgoSubcommandOptionName,
  TimestampAtSubcommandOptionName,
  TimestampCommandResponse,
  TimestampInSubcommandOptionName,
  TimestampCommandOptionName,
} from '../types/localization.js';
import { locales } from '../constants/locales.js';
import { localizedReply } from '../utils/messaging.js';
import { timestampCommandOptions } from '../options/timestamp.options.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';
import { MessageTimestamp, MessageTimestampFormat } from '../utils/message-timestamp.js';

const timestampEnCommon = locales['en-US'].commands.timestamp;
const timestampHuCommon = locales.hu.commands.timestamp;

const clockEmojiMap: Record<number, EmojiCharacters> = {
  0: EmojiCharacters.TWELVE_OCLOCK,
  30: EmojiCharacters.TWELVE_THIRTY,
  100: EmojiCharacters.ONE_OCLOCK,
  130: EmojiCharacters.ONE_THIRTY,
  200: EmojiCharacters.TWO_OCLOCK,
  230: EmojiCharacters.TWO_THIRTY,
  300: EmojiCharacters.THREE_OCLOCK,
  330: EmojiCharacters.THREE_THIRTY,
  400: EmojiCharacters.FOUR_OCLOCK,
  430: EmojiCharacters.FOUR_THIRTY,
  500: EmojiCharacters.FIVE_OCLOCK,
  530: EmojiCharacters.FIVE_THIRTY,
  600: EmojiCharacters.SIX_OCLOCK,
  630: EmojiCharacters.SIX_THIRTY,
  700: EmojiCharacters.SEVEN_OCLOCK,
  730: EmojiCharacters.SEVEN_THIRTY,
  800: EmojiCharacters.EIGHT_OCLOCK,
  830: EmojiCharacters.EIGHT_THIRTY,
  900: EmojiCharacters.NINE_OCLOCK,
  930: EmojiCharacters.NINE_THIRTY,
  1000: EmojiCharacters.TEN_OCLOCK,
  1030: EmojiCharacters.TEN_THIRTY,
  1100: EmojiCharacters.ELEVEN_OCLOCK,
  1130: EmojiCharacters.ELEVEN_THIRTY,
};

export const timestampCommand: BotCommand = {
  definition: {
    description: timestampEnCommon.description,
    description_localizations: {
      'en-US': timestampEnCommon.description,
      hu: timestampHuCommon.description,
    },
    name_localizations: {
      'en-US': timestampEnCommon.name,
      hu: timestampHuCommon.name,
    },
    options: timestampCommandOptions,
  },
  async handle(interaction) {
    const subcommand = interaction.options.getSubcommand(true);
    const formatInput = interaction.options.getString(TimestampAtSubcommandOptionName.FORMAT);
    let ts: MessageTimestamp;
    let prefix: string | undefined;
    switch (subcommand) {
      case TimestampCommandOptionName.AT: {
        const year = interaction.options.getNumber(TimestampAtSubcommandOptionName.YEAR);
        const month = interaction.options.getNumber(TimestampAtSubcommandOptionName.MONTH);
        const day = interaction.options.getNumber(TimestampAtSubcommandOptionName.DAY);
        const hour = interaction.options.getNumber(TimestampAtSubcommandOptionName.HOUR);
        const minute = interaction.options.getNumber(TimestampAtSubcommandOptionName.MINUTE);
        const second = interaction.options.getNumber(TimestampAtSubcommandOptionName.SECOND);
        const timezoneInput = interaction.options.getString(TimestampAtSubcommandOptionName.TIMEZONE);
        const timezone = (timezoneInput && findTimezone(timezoneInput)) || 'GMT';
        let localMoment: Moment;
        try {
          localMoment = moment.tz(timezone).millisecond(0);
          if (year !== null) localMoment.year(constrain(year, 0));
          if (month !== null) localMoment.month(constrain(month - 1, 0, 11));
          if (day !== null) localMoment.day(constrain(day, 1, 31));
          if (hour !== null) localMoment.hour(constrain(hour, 0, 23));
          if (minute !== null) localMoment.minute(constrain(minute, 0, 59));
          if (second !== null) localMoment.second(constrain(second, 0, 59));
        } catch (e) {
          if (e instanceof RangeError && e.message === 'Invalid date') {
            await interaction.reply({
              content: localizedReply(interaction, BotCommandName.TIMESTAMP, TimestampCommandResponse.INVALID_DATE),
              ephemeral: true,
            });
            return;
          }

          throw e;
        }
        ts = new MessageTimestamp(localMoment.toDate());
        const clockNumber = ((localMoment.hours() % 12) * 100) + (localMoment.minutes() > 30 ? 30 : 0);
        prefix = [
          `${EmojiCharacters.CALENDAR} ${localMoment.format('YYYY-MM-DD')}`,
          `${clockEmojiMap[clockNumber]} ${localMoment.format('HH:mm:ss')}`,
          `${EmojiCharacters.GLOBE} ${timezone}`,
        ].join(' • ');
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
      default:
        throw new Error(`Unhandled subcommand "${subcommand}"`);
    }

    const timestamp = ts.getDate().getTime();
    if (Number.isNaN(timestamp)) {
      await interaction.reply({
        content: localizedReply(interaction, BotCommandName.TIMESTAMP, TimestampCommandResponse.INVALID_DATE),
        ephemeral: true,
      });
      return;
    }

    const formats = (formatInput ? [formatInput as MessageTimestampFormat] : supportedFormats);
    await interaction.reply(`${prefix ? `${prefix}\n` : ''}${formattedResponse(ts, formats)}`);
  },
};
