import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import {
  APIApplicationCommandOption,
} from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/chatInput.js';
import { TFunction } from 'i18next';
import {
  TimestampAgoSubcommandOptionName,
  TimestampAtSubcommandOptionName,
  TimestampCommandOptionName,
  TimestampInSubcommandOptionName, TimestampUnixSubcommandOptionName,
} from '../types/localization.js';
import { MessageTimestampFormat } from '../utils/message-timestamp.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';

const getFormatOption = (t: TFunction): APIApplicationCommandBasicOption => ({
  name: TimestampAtSubcommandOptionName.FORMAT,
  ...getLocalizedObject('name', (lng) => t('commands.at.options.format.name', { lng }), false),
  ...getLocalizedObject('description', (lng) => t('commands.at.options.format.description', { lng })),
  type: ApplicationCommandOptionType.String,
  choices: [
    {
      value: MessageTimestampFormat.SHORT_DATE,
      ...getLocalizedObject('name', (lng) => t('commands.at.options.format.choices.d', { lng })),
    },
    {
      value: MessageTimestampFormat.LONG_DATE,
      ...getLocalizedObject('name', (lng) => t('commands.at.options.format.choices.D', { lng })),
    },
    {
      value: MessageTimestampFormat.SHORT_TIME,
      ...getLocalizedObject('name', (lng) => t('commands.at.options.format.choices.t', { lng })),
    },
    {
      value: MessageTimestampFormat.LONG_TIME,
      ...getLocalizedObject('name', (lng) => t('commands.at.options.format.choices.T', { lng })),
    },
    {
      value: MessageTimestampFormat.SHORT_FULL,
      ...getLocalizedObject('name', (lng) => t('commands.at.options.format.choices.f', { lng })),
    },
    {
      value: MessageTimestampFormat.LONG_FULL,
      ...getLocalizedObject('name', (lng) => t('commands.at.options.format.choices.F', { lng })),
    },
    {
      value: MessageTimestampFormat.RELATIVE,
      ...getLocalizedObject('name', (lng) => t('commands.at.options.format.choices.R', { lng })),
    },
  ],
});

const getCommonTimeOptions = (t: TFunction): APIApplicationCommandBasicOption[] => [
  getFormatOption(t),
];

const getInOptions = (t: TFunction): APIApplicationCommandBasicOption[] => [
  {
    name: TimestampInSubcommandOptionName.IN_YEARS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.years.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.years.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampInSubcommandOptionName.IN_MONTHS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.months.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.months.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampInSubcommandOptionName.IN_DAYS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.days.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.days.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampInSubcommandOptionName.IN_HOURS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.hours.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.hours.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampInSubcommandOptionName.IN_MINUTES,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.minutes.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.minutes.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampInSubcommandOptionName.IN_SECONDS,
    ...getLocalizedObject('name', (lng) => t('commands.in.options.seconds.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.options.seconds.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
];

const getAgoOptions = (t: TFunction): APIApplicationCommandBasicOption[] => [
  {
    name: TimestampAgoSubcommandOptionName.YEARS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.years.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.years.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAgoSubcommandOptionName.MONTHS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.months.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.months.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAgoSubcommandOptionName.DAYS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.days.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.days.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAgoSubcommandOptionName.HOURS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.hours.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.hours.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAgoSubcommandOptionName.MINUTES_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.minutes.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.minutes.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAgoSubcommandOptionName.SECONDS_AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.options.seconds.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.options.seconds.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
];

const getAtOptions = (t: TFunction): APIApplicationCommandBasicOption[] => [
  {
    name: TimestampAtSubcommandOptionName.YEAR,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.year.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.year.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAtSubcommandOptionName.MONTH,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.month.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.month.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAtSubcommandOptionName.DATE,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.day.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.day.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAtSubcommandOptionName.HOUR,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.hour.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.hour.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAtSubcommandOptionName.MINUTE,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.minute.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.minute.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  {
    name: TimestampAtSubcommandOptionName.SECOND,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.second.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.second.description', { lng })),
    type: ApplicationCommandOptionType.Number,
  },
  ...getCommonTimeOptions(t),
  {
    name: TimestampAtSubcommandOptionName.TIMEZONE,
    ...getLocalizedObject('name', (lng) => t('commands.at.options.timezone.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.options.timezone.description', { lng })),
    type: ApplicationCommandOptionType.String,
    autocomplete: true,
  },
];

const getUnixOptions = (t: TFunction): APIApplicationCommandBasicOption[] => [
  {
    name: TimestampUnixSubcommandOptionName.VALUE,
    ...getLocalizedObject('name', (lng) => t('commands.unix.options.value.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.unix.options.value.description', { lng })),
    type: ApplicationCommandOptionType.Number,
    required: true,
  },
];

export const getTimestampCommandOptions = (t: TFunction): APIApplicationCommandOption[] => [
  {
    name: TimestampCommandOptionName.IN,
    ...getLocalizedObject('name', (lng) => t('commands.in.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.in.description', { lng })),
    type: ApplicationCommandOptionType.Subcommand,
    options: getInOptions(t),
  },
  {
    name: TimestampCommandOptionName.AGO,
    ...getLocalizedObject('name', (lng) => t('commands.ago.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.ago.description', { lng })),
    type: ApplicationCommandOptionType.Subcommand,
    options: getAgoOptions(t),
  },
  {
    name: TimestampCommandOptionName.AT,
    ...getLocalizedObject('name', (lng) => t('commands.at.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.at.description', { lng })),
    type: ApplicationCommandOptionType.Subcommand,
    options: getAtOptions(t),
  },
  {
    name: TimestampCommandOptionName.UNIX,
    ...getLocalizedObject('name', (lng) => t('commands.unix.name', { lng }), false),
    ...getLocalizedObject('description', (lng) => t('commands.unix.description', { lng })),
    type: ApplicationCommandOptionType.Subcommand,
    options: getUnixOptions(t),
  },
];
