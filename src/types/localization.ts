import { APIApplicationCommand, APIApplicationCommandOption } from 'discord-api-types/v10';
import { BotCommandName } from './bot-interaction.js';
import { MessageTimestampFormat } from '../utils/message-timestamp.js';

export enum TimestampCommandOptionName {
  IN = 'in',
  AGO = 'ago',
  AT = 'at',
  UNIX = 'unix',
  ADD = 'add',
  SUBTRACT = 'subtract',
}

export enum TimestampAtSubcommandOptionName {
  YEAR = 'year',
  MONTH = 'month',
  DATE = 'day',
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
  TIMEZONE = 'timezone',
  FORMAT = 'format',
}

export enum TimestampInSubcommandOptionName {
  IN_YEARS = 'years',
  IN_MONTHS = 'months',
  IN_DAYS = 'days',
  IN_HOURS = 'hours',
  IN_MINUTES = 'minutes',
  IN_SECONDS = 'seconds',
}

export enum TimestampAgoSubcommandOptionName {
  YEARS_AGO = 'years',
  MONTHS_AGO = 'months',
  DAYS_AGO = 'days',
  HOURS_AGO = 'hours',
  MINUTES_AGO = 'minutes',
  SECONDS_AGO = 'seconds',
}

export enum TimestampAddSubcommandOptionName {
  TO = 'to',
  ADD_YEARS = 'years',
  ADD_MONTHS = 'months',
  ADD_DAYS = 'days',
  ADD_HOURS = 'hours',
  ADD_MINUTES = 'minutes',
  ADD_SECONDS = 'seconds',
}

export enum TimestampSubtractSubcommandOptionName {
  FROM = 'from',
  SUBTRACT_YEARS = 'years',
  SUBTRACT_MONTHS = 'months',
  SUBTRACT_DAYS = 'days',
  SUBTRACT_HOURS = 'hours',
  SUBTRACT_MINUTES = 'minutes',
  SUBTRACT_SECONDS = 'seconds',
}

export enum TimestampUnixSubcommandOptionName {
  VALUE = 'value',
}

export enum TimestampCommandResponse {
  INVALID_DATE = 'invalidDate',
}

interface CommandOptionsMap {
  [BotCommandName.TIMESTAMP]: never,
  [TimestampCommandOptionName.IN]: TimestampInSubcommandOptionName,
  [TimestampCommandOptionName.AGO]: TimestampAgoSubcommandOptionName,
  [TimestampCommandOptionName.AT]: TimestampAtSubcommandOptionName,
  [TimestampCommandOptionName.ADD]: TimestampAddSubcommandOptionName,
  [TimestampCommandOptionName.SUBTRACT]: TimestampSubtractSubcommandOptionName,
}

interface CommandResponsesMap {
  [BotCommandName.TIMESTAMP]: TimestampCommandResponse,
  [TimestampCommandOptionName.IN]: never,
  [TimestampCommandOptionName.AGO]: never,
  [TimestampCommandOptionName.AT]: never,
  [TimestampCommandOptionName.ADD]: never,
  [TimestampCommandOptionName.SUBTRACT]: never,
}

interface OptionChoicesMap {
  [TimestampAtSubcommandOptionName.FORMAT]: MessageTimestampFormat,
}

export type OptionLocalization<OptionName extends string = string> =
  Pick<APIApplicationCommandOption, 'name' | 'description'>
  & (OptionName extends keyof OptionChoicesMap ? {
    choices: Record<OptionChoicesMap[OptionName], string>
  } : { choices?: Record<string, never> });

export type CommandLocalization<CommandKey extends keyof CommandOptionsMap & keyof CommandResponsesMap = keyof CommandOptionsMap & keyof CommandResponsesMap> =
  Pick<APIApplicationCommand, 'name' | 'description'>
  & {
    options: { [l in CommandOptionsMap[CommandKey]]: OptionLocalization<l> };
    responses: { [l in CommandResponsesMap[CommandKey]]: string };
  };

export type Localization = {
  commands: {
    [k in keyof CommandOptionsMap & keyof CommandResponsesMap]: CommandLocalization<k>;
  };
};
