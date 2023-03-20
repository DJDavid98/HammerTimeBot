import {
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  CommandInteraction,
  InteractionType,
} from 'discord.js';
import { i18n } from 'i18next';
import { commandMap, isKnownCommandInteraction } from './commands.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';
import {
  getUserIdentifier,
  isEphemeralResponse,
  stringifyChannelName,
  stringifyGuildName,
  stringifyOptionsData,
} from './messaging.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { DEFAULT_LANGUAGE } from '../constants/locales.js';

const ellipsis = '…';

const processingErrorMessageFactory = (): string => `${EmojiCharacters.OCTAGONAL_SIGN} There was an unexpected error while processing this interaction`;

const handleInteractionError = async (interaction: ChatInputCommandInteraction | ButtonInteraction | AutocompleteInteraction) => {
  if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
    await interaction.respond([
      {
        value: '',
        name: processingErrorMessageFactory(),
      },
    ]);
    return;
  }

  if (!interaction.replied) {
    await interaction.reply({
      content: processingErrorMessageFactory(),
      ephemeral: true,
    });
    return;
  }
  // If we already replied, we need to do some editing on the existing message to include the error
  const oldReplyContent = (await interaction.fetchReply()).content;
  const messageSuffix = `\n\n${processingErrorMessageFactory()}`;
  let newContent = oldReplyContent + messageSuffix;
  const maximumMessageLength = 2000;
  if (newContent.length > maximumMessageLength) {
    newContent = oldReplyContent.substring(0, maximumMessageLength - messageSuffix.length - ellipsis.length) + ellipsis + messageSuffix;
  }
  await interaction.editReply({
    content: newContent,
  });
};

const isChatInputCommandInteraction = (interaction: CommandInteraction): interaction is ChatInputCommandInteraction => {
  return interaction.commandType === ApplicationCommandType.ChatInput;
};

export const handleCommandInteraction = async (interaction: CommandInteraction, i18next: i18n): Promise<void> => {
  if (!isChatInputCommandInteraction(interaction)) {
    await interaction.reply(`Unsupported command type ${interaction.commandName}`);
    return;
  }

  if (!isKnownCommandInteraction(interaction)) {
    await interaction.reply(`Unknown command ${interaction.commandName}`);
    return;
  }

  const { commandName, user, options, channel, guild, locale } = interaction;
  const command = commandMap[commandName];
  const ephemeral = isEphemeralResponse(interaction);
  // Always use user's locale for ephemeral responses, otherwise use server's preferred locale when available
  const t = i18next.getFixedT(
    ephemeral
      ? [locale, DEFAULT_LANGUAGE] :
      (
        guild?.preferredLocale
          ? [guild.preferredLocale, DEFAULT_LANGUAGE]
          : DEFAULT_LANGUAGE
      ),
  );

  const optionsString = options.data.length > 0
    ? ` ${stringifyOptionsData(interaction.options.data)}`
    : '';
  console.log(`${getUserIdentifier(user)} ran /${commandName}${optionsString} in ${stringifyChannelName(channel)} of ${stringifyGuildName(guild)}`);

  try {
    await command.handle(interaction, t);
  } catch (e) {
    console.error(`Error while responding to command interaction (commandName=${commandName})`, e);
    await handleInteractionError(interaction);
  }
};

export const handleCommandAutocomplete = async (interaction: AutocompleteInteraction, i18next: i18n): Promise<void> => {
  if (!isKnownCommandInteraction(interaction)) {
    return;
  }

  const { commandName, locale } = interaction;
  const command = commandMap[commandName];
  const t = i18next.getFixedT(locale);

  try {
    await command.autocomplete?.(interaction, t);
  } catch (e) {
    console.error(`Error while responding to command autocomplete (commandName=${commandName})`, e);
    await handleInteractionError(interaction);
  }
};
