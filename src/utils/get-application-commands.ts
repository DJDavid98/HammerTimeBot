import { TFunction } from 'i18next';
import {
  ApplicationIntegrationType,
  InteractionContextType,
  RESTPostAPIApplicationCommandsJSONBody as ApplicationCommand,
  RESTPostAPIApplicationGuildCommandsJSONBody as ApplicationGuildCommand,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { chatInputCommandMap, chatInputCommandNames } from './interactions/chat-input-commands.js';
import {
  messageContextMenuCommandMap,
  messageContextMenuCommands,
} from './interactions/message-context-menu-commands.js';
import { BotChatInputCommandName } from '../types/bot-interaction.js';

const commonCommandOptions: Pick<RESTPostAPIChatInputApplicationCommandsJSONBody, 'integration_types' | 'contexts'> = {
  integration_types: [ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall],
  contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
};

const onlyApplicableChatInputCommands = (commandName: BotChatInputCommandName) =>
  chatInputCommandMap[commandName].registerCondition?.() ?? true;

export type BotCommandItem = (ApplicationGuildCommand & ApplicationCommand);
export type BotCommands = BotCommandItem[];
export const getApplicationCommands = (t: TFunction): BotCommands => [
  ...chatInputCommandNames
    .filter(onlyApplicableChatInputCommands)
    .map((commandName) => ({
      ...commonCommandOptions,
      ...chatInputCommandMap[commandName].getDefinition(t),
    })),
  ...messageContextMenuCommands
    .map((commandName) => ({
      ...messageContextMenuCommandMap[commandName].getDefinition(t),
      ...commonCommandOptions,
    })),
];
