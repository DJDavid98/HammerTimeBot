import { APIApplicationCommand } from 'discord-api-types/v10';
import {
  APIApplicationCommandOption,
} from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/chatInput.js';
import { BotCommandName } from '../bot-interaction-types.js';
import { MessageTimestampFormat } from '../utils/message-timestamp.js';

export enum TimestampCommandOptionName {
  IN = 'in',
  AGO = 'ago',
  AT = 'at',
}

export enum TimestampAtSubcommandOptionName {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day',
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
  TIMEZONE = 'timezone',
  FORMAT = 'format',
}

export enum TimestampInSubcommandOptionName {
  IN_YEARS = 'in-years',
  IN_MONTHS = 'in-months',
  IN_DAYS = 'in-days',
  IN_HOURS = 'in-hours',
  IN_MINUTES = 'in-minutes',
  IN_SECONDS = 'in-seconds',
}

export enum TimestampAgoSubcommandOptionName {
  YEARS_AGO = 'years-ago',
  MONTHS_AGO = 'months-ago',
  DAYS_AGO = 'days-ago',
  HOURS_AGO = 'hours-ago',
  MINUTES_AGO = 'minutes-ago',
  SECONDS_AGO = 'seconds-ago',
}

export enum TimestampCommandResponse {
  INVALID_DATE = 'invalidDate',
}

interface CommandOptionsMap {
  [BotCommandName.TIMESTAMP]: never,
  [TimestampCommandOptionName.IN]: TimestampInSubcommandOptionName,
  [TimestampCommandOptionName.AGO]: TimestampAgoSubcommandOptionName,
  [TimestampCommandOptionName.AT]: TimestampAtSubcommandOptionName,
}

interface CommandResponsesMap {
  [BotCommandName.TIMESTAMP]: TimestampCommandResponse,
  [TimestampCommandOptionName.IN]: never,
  [TimestampCommandOptionName.AGO]: never,
  [TimestampCommandOptionName.AT]: never,
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
