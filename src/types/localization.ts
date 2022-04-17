import { APIApplicationCommand } from 'discord-api-types/v10';
import {
  APIApplicationCommandOption,
} from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/chatInput.js';
import { BotCommandName } from '../bot-interaction-types.js';

export enum TimestampCommandOptionName {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day',
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
  TIMEZONE = 'timezone',
  FORMAT = 'format',
}

interface CommandOptionsMap {
  [BotCommandName.TIMESTAMP]: TimestampCommandOptionName,
}

export type OptionLocalization = Pick<APIApplicationCommandOption, 'name' | 'description'> & {
  choices?: Record<string, string>
};

export type CommandLocalization<K extends keyof CommandOptionsMap = keyof CommandOptionsMap> =
  Pick<APIApplicationCommand, 'name' | 'description'>
  & {
    options: { [l in CommandOptionsMap[K]]: OptionLocalization };
  };

export type Localization = {
  commands: {
    [k in keyof CommandOptionsMap]: CommandLocalization<k>;
  };
};
