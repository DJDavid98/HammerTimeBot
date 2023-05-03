import { ContextMenuCommandInteraction } from 'discord.js';
import { BotMessageContextMenuCommand, BotMessageContextMenuCommandName } from '../types/bot-interaction.js';
import { messageSentCommand } from '../commands/message-sent.command.js';
import { messageLastEditedCommand } from '../commands/message-last-edited.command.js';
import { extractTimestampsCommand } from '../commands/extract-timestamps.command.js';

export const messageContextMenuCommandMap: Record<BotMessageContextMenuCommandName, BotMessageContextMenuCommand> = {
  [BotMessageContextMenuCommandName.MESSAGE_SENT]: messageSentCommand,
  [BotMessageContextMenuCommandName.MESSAGE_LAST_EDITED]: messageLastEditedCommand,
  [BotMessageContextMenuCommandName.EXTRACT_TIMESTAMPS]: extractTimestampsCommand,
};

export const messageContextMenuCommands = (Object.keys(messageContextMenuCommandMap) as BotMessageContextMenuCommandName[]);

export const isKnownMessageContextMenuCommand = (commandName: string): commandName is BotMessageContextMenuCommandName => commandName in messageContextMenuCommandMap;

export const isKnownMessageContextmenuInteraction = <InteractionType extends ContextMenuCommandInteraction>(interaction: InteractionType): interaction is InteractionType & {
  commandName: BotMessageContextMenuCommandName
} => isKnownMessageContextMenuCommand(interaction.commandName);
