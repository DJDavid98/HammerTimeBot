import { APIApplicationCommand, APIApplicationCommandOption } from 'discord-api-types/v10';
import { BotCommandName } from './bot-interaction.js';
import { MessageTimestampFormat } from '../utils/message-timestamp.js';

export enum GlobalCommandOptionName {
  COLUMNS = 'columns',
  EPHEMERAL = 'ephemeral',
  FORMAT = 'format',
  HEADER = 'header',
}

export enum AtCommandOptionName {
  YEAR = 'year',
  MONTH = 'month',
  DATE = 'day',
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
  TIMEZONE = 'timezone',
}

export enum InCommandOptionName {
  IN_YEARS = 'years',
  IN_MONTHS = 'months',
  IN_DAYS = 'days',
  IN_HOURS = 'hours',
  IN_MINUTES = 'minutes',
  IN_SECONDS = 'seconds',
}

export enum AgoCommandOptionName {
  YEARS_AGO = 'years',
  MONTHS_AGO = 'months',
  DAYS_AGO = 'days',
  HOURS_AGO = 'hours',
  MINUTES_AGO = 'minutes',
  SECONDS_AGO = 'seconds',
}

export enum AddCommandOptionName {
  TO = 'to',
  ADD_YEARS = 'years',
  ADD_MONTHS = 'months',
  ADD_DAYS = 'days',
  ADD_HOURS = 'hours',
  ADD_MINUTES = 'minutes',
  ADD_SECONDS = 'seconds',
}

export enum SubtractCommandOptionName {
  FROM = 'from',
  SUBTRACT_YEARS = 'years',
  SUBTRACT_MONTHS = 'months',
  SUBTRACT_DAYS = 'days',
  SUBTRACT_HOURS = 'hours',
  SUBTRACT_MINUTES = 'minutes',
  SUBTRACT_SECONDS = 'seconds',
}

export enum UnixCommandOptionName {
  VALUE = 'value',
}

export enum SnowflakeCommandOptionName {
  VALUE = 'value',
}

interface CommandOptionsMap {
  [BotCommandName.TIMESTAMP]: never,
  [BotCommandName.IN]: InCommandOptionName,
  [BotCommandName.AGO]: AgoCommandOptionName,
  [BotCommandName.AT]: AtCommandOptionName,
  [BotCommandName.ADD]: AddCommandOptionName,
  [BotCommandName.SUBTRACT]: SubtractCommandOptionName,
  [BotCommandName.UNIX]: UnixCommandOptionName,
  [BotCommandName.STATISTICS]: never,
}

export enum GlobalCommandResponse {
  INVALID_DATE = 'invalidDate',
}

export enum TimestampCommandResponse {
  DEPRECATED = 'deprecated',
}

export enum AtCommandResponse {
  TIMEZONE_NOT_FOUND = 'timezoneNotFound',
}

interface CommandResponsesMap {
  global: GlobalCommandResponse,
  [BotCommandName.TIMESTAMP]: TimestampCommandResponse,
  [BotCommandName.IN]: never,
  [BotCommandName.AGO]: never,
  [BotCommandName.AT]: AtCommandResponse,
  [BotCommandName.ADD]: never,
  [BotCommandName.SUBTRACT]: never,
  [BotCommandName.UNIX]: never,
  [BotCommandName.STATISTICS]: never,
}

export enum ResponseColumnChoices {
  SYNTAX_ONLY = 'syntax',
  PREVIEW_ONLY = 'preview',
  BOTH = 'both',
}

interface OptionChoicesMap {
  [GlobalCommandOptionName.COLUMNS]: ResponseColumnChoices,
  [GlobalCommandOptionName.FORMAT]: MessageTimestampFormat,
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
