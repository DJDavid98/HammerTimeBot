import { Client, Intents } from 'discord.js';
import { TFunction } from 'i18next';
import { env } from '../env.js';
import { getGitData } from './get-git-data.js';
import { handleCommandInteraction, handleCommandAutocomplete } from './interaction-handlers.js';

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
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

  client.on('ready', handleReady);

  client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
      await handleCommandInteraction(interaction, t);
      return;
    }

    if (interaction.isAutocomplete()) {
      await handleCommandAutocomplete(interaction, t);
      return;
    }

    throw new Error(`Unhandled interaction of type ${interaction.type}`);
  });

  await client.login(env.DISCORD_BOT_TOKEN);
};
