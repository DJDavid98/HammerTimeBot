import {
  RESTPostAPIApplicationGuildCommandsJSONBody as ApplicationGuildCommand,
  RESTPostAPIApplicationCommandsJSONBody as ApplicationCommand,
} from 'discord-api-types/rest/v10/interactions.js';
import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { TFunction } from 'i18next';
import { BotCommand, BotCommandName } from '../types/bot-interaction.js';
import { timestampCommand } from '../commands/timestamp.command.js';

export const commandMap: Record<BotCommandName, BotCommand> = {
  [BotCommandName.TIMESTAMP]: timestampCommand,
};

export const commandNames = (Object.keys(commandMap) as BotCommandName[]);

export const getCommands = (t: TFunction): (ApplicationGuildCommand & ApplicationCommand)[] => commandNames.map((commandName) => ({
  ...commandMap[commandName].getDefinition(t),
  type: ApplicationCommandType.ChatInput,
}));

export const isKnownCommand = (commandName: string): commandName is BotCommandName => commandName in commandMap;

export const isKnownCommandInteraction = <InteractionType extends CommandInteraction | AutocompleteInteraction>(interaction: InteractionType): interaction is InteractionType & { commandName: BotCommandName } => isKnownCommand(interaction.commandName);
