import {
  BaseCommandInteraction, CommandInteraction, CommandInteractionOption, User,
} from 'discord.js';
import { BotCommandName } from '../bot-interaction-types.js';
import { Localization } from '../types/localization.js';
import { locales } from '../constants/locales.js';

export const getUserIdentifier = (user: User): `${string}#${string} (${string})` => `${user.username}#${user.discriminator} (${user.id})`;

export const stringifyChannelName = (channel: BaseCommandInteraction['channel']): string => {
  if (channel) {
    if (channel.isText() && 'name' in channel) {
      return `#${channel.name}`;
    }

    return channel.toString();
  }

  return '(unknown channel)';
};

export const stringifyOptionsData = (data: readonly CommandInteractionOption[]): string => data.map((option): string => {
  const optionName = option.name;
  let optionValue: string | number | boolean | null | undefined = option.value;
  // eslint-disable-next-line default-case
  switch (option.type) {
    case 'CHANNEL':
      if (option.channel) optionValue = `${option.channel.type === 'GUILD_TEXT' ? '#' : ''}${option.channel.name}`;
      break;
    case 'USER':
      if (option.user) optionValue = getUserIdentifier(option.user);
      break;
    case 'ROLE':
      if (option.role) optionValue = `@${option.role.name}`;
      break;
    case 'SUB_COMMAND':
      optionValue = option.options ? stringifyOptionsData(option.options) : null;
      break;
  }
  return `(${optionName}${optionValue !== null ? `:${optionValue}` : ''})`;
}).join(' ');

export const localizedReply = <Command extends BotCommandName, ReplyKey extends keyof Localization['commands'][Command]['responses']>(interaction: CommandInteraction, command: BotCommandName, reply: ReplyKey): string => {
  const localization = interaction.locale in locales ? locales[interaction.locale as keyof typeof locales] : locales['en-US'];
  return (localization.commands[command].responses as Record<ReplyKey, string>)[reply];
};
