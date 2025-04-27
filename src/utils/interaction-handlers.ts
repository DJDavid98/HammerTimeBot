import {
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  CommandInteraction,
  ContextMenuCommandInteraction,
  InteractionType,
  MessageComponentInteraction,
  MessageContextMenuCommandInteraction,
} from 'discord.js';
import { chatInputCommandMap, isKnownChatInputCommandInteraction } from './interactions/chat-input-commands.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';
import {
  getUserIdentifier,
  isEphemeralResponse,
  stringifyChannelName,
  stringifyGuildName,
  stringifyOptionsData,
} from './messaging.js';
import { ApplicationCommandType, MessageFlags } from 'discord-api-types/v10';
import { DEFAULT_LANGUAGE } from '../constants/locales.js';
import {
  isKnownMessageContextmenuInteraction,
  messageContextMenuCommandMap,
} from './interactions/message-context-menu-commands.js';
import { getSettings } from './settings.js';
import { InteractionHandlerContext } from '../types/bot-interaction.js';
import { TFunction } from 'i18next';
import { isKnownMessageComponentInteraction, messageComponentMap } from './interactions/message-components.js';

const ellipsis = '…';

const processingErrorMessageFactory = (t: TFunction): string => `${EmojiCharacters.OCTAGONAL_SIGN} ${t('commands.global.responses.unexpectedError')}`;

const handleInteractionError = async (interaction: ChatInputCommandInteraction | ButtonInteraction | AutocompleteInteraction | ContextMenuCommandInteraction | MessageComponentInteraction, t: TFunction) => {
  if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
    await interaction.respond([
      {
        value: '',
        name: processingErrorMessageFactory(t),
      },
    ]);
    return;
  }

  if (!interaction.replied) {
    await interaction.reply({
      content: processingErrorMessageFactory(t),
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  // If we already replied, we need to do some editing on the existing message to include the error
  const oldReplyContent = (await interaction.fetchReply()).content;
  const messageSuffix = `\n\n${processingErrorMessageFactory(t)}`;
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

interface CreateTFunctionOptions {
  i18next: InteractionHandlerContext['i18next'];
  ephemeral: boolean | null;
  locale: string;
  guild: { preferredLocale?: string } | undefined | null;
}

const createTFunction = ({ i18next, ephemeral, locale, guild }: CreateTFunctionOptions) => {
  return i18next.getFixedT(
    // Always use user's locale for ephemeral responses, otherwise use server's preferred locale when available
    ephemeral
      ? [locale, DEFAULT_LANGUAGE] :
      (
        guild?.preferredLocale
          ? [guild.preferredLocale, DEFAULT_LANGUAGE]
          : DEFAULT_LANGUAGE
      ),
  );
};

export const handleContextMenuInteraction = async (interaction: MessageContextMenuCommandInteraction, {
  i18next,
  ...context
}: InteractionHandlerContext): Promise<void> => {
  if (!isKnownMessageContextmenuInteraction(interaction)) {
    await interaction.reply({
      content: `Unsupported context menu interaction with name ${interaction.commandName}`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const { commandName, user, locale, channel, channelId, guild, guildId } = interaction;
  const command = messageContextMenuCommandMap[commandName];
  const t = createTFunction({
    i18next,
    ephemeral: true,
    locale,
    guild,
  });

  console.log(`${getUserIdentifier(user)} ran "${commandName}" in ${stringifyChannelName(channelId, channel)} of ${stringifyGuildName(guildId, guild)}`);

  try {
    await command.handle(interaction, { ...context, t });
  } catch (e) {
    console.error(`Error while responding to context menu command (commandName=${commandName})`, e);
    await handleInteractionError(interaction, t);
  }
};

export const handleCommandInteraction = async (interaction: CommandInteraction, context: InteractionHandlerContext): Promise<void> => {
  if (!isChatInputCommandInteraction(interaction)) {
    if (interaction.isMessageContextMenuCommand()) {
      return handleContextMenuInteraction(interaction, context);
    }
    await interaction.reply({
      content: `Unsupported command type ${interaction.commandType} when running ${interaction.commandName}`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (!isKnownChatInputCommandInteraction(interaction)) {
    await interaction.reply(`Unknown command ${interaction.commandName}`);
    return;
  }

  const { commandName, user, options, channel, channelId, guild, guildId, locale } = interaction;
  const command = chatInputCommandMap[commandName];
  const ephemeral = isEphemeralResponse(interaction, await getSettings(context, interaction));
  const { i18next, ...interactionContext } = context;
  const t = createTFunction({
    i18next,
    ephemeral,
    locale,
    guild,
  });

  const optionsString = options.data.length > 0
    ? ` ${stringifyOptionsData(interaction.options.data)}`
    : '';
  console.log(`${getUserIdentifier(user)} ran /${commandName}${optionsString} in ${stringifyChannelName(channelId, channel)} of ${stringifyGuildName(guildId, guild)}`);

  try {
    await command.handle(interaction, { ...interactionContext, t });
  } catch (e) {
    console.error(`Error while responding to command interaction (commandName=${commandName})`, e);
    await handleInteractionError(interaction, t);
  }
};

export const handleCommandAutocomplete = async (interaction: AutocompleteInteraction, {
  i18next,
  ...context
}: InteractionHandlerContext): Promise<void> => {
  if (!isKnownChatInputCommandInteraction(interaction)) {
    return;
  }

  const { commandName, locale, guild } = interaction;
  const command = chatInputCommandMap[commandName];
  const t = createTFunction({
    i18next,
    ephemeral: null,
    locale,
    guild,
  });

  try {
    await command.autocomplete?.(interaction, { ...context, t });
  } catch (e) {
    console.error(`Error while responding to command autocomplete (commandName=${commandName})`, e);
    await handleInteractionError(interaction, t);
  }
};

export const handleComponentInteraction = async (interaction: MessageComponentInteraction, {
  i18next,
  ...context
}: InteractionHandlerContext): Promise<void> => {
  if (!isKnownMessageComponentInteraction(interaction)) {
    await interaction.reply({
      content: `Unsupported component interaction with customId ${interaction.customId}`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const { customId, user, locale, channel, channelId, guild, guildId } = interaction;
  const command = messageComponentMap[customId];
  const t = createTFunction({
    i18next,
    ephemeral: true,
    locale,
    guild,
  });

  console.log(`${getUserIdentifier(user)} interacted with component "${customId}" in ${stringifyChannelName(channelId, channel)} of ${stringifyGuildName(guildId, guild)}`);

  try {
    await command.handle(interaction, { ...context, t });
  } catch (e) {
    console.error(`Error while responding to component interaction (customId=${customId})`, e);
    await handleInteractionError(interaction, t);
  }
};
