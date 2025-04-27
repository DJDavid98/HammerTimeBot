import type {
  APIMessageComponent,
  AutocompleteInteraction,
  BaseInteraction,
  ChatInputCommandInteraction,
  MessageComponentInteraction,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord.js';
import { MessageContextMenuCommandInteraction } from 'discord.js';
import type { ApplicationCommandType, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { i18n, TFunction } from 'i18next';

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
  SETTINGS = 'settings',
}

export const enum BotMessageContextMenuCommandName {
  MESSAGE_SENT = 'Message Sent',
  MESSAGE_LAST_EDITED = 'Message Last Edited',
  EXTRACT_TIMESTAMPS = 'Extract Timestamps',
}

export const enum BotMessageComponentCustomId {
  FORMAT_SELECT = 'format-select',
}

export interface InteractionHandlerContext {
  i18next: i18n;
  emojiIdMap: Record<string, string>;
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
  getDefinition: (t: TFunction) => Omit<RESTPostAPIContextMenuApplicationCommandsJSONBody, 'type'> & {
    type: ApplicationCommandType.Message
  };
  handle: InteractionHandler<MessageContextMenuCommandInteraction & { commandName: BotMessageContextMenuCommandName }>;
}

export interface BotMessageComponent {
  getDefinition: (t: TFunction, emojiIdMap: Record<string, string>) => APIMessageComponent;
  handle: InteractionHandler<MessageComponentInteraction & { customId: BotMessageComponentCustomId }>;
}
