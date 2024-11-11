import { TFunction } from 'i18next';
import {
  ApplicationIntegrationType,
  InteractionContextType,
  RESTPostAPIApplicationCommandsJSONBody as ApplicationCommand,
  RESTPostAPIApplicationGuildCommandsJSONBody as ApplicationGuildCommand,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { chatInputCommandMap, chatInputCommandNames } from './commands.js';
import { messageContextMenuCommandMap, messageContextMenuCommands } from './message-context-menu-commands.js';

const commonCommandOptions: Pick<RESTPostAPIChatInputApplicationCommandsJSONBody, 'integration_types' | 'contexts'> = {
  integration_types: [ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall],
  contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
};

export const getApplicationCommands = (t: TFunction): (ApplicationGuildCommand & ApplicationCommand)[] => [
  ...chatInputCommandNames.map((commandName) => ({
    ...commonCommandOptions,
    ...chatInputCommandMap[commandName].getDefinition(t),
  })),
  ...messageContextMenuCommands.map((commandName) => ({
    ...messageContextMenuCommandMap[commandName].getDefinition(t),
    ...commonCommandOptions,
  })),
];
