import { TFunction } from 'i18next';
import {
  RESTPostAPIApplicationCommandsJSONBody as ApplicationCommand,
  RESTPostAPIApplicationGuildCommandsJSONBody as ApplicationGuildCommand,
} from 'discord-api-types/v10.js';
import { chatInputCommandMap, chatInputCommandNames } from './commands.js';
import { messageContextMenuCommandMap, messageContextMenuCommands } from './message-context-menu-commands.js';

export const getApplicationCommands = (t: TFunction): (ApplicationGuildCommand & ApplicationCommand)[] => [
  ...chatInputCommandNames.map((commandName) => chatInputCommandMap[commandName].getDefinition(t)),
  ...messageContextMenuCommands.map((commandName) => messageContextMenuCommandMap[commandName].getDefinition(t)),
];
