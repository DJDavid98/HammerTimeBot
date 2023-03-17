import type { AutocompleteInteraction, BaseInteraction, ChatInputCommandInteraction } from 'discord.js';
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { TFunction } from 'i18next';

export enum BotCommandName {
  ADD = 'add',
  AGO = 'ago',
  AT = 'at',
  IN = 'in',
  STATISTICS = 'statistics',
  SUBTRACT = 'subtract',
  TIMESTAMP = 'timestamp',
  UNIX = 'unix',
  SNOWFLAKE = 'snowflake'
}

export type BotCommandDefinition = Omit<RESTPostAPIChatInputApplicationCommandsJSONBody, 'type'>;

export type InteractionHandler<T extends BaseInteraction> = (interaction: T, t: TFunction) => void | Promise<void>;

export interface BotCommand {
  getDefinition: (t: TFunction) => BotCommandDefinition;
  handle: InteractionHandler<ChatInputCommandInteraction & { commandName: BotCommandName }>;
  autocomplete?: InteractionHandler<AutocompleteInteraction & { commandName: BotCommandName }>;
}
