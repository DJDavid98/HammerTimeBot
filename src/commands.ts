import {
  RESTPostAPIApplicationGuildCommandsJSONBody as ApplicationGuildCommand,
} from 'discord-api-types/rest/v10/interactions.js';
import { CommandInteraction } from 'discord.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { BotCommand, BotCommandName } from './bot-interaction-types.js';
import { timestampCommand } from './commands/timestamp.command.js';

export const commandMap: Record<BotCommandName, BotCommand> = {
  [BotCommandName.TIMESTAMP]: timestampCommand,
};

export const commandNames = (Object.keys(commandMap) as BotCommandName[]);

export const commands: ApplicationGuildCommand[] = commandNames.map((commandName) => ({
  ...commandMap[commandName].definition,
  name: commandName,
  type: ApplicationCommandType.ChatInput,
}));

export const isKnownCommand = (commandName: string): commandName is BotCommandName => commandName in commandMap;

export const isKnownCommandInteraction = (interaction: CommandInteraction): interaction is CommandInteraction & { commandName: BotCommandName } => isKnownCommand(interaction.commandName);
