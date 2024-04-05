import { TFunction } from 'i18next';
import {
  RESTPostAPIApplicationCommandsJSONBody as ApplicationCommand,
  RESTPostAPIApplicationGuildCommandsJSONBody as ApplicationGuildCommand,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10.js';
import { chatInputCommandMap, chatInputCommandNames } from './commands.js';
import { messageContextMenuCommandMap, messageContextMenuCommands } from './message-context-menu-commands.js';

const commonChatInputCommandOptions: Partial<RESTPostAPIChatInputApplicationCommandsJSONBody> = {
  dm_permission: true,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Missing beta keys from types
  // @ts-ignore
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

export const getApplicationCommands = (t: TFunction): (ApplicationGuildCommand & ApplicationCommand)[] => [
  ...chatInputCommandNames.map((commandName) => ({
    ...commonChatInputCommandOptions,
    ...chatInputCommandMap[commandName].getDefinition(t),
  })),
  ...messageContextMenuCommands.map((commandName) => messageContextMenuCommandMap[commandName].getDefinition(t)),
];
