import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import {
  APIApplicationCommandOption,
} from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/chatInput.js';
import {
  TimestampAgoSubcommandOptionName,
  TimestampAtSubcommandOptionName,
  TimestampInSubcommandOptionName,
  TimestampCommandOptionName,
} from '../types/localization.js';
import { locales } from '../constants/locales.js';
import { MessageTimestampFormat } from '../utils/message-timestamp.js';

const atEnCommon = locales['en-US'].commands.at;
const atHuCommon = locales.hu.commands.at;
const inEnCommon = locales['en-US'].commands.in;
const inHuCommon = locales.hu.commands.in;
const agoEnCommon = locales['en-US'].commands.ago;
const agoHuCommon = locales.hu.commands.ago;

const formatOption: APIApplicationCommandBasicOption = {
  name: TimestampAtSubcommandOptionName.FORMAT,
  name_localizations: {
    'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].name,
    hu: atHuCommon.options[TimestampAtSubcommandOptionName.FORMAT].name,
  },
  description: atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].description,
  description_localizations: {
    'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].description,
    hu: atHuCommon.options[TimestampAtSubcommandOptionName.FORMAT].description,
  },
  type: ApplicationCommandOptionType.String,
  choices: [
    {
      value: MessageTimestampFormat.SHORT_DATE,
      name: atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.SHORT_DATE],
      name_localizations: {
        'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.SHORT_DATE],
        hu: atHuCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.SHORT_DATE],
      },
    },
    {
      value: MessageTimestampFormat.LONG_DATE,
      name: atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.LONG_DATE],
      name_localizations: {
        'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.LONG_DATE],
        hu: atHuCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.LONG_DATE],
      },
    },
    {
      value: MessageTimestampFormat.SHORT_TIME,
      name: atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.SHORT_TIME],
      name_localizations: {
        'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.SHORT_TIME],
        hu: atHuCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.SHORT_TIME],
      },
    },
    {
      value: MessageTimestampFormat.LONG_TIME,
      name: atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.LONG_TIME],
      name_localizations: {
        'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.LONG_TIME],
        hu: atHuCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.LONG_TIME],
      },
    },
    {
      value: MessageTimestampFormat.SHORT_FULL,
      name: atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.SHORT_FULL],
      name_localizations: {
        'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.SHORT_FULL],
        hu: atHuCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.SHORT_FULL],
      },
    },
    {
      value: MessageTimestampFormat.LONG_FULL,
      name: atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.LONG_FULL],
      name_localizations: {
        'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.LONG_FULL],
        hu: atHuCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.LONG_FULL],
      },
    },
    {
      value: MessageTimestampFormat.RELATIVE,
      name: atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.RELATIVE],
      name_localizations: {
        'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.RELATIVE],
        hu: atHuCommon.options[TimestampAtSubcommandOptionName.FORMAT].choices[MessageTimestampFormat.RELATIVE],
      },
    },
  ],
};

const commonTimeOptions: APIApplicationCommandBasicOption[] = [
  formatOption,
];

