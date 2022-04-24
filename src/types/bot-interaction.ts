import type { CommandInteraction, AutocompleteInteraction, Interaction } from 'discord.js';
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/rest/v10/interactions.js';
import { TFunction } from 'i18next';

export enum BotCommandName {
  TIMESTAMP = 'timestamp',
}

export type BotCommandDefinition = Omit<RESTPostAPIChatInputApplicationCommandsJSONBody, 'type'>;

export type InteractionHandler<T extends Interaction> = (interaction: T, t: TFunction) => void | Promise<void>;

export interface BotCommand {
  getDefinition: (t: TFunction) => BotCommandDefinition;
  handle: InteractionHandler<CommandInteraction & { commandName: BotCommandName }>;
  autocomplete?: InteractionHandler<AutocompleteInteraction & { commandName: BotCommandName }>;
}
