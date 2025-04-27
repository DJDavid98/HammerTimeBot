import { MessageComponentInteraction } from 'discord.js';
import { BotMessageComponent, BotMessageComponentCustomId } from '../../types/bot-interaction.js';
import { formatSelectComponent } from '../../components/format-select.component.js';

export const messageComponentMap: Record<BotMessageComponentCustomId, BotMessageComponent> = {
  [BotMessageComponentCustomId.FORMAT_SELECT]: formatSelectComponent,
};

export const messageComponents = (Object.keys(messageComponentMap) as BotMessageComponentCustomId[]);

export const isKnownMessageComponent = (customId: string): customId is BotMessageComponentCustomId => customId in messageComponentMap;

export const isKnownMessageComponentInteraction = <InteractionType extends MessageComponentInteraction>(interaction: InteractionType): interaction is InteractionType & {
  customId: BotMessageComponentCustomId
} => isKnownMessageComponent(interaction.customId);
