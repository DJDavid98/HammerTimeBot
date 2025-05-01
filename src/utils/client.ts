import { Client, Events, InteractionType } from 'discord.js';
import { i18n } from 'i18next';
import { env } from '../env.js';
import { getGitData } from './get-git-data.js';
import {
  handleCommandAutocomplete,
  handleCommandInteraction,
  handleComponentInteraction,
} from './interaction-handlers.js';
import {
  cleanGlobalCommands,
  getAuthorizedServers,
  updateGlobalCommands,
  updateGuildCommands,
} from './update-guild-commands.js';
import { InteractionHandlerContext } from '../types/bot-interaction.js';
import { getProcessStartTs } from './get-process-start-ts.js';
import { apiRequest } from './backend.js';
import typia from 'typia';

const ONE_HOUR_MS = 60 * 60 * 1e3;

const updateCommands = async (i18next: i18n) => {
  const t = i18next.t.bind(i18next);
  console.log(`Application ${env.LOCAL ? 'is' : 'is NOT'} in local mode`);
  if (env.LOCAL) {
    const serverIds = await getAuthorizedServers();
    await cleanGlobalCommands();
    await Promise.all(serverIds.map((serverId) => updateGuildCommands(serverId, t)));
  } else {
    await updateGlobalCommands(t);
  }
};

const updateShardStats = async (client: Client, shardId: number) => {
  const serverCount = client.guilds.cache.size;
  const memberCount = client.guilds.cache.reduce((members, guild) => {
    if (members === null) return null;
    const count = guild.approximateMemberCount ?? guild.memberCount;
    return typeof count === 'number' && !isNaN(count) ? members + count : null;
  }, 0 as number | null);
  const startedAt = getProcessStartTs().toISOString();

  const body = {
    id: shardId,
    server_count: serverCount,
    member_count: memberCount,
    started_at: startedAt,
  };
  console.debug(`Shard ${shardId} statistics collected:`, body);
  await apiRequest({
    path: '/shard-statistics',
    method: 'POST',
    body,
    validator: typia.createValidate<Record<string, unknown>>(),
    failOnInvalidResponse: false,
  });
  console.log(`Successfully updated shard ${shardId} statistics`);
};

const handleReady = (i18next: i18n) => async (client: Client<true>) => {
  const clientUser = client.user;
  if (!clientUser) throw new Error('Expected `client.user` to be defined');
  console.log(`Logged in as ${clientUser.tag}!`);

  const versionString = env.LOCAL ? 'a local version' : await getGitData()
    .then(({ hash }) => `version ${hash}`)
    .catch(() => 'an unknown version');
  clientUser.setActivity(versionString);

  const shardUtils = client.shard;
  const shardIds = shardUtils?.ids;
  if (shardIds) {
    console.log(`Hello from shard ${shardIds.join(', ')}!`);

    if (shardIds.includes(0)) {
      console.log('Shard 0 is updating commands');
      await updateCommands(i18next);
    }
  }

  const statsUpdate = async () => {
    const currentShardIds = client.shard?.ids ?? [];
    if (currentShardIds.length === 0) return;

    try {
      await Promise.all(currentShardIds.map(async (shardId) => {
        console.log(`Shard ${shardId} is updating statistics`);
        await updateShardStats(client, shardId);
      }));
    } catch (e) {
      console.error('Failed to update shard statistics:');
      console.error(e);
    }
  };
  await statsUpdate();
  setInterval(() => {
    void statsUpdate();
  }, ONE_HOUR_MS);
};

export const createClient = async (context: InteractionHandlerContext): Promise<void> => {
  const client = new Client({ intents: [] });

  client.on(Events.ClientReady, handleReady(context.i18next));

  client.on(Events.InteractionCreate, async (interaction) => {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        await handleCommandInteraction(interaction, context);
        return;
      case InteractionType.ApplicationCommandAutocomplete:
        await handleCommandAutocomplete(interaction, context);
        return;
      case InteractionType.MessageComponent:
        await handleComponentInteraction(interaction, context);
        return;
      default:
        throw new Error(`Unhandled interaction of type ${interaction.type}`);
    }

  });

  await client.login();
};
