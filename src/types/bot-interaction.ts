import type {
  AutocompleteInteraction,
  BaseInteraction,
  ChatInputCommandInteraction,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord.js';
import { MessageContextMenuCommandInteraction } from 'discord.js';
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { TFunction } from 'i18next';

export const enum BotChatInputCommandName {
  ADD = 'add',
  AGO = 'ago',
  AT = 'at',
  IN = 'in',
  ISO = 'iso',
  SNOWFLAKE = 'snowflake',
  STATISTICS = 'statistics',
  SUBTRACT = 'subtract',
  TIMESTAMP = 'timestamp',
  UNIX = 'unix',
}

export const enum BotMessageContextMenuCommandName {
  MESSAGE_SENT = 'Message Sent',
  MESSAGE_LAST_EDITED = 'Message Last Edited',
}

export type InteractionHandler<T extends BaseInteraction> = (interaction: T, t: TFunction) => void | Promise<void>;

export interface BotChatInputCommand {
  getDefinition: (t: TFunction) => RESTPostAPIChatInputApplicationCommandsJSONBody;
  handle: InteractionHandler<ChatInputCommandInteraction & { commandName: BotChatInputCommandName }>;
  autocomplete?: InteractionHandler<AutocompleteInteraction & { commandName: BotChatInputCommandName }>;
}

export interface BotMessageContextMenuCommand {
  getDefinition: (t: TFunction) => RESTPostAPIContextMenuApplicationCommandsJSONBody;
  handle: InteractionHandler<MessageContextMenuCommandInteraction & { commandName: BotMessageContextMenuCommandName }>;
}
