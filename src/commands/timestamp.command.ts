import { BotChatInputCommand, BotChatInputCommandName } from '../types/bot-interaction.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { env } from '../env.js';
import { ApplicationCommandType } from 'discord-api-types/v10';

const baseCommandName = BotChatInputCommandName.TIMESTAMP;
const exampleCommands = [
  BotChatInputCommandName.ADD,
  BotChatInputCommandName.AGO,
  BotChatInputCommandName.AT,
  BotChatInputCommandName.IN,
  BotChatInputCommandName.SUBTRACT,
  BotChatInputCommandName.UNIX,
];

export const timestampCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.timestamp.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.timestamp.name', { lng })),
  }),
  async handle(interaction, t) {
    const exampleCommandName = exampleCommands[Math.floor(exampleCommands.length * Math.random())];

    await interaction.reply({
      content: t('commands.timestamp.responses.deprecated', {
        replace: {
          baseCommandName: `\`${baseCommandName}\``,
          baseCommand: `\`/${baseCommandName}\``,
          exampleSubCommand: `\`/${baseCommandName} ${exampleCommandName}\``,
          exampleCommand: `\`/${exampleCommandName}\``,
          discordInviteUrl: env.DISCORD_INVITE_URL,
        },
      }),
      ephemeral: true,
    });
  },
};
