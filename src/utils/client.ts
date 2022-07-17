import { Client, InteractionType } from 'discord.js';
import { TFunction } from 'i18next';
import { env } from '../env.js';
import { getGitData } from './get-git-data.js';
import { handleCommandAutocomplete, handleCommandInteraction } from './interaction-handlers.js';
import { GatewayIntentBits } from 'discord-api-types/v10';

const handleReady = async (client: Client<true>) => {
  const clientUser = client.user;
  if (!clientUser) throw new Error('Expected `client.user` to be defined');
  console.log(`Logged in as ${clientUser.tag}!`);

  const versionString = env.LOCAL ? 'a local version' : await getGitData()
    .then(({ hash }) => `version ${hash}`)
    .catch(() => 'an unknown version');
  clientUser.setActivity(versionString);
};

export const createClient = async (t: TFunction): Promise<void> => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.on('ready', handleReady);

  client.on('interactionCreate', async (interaction) => {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        await handleCommandInteraction(interaction, t);
        return;
      case InteractionType.ApplicationCommandAutocomplete:
        await handleCommandAutocomplete(interaction, t);
        return;
      default:
        throw new Error(`Unhandled interaction of type ${interaction.type}`);
    }

  });

  await client.login(env.DISCORD_BOT_TOKEN);
};