const inOptions: APIApplicationCommandBasicOption[] = [
  {
    name: TimestampInSubcommandOptionName.IN_YEARS,
    name_localizations: {
      'en-US': inEnCommon.options[TimestampInSubcommandOptionName.IN_YEARS].name,
      hu: inHuCommon.options[TimestampInSubcommandOptionName.IN_YEARS].name,
    },
    description: inEnCommon.options[TimestampInSubcommandOptionName.IN_YEARS].description,
    description_localizations: {
      'en-US': inEnCommon.options[TimestampInSubcommandOptionName.IN_YEARS].description,
      hu: inHuCommon.options[TimestampInSubcommandOptionName.IN_YEARS].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampInSubcommandOptionName.IN_MONTHS,
    name_localizations: {
      'en-US': inEnCommon.options[TimestampInSubcommandOptionName.IN_MONTHS].name,
      hu: inHuCommon.options[TimestampInSubcommandOptionName.IN_MONTHS].name,
    },
    description: inEnCommon.options[TimestampInSubcommandOptionName.IN_MONTHS].description,
    description_localizations: {
      'en-US': inEnCommon.options[TimestampInSubcommandOptionName.IN_MONTHS].description,
      hu: inHuCommon.options[TimestampInSubcommandOptionName.IN_MONTHS].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampInSubcommandOptionName.IN_DAYS,
    name_localizations: {
      'en-US': inEnCommon.options[TimestampInSubcommandOptionName.IN_DAYS].name,
      hu: inHuCommon.options[TimestampInSubcommandOptionName.IN_DAYS].name,
    },
    description: inEnCommon.options[TimestampInSubcommandOptionName.IN_DAYS].description,
    description_localizations: {
      'en-US': inEnCommon.options[TimestampInSubcommandOptionName.IN_DAYS].description,
      hu: inHuCommon.options[TimestampInSubcommandOptionName.IN_DAYS].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampInSubcommandOptionName.IN_HOURS,
    name_localizations: {
      'en-US': inEnCommon.options[TimestampInSubcommandOptionName.IN_HOURS].name,
      hu: inHuCommon.options[TimestampInSubcommandOptionName.IN_HOURS].name,
    },
    description: inEnCommon.options[TimestampInSubcommandOptionName.IN_HOURS].description,
    description_localizations: {
      'en-US': inEnCommon.options[TimestampInSubcommandOptionName.IN_HOURS].description,
      hu: inHuCommon.options[TimestampInSubcommandOptionName.IN_HOURS].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampInSubcommandOptionName.IN_MINUTES,
    name_localizations: {
      'en-US': inEnCommon.options[TimestampInSubcommandOptionName.IN_MINUTES].name,
      hu: inHuCommon.options[TimestampInSubcommandOptionName.IN_MINUTES].name,
    },
    description: inEnCommon.options[TimestampInSubcommandOptionName.IN_MINUTES].description,
    description_localizations: {
      'en-US': inEnCommon.options[TimestampInSubcommandOptionName.IN_MINUTES].description,
      hu: inHuCommon.options[TimestampInSubcommandOptionName.IN_MINUTES].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampInSubcommandOptionName.IN_SECONDS,
    name_localizations: {
      'en-US': inEnCommon.options[TimestampInSubcommandOptionName.IN_SECONDS].name,
      hu: inHuCommon.options[TimestampInSubcommandOptionName.IN_SECONDS].name,
    },
    description: inEnCommon.options[TimestampInSubcommandOptionName.IN_SECONDS].description,
    description_localizations: {
      'en-US': inEnCommon.options[TimestampInSubcommandOptionName.IN_SECONDS].description,
      hu: inHuCommon.options[TimestampInSubcommandOptionName.IN_SECONDS].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
];

const agoOptions: APIApplicationCommandBasicOption[] = [
  {
    name: TimestampAgoSubcommandOptionName.YEARS_AGO,
    name_localizations: {
      'en-US': agoEnCommon.options[TimestampAgoSubcommandOptionName.YEARS_AGO].name,
      hu: agoHuCommon.options[TimestampAgoSubcommandOptionName.YEARS_AGO].name,
    },
    description: agoEnCommon.options[TimestampAgoSubcommandOptionName.YEARS_AGO].description,
    description_localizations: {
      'en-US': agoEnCommon.options[TimestampAgoSubcommandOptionName.YEARS_AGO].description,
      hu: agoHuCommon.options[TimestampAgoSubcommandOptionName.YEARS_AGO].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAgoSubcommandOptionName.MONTHS_AGO,
    name_localizations: {
      'en-US': agoEnCommon.options[TimestampAgoSubcommandOptionName.MONTHS_AGO].name,
      hu: agoHuCommon.options[TimestampAgoSubcommandOptionName.MONTHS_AGO].name,
    },
    description: agoEnCommon.options[TimestampAgoSubcommandOptionName.MONTHS_AGO].description,
    description_localizations: {
      'en-US': agoEnCommon.options[TimestampAgoSubcommandOptionName.MONTHS_AGO].description,
      hu: agoHuCommon.options[TimestampAgoSubcommandOptionName.MONTHS_AGO].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAgoSubcommandOptionName.DAYS_AGO,
    name_localizations: {
      'en-US': agoEnCommon.options[TimestampAgoSubcommandOptionName.DAYS_AGO].name,
      hu: agoHuCommon.options[TimestampAgoSubcommandOptionName.DAYS_AGO].name,
    },
    description: agoEnCommon.options[TimestampAgoSubcommandOptionName.DAYS_AGO].description,
    description_localizations: {
      'en-US': agoEnCommon.options[TimestampAgoSubcommandOptionName.DAYS_AGO].description,
      hu: agoHuCommon.options[TimestampAgoSubcommandOptionName.DAYS_AGO].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAgoSubcommandOptionName.HOURS_AGO,
    name_localizations: {
      'en-US': agoEnCommon.options[TimestampAgoSubcommandOptionName.HOURS_AGO].name,
      hu: agoHuCommon.options[TimestampAgoSubcommandOptionName.HOURS_AGO].name,
    },
    description: agoEnCommon.options[TimestampAgoSubcommandOptionName.HOURS_AGO].description,
    description_localizations: {
      'en-US': agoEnCommon.options[TimestampAgoSubcommandOptionName.HOURS_AGO].description,
      hu: agoHuCommon.options[TimestampAgoSubcommandOptionName.HOURS_AGO].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAgoSubcommandOptionName.MINUTES_AGO,
    name_localizations: {
      'en-US': agoEnCommon.options[TimestampAgoSubcommandOptionName.MINUTES_AGO].name,
      hu: agoHuCommon.options[TimestampAgoSubcommandOptionName.MINUTES_AGO].name,
    },
    description: agoEnCommon.options[TimestampAgoSubcommandOptionName.MINUTES_AGO].description,
    description_localizations: {
      'en-US': agoEnCommon.options[TimestampAgoSubcommandOptionName.MINUTES_AGO].description,
      hu: agoHuCommon.options[TimestampAgoSubcommandOptionName.MINUTES_AGO].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAgoSubcommandOptionName.SECONDS_AGO,
    name_localizations: {
      'en-US': agoEnCommon.options[TimestampAgoSubcommandOptionName.SECONDS_AGO].name,
      hu: agoHuCommon.options[TimestampAgoSubcommandOptionName.SECONDS_AGO].name,
    },
    description: agoEnCommon.options[TimestampAgoSubcommandOptionName.SECONDS_AGO].description,
    description_localizations: {
      'en-US': agoEnCommon.options[TimestampAgoSubcommandOptionName.SECONDS_AGO].description,
      hu: agoHuCommon.options[TimestampAgoSubcommandOptionName.SECONDS_AGO].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
];

const atOptions: APIApplicationCommandBasicOption[] = [
  {
    name: TimestampAtSubcommandOptionName.YEAR,
    name_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.YEAR].name,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.YEAR].name,
    },
    description: atEnCommon.options[TimestampAtSubcommandOptionName.YEAR].description,
    description_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.YEAR].description,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.YEAR].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAtSubcommandOptionName.MONTH,
    name_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.MONTH].name,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.MONTH].name,
    },
    description: atEnCommon.options[TimestampAtSubcommandOptionName.MONTH].description,
    description_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.MONTH].description,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.MONTH].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAtSubcommandOptionName.DAY,
    name_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.DAY].name,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.DAY].name,
    },
    description: atEnCommon.options[TimestampAtSubcommandOptionName.DAY].description,
    description_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.DAY].description,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.DAY].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAtSubcommandOptionName.HOUR,
    name_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.HOUR].name,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.HOUR].name,
    },
    description: atEnCommon.options[TimestampAtSubcommandOptionName.HOUR].description,
    description_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.HOUR].description,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.HOUR].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAtSubcommandOptionName.MINUTE,
    name_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.MINUTE].name,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.MINUTE].name,
    },
    description: atEnCommon.options[TimestampAtSubcommandOptionName.MINUTE].description,
    description_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.MINUTE].description,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.MINUTE].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAtSubcommandOptionName.SECOND,
    name_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.SECOND].name,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.SECOND].name,
    },
    description: atEnCommon.options[TimestampAtSubcommandOptionName.SECOND].description,
    description_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.SECOND].description,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.SECOND].description,
    },
    type: ApplicationCommandOptionType.Number,
  },
  ...commonTimeOptions,
  {
    name: TimestampAtSubcommandOptionName.TIMEZONE,
    name_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.TIMEZONE].name,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.TIMEZONE].name,
    },
    description: atEnCommon.options[TimestampAtSubcommandOptionName.TIMEZONE].description,
    description_localizations: {
      'en-US': atEnCommon.options[TimestampAtSubcommandOptionName.TIMEZONE].description,
      hu: atHuCommon.options[TimestampAtSubcommandOptionName.TIMEZONE].description,
    },
    type: ApplicationCommandOptionType.String,
  },
];

export const timestampCommandOptions: APIApplicationCommandOption[] = [
  {
    name: TimestampCommandOptionName.IN,
    name_localizations: {
      'en-US': inEnCommon.name,
      hu: inHuCommon.name,
    },
    description: inEnCommon.description,
    description_localizations: {
      'en-US': inEnCommon.description,
      hu: inHuCommon.description,
    },
    type: ApplicationCommandOptionType.Subcommand,
    options: inOptions,
  },
  {
    name: TimestampCommandOptionName.AGO,
    name_localizations: {
      'en-US': agoEnCommon.name,
      hu: agoHuCommon.name,
    },
    description: agoEnCommon.description,
    description_localizations: {
      'en-US': agoEnCommon.description,
      hu: agoHuCommon.description,
    },
    type: ApplicationCommandOptionType.Subcommand,
    options: agoOptions,
  },
  {
    name: TimestampCommandOptionName.AT,
    name_localizations: {
      'en-US': atEnCommon.name,
      hu: atHuCommon.name,
    },
    description: atEnCommon.description,
    description_localizations: {
      'en-US': atEnCommon.description,
      hu: atHuCommon.description,
    },
    type: ApplicationCommandOptionType.Subcommand,
    options: atOptions,
  },
];
