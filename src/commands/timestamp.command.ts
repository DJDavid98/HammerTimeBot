/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import moment from 'moment-timezone';
import { BotCommand } from '../bot-interaction-types.js';
import {
  findTimezone, formattedResponse, MessageTimestamp, MessageTimestampFormat,
} from '../utils/time.js';
import { TimestampCommandOptionName } from '../types/localization.js';
import { locales } from '../constants/locales.js';

const timestampEnCommon = locales['en-US'].commands.timestamp;
const timestampHuCommon = locales.hu.commands.timestamp;

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
    options: [
      {
        name: TimestampCommandOptionName.YEAR,
        description: timestampEnCommon.options[TimestampCommandOptionName.YEAR].description,
        description_localizations: {
          'en-US': timestampEnCommon.options[TimestampCommandOptionName.YEAR].description,
          hu: timestampHuCommon.options[TimestampCommandOptionName.YEAR].description,
        },
        type: ApplicationCommandOptionType.Number,
      },
      {
        name: TimestampCommandOptionName.MONTH,
        description: timestampEnCommon.options[TimestampCommandOptionName.MONTH].description,
        description_localizations: {
          'en-US': timestampEnCommon.options[TimestampCommandOptionName.MONTH].description,
          hu: timestampHuCommon.options[TimestampCommandOptionName.MONTH].description,
        },
        type: ApplicationCommandOptionType.Number,
      },
      {
        name: TimestampCommandOptionName.DAY,
        description: timestampEnCommon.options[TimestampCommandOptionName.DAY].description,
        description_localizations: {
          'en-US': timestampEnCommon.options[TimestampCommandOptionName.DAY].description,
          hu: timestampHuCommon.options[TimestampCommandOptionName.DAY].description,
        },
        type: ApplicationCommandOptionType.Number,
      },
      {
        name: TimestampCommandOptionName.HOUR,
        description: timestampEnCommon.options[TimestampCommandOptionName.HOUR].description,
        description_localizations: {
          'en-US': timestampEnCommon.options[TimestampCommandOptionName.HOUR].description,
          hu: timestampHuCommon.options[TimestampCommandOptionName.HOUR].description,
        },
        type: ApplicationCommandOptionType.Number,
      },
      {
        name: TimestampCommandOptionName.MINUTE,
        description: timestampEnCommon.options[TimestampCommandOptionName.MINUTE].description,
        description_localizations: {
          'en-US': timestampEnCommon.options[TimestampCommandOptionName.MINUTE].description,
          hu: timestampHuCommon.options[TimestampCommandOptionName.MINUTE].description,
        },
        type: ApplicationCommandOptionType.Number,
      },
      {
        name: TimestampCommandOptionName.SECOND,
        description: timestampEnCommon.options[TimestampCommandOptionName.SECOND].description,
        description_localizations: {
          'en-US': timestampEnCommon.options[TimestampCommandOptionName.SECOND].description,
          hu: timestampHuCommon.options[TimestampCommandOptionName.SECOND].description,
        },
        type: ApplicationCommandOptionType.Number,
      },
      {
        name: TimestampCommandOptionName.TIMEZONE,
        description: timestampEnCommon.options[TimestampCommandOptionName.TIMEZONE].description,
        description_localizations: {
          'en-US': timestampEnCommon.options[TimestampCommandOptionName.TIMEZONE].description,
          hu: timestampHuCommon.options[TimestampCommandOptionName.TIMEZONE].description,
        },
        type: ApplicationCommandOptionType.String,
      },
      {
        name: TimestampCommandOptionName.FORMAT,
        description: timestampEnCommon.options[TimestampCommandOptionName.FORMAT].description,
        description_localizations: {
          'en-US': timestampEnCommon.options[TimestampCommandOptionName.FORMAT].description,
          hu: timestampHuCommon.options[TimestampCommandOptionName.FORMAT].description,
        },
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            value: MessageTimestampFormat.SHORT_DATE,
            name: timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.SHORT_DATE],
            name_localizations: {
              'en-US': timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.SHORT_DATE],
              hu: timestampHuCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.SHORT_DATE],
            },
          },
          {
            value: MessageTimestampFormat.LONG_DATE,
            name: timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.LONG_DATE],
            name_localizations: {
              'en-US': timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.LONG_DATE],
              hu: timestampHuCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.LONG_DATE],
            },
          },
          {
            value: MessageTimestampFormat.SHORT_TIME,
            name: timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.SHORT_TIME],
            name_localizations: {
              'en-US': timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.SHORT_TIME],
              hu: timestampHuCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.SHORT_TIME],
            },
          },
          {
            value: MessageTimestampFormat.LONG_TIME,
            name: timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.LONG_TIME],
            name_localizations: {
              'en-US': timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.LONG_TIME],
              hu: timestampHuCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.LONG_TIME],
            },
          },
          {
            value: MessageTimestampFormat.SHORT_FULL,
            name: timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.SHORT_FULL],
            name_localizations: {
              'en-US': timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.SHORT_FULL],
              hu: timestampHuCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.SHORT_FULL],
            },
          },
          {
            value: MessageTimestampFormat.LONG_FULL,
            name: timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.LONG_FULL],
            name_localizations: {
              'en-US': timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.LONG_FULL],
              hu: timestampHuCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.LONG_FULL],
            },
          },
          {
            value: MessageTimestampFormat.RELATIVE,
            name: timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.RELATIVE],
            name_localizations: {
              'en-US': timestampEnCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.RELATIVE],
              hu: timestampHuCommon.options[TimestampCommandOptionName.FORMAT].choices![MessageTimestampFormat.RELATIVE],
            },
          },
        ],
      },
    ],
  },
  async handle(interaction) {
    const now = new Date();
    const year = interaction.options.getNumber(TimestampCommandOptionName.YEAR) || now.getFullYear();
    const month = interaction.options.getNumber(TimestampCommandOptionName.MONTH) || (now.getMonth() + 1);
    const day = interaction.options.getNumber(TimestampCommandOptionName.DAY) || now.getDate();
    const hour = interaction.options.getNumber(TimestampCommandOptionName.HOUR) || now.getHours();
    const minute = interaction.options.getNumber(TimestampCommandOptionName.MINUTE) || now.getMinutes();
    const second = interaction.options.getNumber(TimestampCommandOptionName.SECOND) || 0;
    const timezoneInput = interaction.options.getString(TimestampCommandOptionName.TIMEZONE);
    const formatInput = interaction.options.getString(TimestampCommandOptionName.FORMAT);

    const timezone = (timezoneInput && findTimezone(timezoneInput)) || 'GMT';

    const ts = new MessageTimestamp(moment.tz(new Date(year, month - 1, day, hour, minute, second), timezone).toDate());
    const formats = (formatInput ? [formatInput as MessageTimestampFormat] : [
      MessageTimestampFormat.SHORT_DATE,
      MessageTimestampFormat.LONG_DATE,
      MessageTimestampFormat.SHORT_TIME,
      MessageTimestampFormat.LONG_TIME,
      MessageTimestampFormat.SHORT_FULL,
      MessageTimestampFormat.LONG_FULL,
      MessageTimestampFormat.RELATIVE,
    ]);
    await interaction.reply(formattedResponse(ts, formats));
  },
};
