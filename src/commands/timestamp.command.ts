import { BotCommand, BotCommandName } from '../types/bot-interaction.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { env } from '../env.js';

const baseCommandName = BotCommandName.TIMESTAMP;
const exampleCommands = [
  BotCommandName.ADD,
  BotCommandName.AGO,
  BotCommandName.AT,
  BotCommandName.IN,
  BotCommandName.SUBTRACT,
  BotCommandName.UNIX,
];

export const timestampCommand: BotCommand = {
  getDefinition: (t) => ({
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
