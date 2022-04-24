import { BaseCommandInteraction, CommandInteractionOption, User } from 'discord.js';

export const getUserIdentifier = (user: User): `${string}#${string} (${string})` => `${user.username}#${user.discriminator} (${user.id})`;

export const stringifyChannelName = (channel: BaseCommandInteraction['channel']): string => {
  if (channel) {
    let stringName: string;
    if (channel.isText() && 'name' in channel) {
      stringName = `#${channel.name}`;
    } else {
      stringName = channel.toString();
    }

    return `${stringName} (${channel.id})`;
  }

  return '(unknown channel)';
};

export const stringifyGuildName = (guild: BaseCommandInteraction['guild']): string => {
  if (guild) {
    return `${guild.name} (${guild.id})`;
  }

  return '(unknown guild)';
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
