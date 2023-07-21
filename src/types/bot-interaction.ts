import type {
  AutocompleteInteraction,
  BaseInteraction,
  ChatInputCommandInteraction,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord.js';
import { MessageContextMenuCommandInteraction } from 'discord.js';
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { i18n, TFunction } from 'i18next';
import { Client } from 'pg';
import Redis from 'ioredis';

export const enum BotChatInputCommandName {
  ADD = 'add',
  AGO = 'ago',
  AT = 'at',
  IN = 'in',
  ISO = 'iso',
  SNOWFLAKE = 'snowflake',
  STATISTICS = 'statistics',
  SUBTRACT = 'subtract',
  UNIX = 'unix',
}

export const enum BotMessageContextMenuCommandName {
  MESSAGE_SENT = 'Message Sent',
  MESSAGE_LAST_EDITED = 'Message Last Edited',
  EXTRACT_TIMESTAMPS = 'Extract Timestamps',
}

export interface InteractionHandlerContext {
  i18next: i18n;
  db: Client;
  redis: Redis;
}

export interface InteractionContext extends Omit<InteractionHandlerContext, 'i18next'> {
  t: TFunction;
}

export type InteractionHandler<T extends BaseInteraction> = (interaction: T, context: InteractionContext) => void | Promise<void>;

export interface BotChatInputCommand {
  getDefinition: (t: TFunction) => RESTPostAPIChatInputApplicationCommandsJSONBody;
  handle: InteractionHandler<ChatInputCommandInteraction & { commandName: BotChatInputCommandName }>;
  autocomplete?: InteractionHandler<AutocompleteInteraction & { commandName: BotChatInputCommandName }>;
}

export interface BotMessageContextMenuCommand {
  getDefinition: (t: TFunction) => RESTPostAPIContextMenuApplicationCommandsJSONBody;
  handle: InteractionHandler<MessageContextMenuCommandInteraction & { commandName: BotMessageContextMenuCommandName }>;
}
