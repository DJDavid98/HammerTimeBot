import { BaseCommandInteraction, CommandInteractionOption, User } from 'discord.js';

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
  let optionValue = option.value;
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
  }
  return `(${optionName}:${optionValue})`;
}).join(' ');
