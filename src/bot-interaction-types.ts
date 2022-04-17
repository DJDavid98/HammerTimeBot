import type { CommandInteraction } from 'discord.js';
import { Interaction } from 'discord.js';
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/rest/v10/interactions.js';

export enum BotCommandName {
  TIMESTAMP = 'timestamp',
}

export type BotCommandDefinition = Omit<RESTPostAPIChatInputApplicationCommandsJSONBody, 'name' | 'type'>;

export type InteractionHandler<T extends Interaction> = (interaction: T) => void | Promise<void>;

export interface BotCommand {
  definition: BotCommandDefinition;
  handle: InteractionHandler<CommandInteraction & { commandName: BotCommandName }>;
}
