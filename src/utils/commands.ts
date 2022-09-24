import {
  RESTPostAPIApplicationCommandsJSONBody as ApplicationCommand,
  RESTPostAPIApplicationGuildCommandsJSONBody as ApplicationGuildCommand,
  ApplicationCommandType,
} from 'discord-api-types/v10';
import { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { TFunction } from 'i18next';
import { BotCommand, BotCommandName } from '../types/bot-interaction.js';
import { addCommand } from '../commands/add.command.js';
import { agoCommand } from '../commands/ago.command.js';
import { atCommand } from '../commands/at.command.js';
import { inCommand } from '../commands/in.command.js';
import { statisticsCommand } from '../commands/statistics.command.js';
import { subtractCommand } from '../commands/subtract.command.js';
import { timestampCommand } from '../commands/timestamp.command.js';
import { unixCommand } from '../commands/unix.command.js';

export const commandMap: Record<BotCommandName, BotCommand> = {
  [BotCommandName.ADD]: addCommand,
  [BotCommandName.AGO]: agoCommand,
  [BotCommandName.AT]: atCommand,
  [BotCommandName.IN]: inCommand,
  [BotCommandName.STATISTICS]: statisticsCommand,
  [BotCommandName.SUBTRACT]: subtractCommand,
  [BotCommandName.TIMESTAMP]: timestampCommand,
  [BotCommandName.UNIX]: unixCommand,
};

export const commandNames = (Object.keys(commandMap) as BotCommandName[]);

export const getCommands = (t: TFunction): (ApplicationGuildCommand & ApplicationCommand)[] => commandNames.map((commandName) => ({
  ...commandMap[commandName].getDefinition(t),
  type: ApplicationCommandType.ChatInput,
}));

export const isKnownCommand = (commandName: string): commandName is BotCommandName => commandName in commandMap;

export const isKnownCommandInteraction = <InteractionType extends ChatInputCommandInteraction | AutocompleteInteraction>(interaction: InteractionType): interaction is InteractionType & { commandName: BotCommandName } => isKnownCommand(interaction.commandName);
