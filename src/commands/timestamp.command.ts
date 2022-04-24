/* eslint-disable @typescript-eslint/no-non-null-assertion */
import moment, { Moment } from 'moment-timezone';
import { BotCommand } from '../types/bot-interaction.js';
import {
  adjustMoment,
  constrain,
  findTimezone,
  formattedResponse,
  getTimezoneLabel,
  supportedFormats,
} from '../utils/time.js';
import {
  TimestampAgoSubcommandOptionName,
  TimestampAtSubcommandOptionName,
  TimestampCommandOptionName,
  TimestampInSubcommandOptionName,
} from '../types/localization.js';
import { getTimestampCommandOptions } from '../options/timestamp.options.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';
import { MessageTimestamp, MessageTimestampFormat } from '../utils/message-timestamp.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { TimezoneError } from '../utils/timezone-error.js';
import { ApplicationCommandOptionChoice } from 'discord.js';

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

const DEFAULT_TIMEZONE_OPTIONS: ApplicationCommandOptionChoice[] = [
  {
    name: 'GMT',
    value: 'GMT',
  },
  {
    name: 'GMT+12',
    value: 'Etc/GMT-12',
  },
  {
    name: 'GMT+11',
    value: 'Etc/GMT-11',
  },
  {
    name: 'GMT+10',
    value: 'Etc/GMT-10',
  },
  {
    name: 'GMT+9',
    value: 'Etc/GMT-9',
  },
  {
    name: 'GMT+8',
    value: 'Etc/GMT-8',
  },
  {
    name: 'GMT+7',
    value: 'Etc/GMT-7',
  },
  {
    name: 'GMT+6',
    value: 'Etc/GMT-6',
  },
  {
    name: 'GMT+5',
    value: 'Etc/GMT-5',
  },
  {
    name: 'GMT+4',
    value: 'Etc/GMT-4',
  },
  {
    name: 'GMT+3',
    value: 'Etc/GMT-3',
  },
  {
    name: 'GMT+2',
    value: 'Etc/GMT-2',
  },
  {
    name: 'GMT+1',
    value: 'Etc/GMT-1',
  },
  {
    name: 'GMT-1',
    value: 'Etc/GMT+1',
  },
  {
    name: 'GMT-2',
    value: 'Etc/GMT+2',
  },
  {
    name: 'GMT-3',
    value: 'Etc/GMT+3',
  },
  {
    name: 'GMT-4',
    value: 'Etc/GMT+4',
  },
  {
    name: 'GMT-5',
    value: 'Etc/GMT+5',
  },
  {
    name: 'GMT-6',
    value: 'Etc/GMT+6',
  },
  {
    name: 'GMT-7',
    value: 'Etc/GMT+7',
  },
  {
    name: 'GMT-8',
    value: 'Etc/GMT+8',
  },
  {
    name: 'GMT-9',
    value: 'Etc/GMT+9',
  },
  {
    name: 'GMT-10',
    value: 'Etc/GMT+10',
  },
  {
    name: 'GMT-11',
    value: 'Etc/GMT+11',
  },
  {
    name: 'GMT-12',
    value: 'Etc/GMT+12',
  },
];

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
        if (typeof value !== 'string' || value.length === 0) {
          await interaction.respond(DEFAULT_TIMEZONE_OPTIONS);
          return;
        }

        let tzNames: string[];
        try {
          tzNames = findTimezone(value);
        } catch (e) {
          if (!(e instanceof TimezoneError)) {
            throw e;
          }
          await interaction.respond([]);
          return;
        }

        await interaction.respond(tzNames.slice(0, 25).map(name => ({
          name: getTimezoneLabel(name),
          value: name,
        })));
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
      case TimestampCommandOptionName.AT: {
        const year = interaction.options.getNumber(TimestampAtSubcommandOptionName.YEAR);
        const month = interaction.options.getNumber(TimestampAtSubcommandOptionName.MONTH);
        const day = interaction.options.getNumber(TimestampAtSubcommandOptionName.DAY);
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
              content: t('commands.timestamp.responses.invalidDate'),
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
        content: t('commands.timestamp.responses.invalidDate'),
        ephemeral: true,
      });
      return;
    }

    const formats = (formatInput ? [formatInput as MessageTimestampFormat] : supportedFormats);
    await interaction.reply(`${prefix ? `${prefix}\n` : ''}${formattedResponse(ts, formats)}`);
  },
};
