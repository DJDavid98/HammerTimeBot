import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  ChannelType,
  ChatInputCommandInteraction,
  CommandInteraction,
  CommandInteractionOption,
  User,
} from 'discord.js';
import { GlobalCommandOptionName } from '../types/localization.js';
import { SettingsValue } from './settings.js';
import { TFunction } from 'i18next';
import { findTimezone, gmtTimezoneOptions } from './time.js';
import { TimezoneError } from '../classes/timezone-error.js';
import { MessageFlags } from 'discord-api-types/v10';

type UserFriendCode = `@${string}` | `${string}#${string}`;
export const getUserFriendCode = (user: User): UserFriendCode => {
  return user.discriminator === '0' ? `@${user.username}` : `${user.username}#${user.discriminator}`;
};

export const getUserIdentifier = (user: User): `${UserFriendCode} (${string})` => {
  return `${getUserFriendCode(user)} (${user.id})`;
};

export const stringifyChannelName = (channelId: string, channel?: CommandInteraction['channel']): string => {
  if (channel) {
    let stringName: string;
    if (channel.type === ChannelType.GuildText && 'name' in channel) {
      stringName = `#${channel.name}`;
    } else {
      stringName = channel.toString();
    }

    return `${stringName} (${channel.id})`;
  }

  return `Channel#${channelId}`;
};

export const stringifyGuildName = (guildId: string | null, guild: CommandInteraction['guild']): string => {
  if (guild?.name) {
    return `${guild.name} (${guild.id})`;
  }

  const potentialGuildId = guild?.id ?? guildId;
  if (potentialGuildId) {
    return `Guild#${guildId}`;
  }

  return '(unknown guild)';
};

export const stringifyOptionsData = (data: readonly CommandInteractionOption[]): string => data.map((option): string => {
  const optionName = option.name;
  let optionValue: string | number | boolean | null | undefined = option.value;
  // eslint-disable-next-line default-case
  switch (option.type) {
    case ApplicationCommandOptionType.Channel:
      if (option.channel) optionValue = `${option.channel.type === ChannelType.GuildText ? '#' : ''}${option.channel.name}`;
      break;
    case ApplicationCommandOptionType.User:
      if (option.user) optionValue = getUserIdentifier(option.user);
      break;
    case ApplicationCommandOptionType.Role:
      if (option.role) optionValue = `@${option.role.name}`;
      break;
    case ApplicationCommandOptionType.Subcommand:
      optionValue = option.options ? stringifyOptionsData(option.options) : null;
      break;
  }
  return `(${optionName}${optionValue !== null ? `:${optionValue}` : ''})`;
}).join(' ');

// TODO Remove and make fallback value of `isEphemeralResponse` after notice is removed
export const EPHEMERAL_OPTION_DEFAULT_VALUE = true;

export const isEphemeralResponse = (interaction: ChatInputCommandInteraction, settings: Pick<SettingsValue, 'ephemeral'>): boolean | null => interaction.options.getBoolean(GlobalCommandOptionName.EPHEMERAL) ?? settings.ephemeral ?? null;

type BareNumberFormatter = Pick<Intl.NumberFormat, 'format'>;
const numberFormatterCache: Partial<Record<string, BareNumberFormatter>> = {};
export const getBareNumberFormatter = (interaction: Pick<CommandInteraction, 'locale'>) => {
  let numberFormatter: BareNumberFormatter | undefined = numberFormatterCache[interaction.locale];
  if (!numberFormatter) {
    numberFormatter = { format: (value: number): string => value.toString() };
    try {
      numberFormatter = new Intl.NumberFormat(interaction.locale);
    } catch (e) {
      console.error(`Failed to create number formatter with locale ${interaction.locale}`);
      console.error(e);
    }
    numberFormatterCache[interaction.locale] = numberFormatter;
  }
  return numberFormatter;
};

/**
 * Normally this is able to always return some kind of value, so if we get null the code flow should be terminated
 */
export const findTimezoneOptionValue = async (t: TFunction, interaction: ChatInputCommandInteraction, settings: SettingsValue): Promise<string | null> => {
  const timezoneInput = interaction.options.getString(GlobalCommandOptionName.TIMEZONE);
  // Apply user's timezone settings, if available
  let timezone = settings.timezone ?? 'GMT';
  if (timezoneInput) {
    try {
      timezone = findTimezone(timezoneInput)[0];
    } catch (e) {
      if (!(e instanceof TimezoneError)) {
        throw e;
      }
      await interaction.reply({
        content: t('commands.global.responses.timezoneNotFound'),
        flags: MessageFlags.Ephemeral,
      });
      return null;
    }
  }
  return timezone;
};

export const handleTimezoneAutocomplete = async (interaction: AutocompleteInteraction) => {
  const value = interaction.options.getString(GlobalCommandOptionName.TIMEZONE)?.trim();
  let tzNames: string[];
  if (typeof value !== 'string' || value.length === 0) {
    tzNames = gmtTimezoneOptions;
  } else {
    try {
      tzNames = findTimezone(value);
    } catch (e) {
      if (!(e instanceof TimezoneError)) {
        throw e;
      }
      await interaction.respond([]);
      return;
    }
  }

  await interaction.respond(tzNames.slice(0, 25).map(name => ({ name, value: name })));
};
