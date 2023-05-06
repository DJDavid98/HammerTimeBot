import {
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  CommandInteraction, ContextMenuCommandInteraction,
  InteractionType, MessageContextMenuCommandInteraction,
} from 'discord.js';
import { i18n } from 'i18next';
import { chatInputCommandMap, isKnownChatInputCommandInteraction } from './commands.js';
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
import { messageContextMenuCommandMap, isKnownMessageContextmenuInteraction } from './message-context-menu-commands.js';

const ellipsis = '…';

const processingErrorMessageFactory = (): string => `${EmojiCharacters.OCTAGONAL_SIGN} There was an unexpected error while processing this interaction`;

const handleInteractionError = async (interaction: ChatInputCommandInteraction | ButtonInteraction | AutocompleteInteraction | ContextMenuCommandInteraction) => {
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

export const handleContextMenuInteraction = async (interaction: MessageContextMenuCommandInteraction, i18next: i18n): Promise<void> => {
  if (!isKnownMessageContextmenuInteraction(interaction)) {
    await interaction.reply({
      content: `Unsupported context menu interaction with name ${interaction.commandName}`,
      ephemeral: true,
    });
    return;
  }

  const { commandName, user, locale, channel, guild } = interaction;
  const command = messageContextMenuCommandMap[commandName];
  const t = i18next.getFixedT(locale);

  console.log(`${getUserIdentifier(user)} ran "${commandName}" in ${stringifyChannelName(channel)} of ${stringifyGuildName(guild)}`);

  try {
    await command.handle(interaction, t);
  } catch (e) {
    console.error(`Error while responding to context menu command (commandName=${commandName})`, e);
    await handleInteractionError(interaction);
  }
};


export const handleCommandInteraction = async (interaction: CommandInteraction, i18next: i18n): Promise<void> => {
  if (!isChatInputCommandInteraction(interaction)) {
    if (interaction.isMessageContextMenuCommand()) {
      return handleContextMenuInteraction(interaction, i18next);
    }
    await interaction.reply({
      content: `Unsupported command type ${interaction.commandType} when running ${interaction.commandName}`,
      ephemeral: true,
    });
    return;
  }

  if (!isKnownChatInputCommandInteraction(interaction)) {
    await interaction.reply(`Unknown command ${interaction.commandName}`);
    return;
  }

  const { commandName, user, options, channel, guild, locale } = interaction;
  const command = chatInputCommandMap[commandName];
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
  if (!isKnownChatInputCommandInteraction(interaction)) {
    return;
  }

  const { commandName, locale } = interaction;
  const command = chatInputCommandMap[commandName];
  const t = i18next.getFixedT(locale);

  try {
    await command.autocomplete?.(interaction, t);
  } catch (e) {
    console.error(`Error while responding to command autocomplete (commandName=${commandName})`, e);
    await handleInteractionError(interaction);
  }
};
