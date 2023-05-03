import { APIApplicationCommand, APIApplicationCommandOption } from 'discord-api-types/v10';
import { BotChatInputCommandName, BotMessageContextMenuCommandName } from './bot-interaction.js';
import { MessageTimestampFormat } from '../classes/message-timestamp.js';

export const enum GlobalCommandOptionName {
  COLUMNS = 'columns',
  EPHEMERAL = 'ephemeral',
  FORMAT = 'format',
  HEADER = 'header',
}

export const enum AtCommandOptionName {
  YEAR = 'year',
  MONTH = 'month',
  DATE = 'day',
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
  TIMEZONE = 'timezone',
}

export const enum InCommandOptionName {
  IN_YEARS = 'years',
  IN_MONTHS = 'months',
  IN_DAYS = 'days',
  IN_HOURS = 'hours',
  IN_MINUTES = 'minutes',
  IN_SECONDS = 'seconds',
}

export const enum AgoCommandOptionName {
  YEARS_AGO = 'years',
  MONTHS_AGO = 'months',
  DAYS_AGO = 'days',
  HOURS_AGO = 'hours',
  MINUTES_AGO = 'minutes',
  SECONDS_AGO = 'seconds',
}

export const enum AddCommandOptionName {
  TO = 'to',
  ADD_YEARS = 'years',
  ADD_MONTHS = 'months',
  ADD_DAYS = 'days',
  ADD_HOURS = 'hours',
  ADD_MINUTES = 'minutes',
  ADD_SECONDS = 'seconds',
}

export const enum SubtractCommandOptionName {
  FROM = 'from',
  SUBTRACT_YEARS = 'years',
  SUBTRACT_MONTHS = 'months',
  SUBTRACT_DAYS = 'days',
  SUBTRACT_HOURS = 'hours',
  SUBTRACT_MINUTES = 'minutes',
  SUBTRACT_SECONDS = 'seconds',
}

export const enum UnixCommandOptionName {
  VALUE = 'value',
}

export const enum IsoCommandOptionName {
  VALUE = 'value',
}

export const enum SnowflakeCommandOptionName {
  VALUE = 'value',
}

interface CommandOptionsMap {
  [BotChatInputCommandName.TIMESTAMP]: never,
  [BotChatInputCommandName.IN]: InCommandOptionName,
  [BotChatInputCommandName.AGO]: AgoCommandOptionName,
  [BotChatInputCommandName.AT]: AtCommandOptionName,
  [BotChatInputCommandName.ADD]: AddCommandOptionName,
  [BotChatInputCommandName.SUBTRACT]: SubtractCommandOptionName,
  [BotChatInputCommandName.UNIX]: UnixCommandOptionName,
  [BotChatInputCommandName.ISO]: IsoCommandOptionName,
  [BotChatInputCommandName.STATISTICS]: never,
  [BotMessageContextMenuCommandName.MESSAGE_SENT]: never,
  [BotMessageContextMenuCommandName.MESSAGE_LAST_EDITED]: never,
}

export const enum GlobalCommandResponse {
  INVALID_DATE = 'invalidDate',
  NO_COMPONENTS_CURRENT_TIME = 'noComponentsCurrentTime',
  NO_COMPONENTS_UNIX = 'noComponentsUnix',
}

export const enum TimestampCommandResponse {
  DEPRECATED = 'deprecated',
}

export const enum AtCommandResponse {
  TIMEZONE_NOT_FOUND = 'timezoneNotFound',
}

export const enum SnowflakeCommandResponse {
  INVALID_SNOWFLAKE = 'invalidSnowflake',
}

export const enum IsoCommandResponse {
  INVALID_ISO_FORMAT = 'invalidIsoFormat',
}

export const enum MessageSentCommandResponse {
  TARGET_MESSAGE = 'targetMessage',
}

export const enum MessageLastEditedCommandResponse {
  TARGET_MESSAGE = 'targetMessage',
  NOT_EDITED = 'notEdited',
}

export const enum ExtractTimestampsCommandResponse {
  TARGET_MESSAGE = 'targetMessage',
  NO_TIMESTAMPS = 'noTimestamps',
}

interface CommandResponsesMap {
  global: GlobalCommandResponse,
  [BotChatInputCommandName.TIMESTAMP]: TimestampCommandResponse,
  [BotChatInputCommandName.IN]: never,
  [BotChatInputCommandName.AGO]: never,
  [BotChatInputCommandName.AT]: AtCommandResponse,
  [BotChatInputCommandName.ADD]: never,
  [BotChatInputCommandName.SUBTRACT]: never,
  [BotChatInputCommandName.UNIX]: never,
  [BotChatInputCommandName.ISO]: IsoCommandResponse,
  [BotChatInputCommandName.STATISTICS]: never,
  [BotChatInputCommandName.SNOWFLAKE]: SnowflakeCommandResponse,
  [BotMessageContextMenuCommandName.MESSAGE_SENT]: MessageSentCommandResponse,
  [BotMessageContextMenuCommandName.MESSAGE_LAST_EDITED]: MessageLastEditedCommandResponse,
  [BotMessageContextMenuCommandName.EXTRACT_TIMESTAMPS]: ExtractTimestampsCommandResponse,
}

export const enum ResponseColumnChoices {
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

export type ResponsesLocalization<CommandKey extends keyof CommandResponsesMap> = {
  responses: { [l in CommandResponsesMap[CommandKey]]: string };
};

export type CommandLocalization<CommandKey extends keyof CommandOptionsMap & keyof CommandResponsesMap = keyof CommandOptionsMap & keyof CommandResponsesMap> =
  Pick<APIApplicationCommand, CommandKey extends BotMessageContextMenuCommandName ? 'name' : ('name' | 'description')>
  & (
    CommandKey extends BotMessageContextMenuCommandName
      ? ResponsesLocalization<CommandKey>
      : ({
        options: { [l in CommandOptionsMap[CommandKey]]: OptionLocalization<l> };
      } & ResponsesLocalization<CommandKey>)
  );

export type Localization = {
  commands: {
    [k in keyof CommandOptionsMap & keyof CommandResponsesMap]: CommandLocalization<k>;
  };
};
