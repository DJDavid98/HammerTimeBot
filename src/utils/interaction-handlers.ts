import { AutocompleteInteraction, ButtonInteraction, CommandInteraction } from 'discord.js';
import { TFunction } from 'i18next';
import { commandMap, isKnownCommandInteraction } from './commands.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';
import { getUserIdentifier, stringifyChannelName, stringifyGuildName, stringifyOptionsData } from './messaging.js';

const ellipsis = '…';

const processingErrorMessageFactory = (): string => `${EmojiCharacters.OCTAGONAL_SIGN} There was an unexpected error while processing this interaction`;

const handleInteractionError = async (interaction: CommandInteraction | ButtonInteraction | AutocompleteInteraction) => {
  if (interaction.isAutocomplete()) {
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

export const handleCommandInteraction = async (interaction: CommandInteraction, t: TFunction): Promise<void> => {
  if (!isKnownCommandInteraction(interaction)) {
    await interaction.reply(`Unknown command ${interaction.commandName}`);
    return;
  }

  const {
    commandName, user, options, channel, guild,
  } = interaction;
  const command = commandMap[commandName];
  const level = interaction.inGuild() ? 'GUILD' : 'APP';

  const optionsString = options.data.length > 0
    ? ` ${stringifyOptionsData(interaction.options.data)}`
    : '';
  console.log(`${getUserIdentifier(user)} ran [${level}] /${commandName}${optionsString} in ${stringifyChannelName(channel)} of ${stringifyGuildName(guild)}`);

  try {
    await command.handle(interaction, t);
  } catch (e) {
    console.error(`Error while responding to command interaction (commandName=${commandName})`, e);
    await handleInteractionError(interaction);
  }
};

export const handleCommandAutocomplete = async (interaction: AutocompleteInteraction, t: TFunction): Promise<void> => {
  if (!isKnownCommandInteraction(interaction)) {
    return;
  }

  const { commandName } = interaction;
  const command = commandMap[commandName];

  try {
    await command.autocomplete?.(interaction, t);
  } catch (e) {
    console.error(`Error while responding to command autocomplete (commandName=${commandName})`, e);
    await handleInteractionError(interaction);
  }
};
