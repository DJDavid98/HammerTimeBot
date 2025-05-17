import { Client, Events, InteractionType } from 'discord.js';
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
import { InteractionContext, InteractionHandlerContext, LoggerContext } from '../types/bot-interaction.js';
import { getProcessStartTs } from './get-process-start-ts.js';
import { apiRequest } from './backend.js';
import typia from 'typia';
import { updateBotTimezonesInApi } from './backend-api-data-updaters.js';

const ONE_HOUR_MS = 60 * 60 * 1e3;

const updateCommands = async (context: InteractionHandlerContext) => {
  const { i18next, ...restContext } = context;
  const logger = context.logger.nest('updateCommands');
  logger.log('Updating commands…');
  const t = i18next.t.bind(i18next);
  const interactionContext: InteractionContext = { ...restContext, t };
  logger.log(`Application ${env.LOCAL ? 'is' : 'is NOT'} in local mode`);
  if (env.LOCAL) {
    const serverIds = await getAuthorizedServers(interactionContext);
    await cleanGlobalCommands(interactionContext);
    await Promise.all(serverIds.map((serverId) => updateGuildCommands(interactionContext, serverId)));
  } else {
    await updateGlobalCommands(interactionContext);
  }
};

const updateShardStats = async (context: LoggerContext, client: Client, shardId: number) => {
  const logger = context.logger.nest('updateShardStats');
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
  logger.debug('Shard statistics collected:', body);
  await apiRequest(context, {
    path: '/shard-statistics',
    method: 'POST',
    body,
    validator: typia.createValidate<Record<string, unknown>>(),
    failOnInvalidResponse: false,
  });
  logger.log('Successfully updated shard statistics');
};

const handleReady = (context: InteractionHandlerContext) => async (client: Client<true>) => {
  const { logger } = context;
  const clientUser = client.user;
  if (!clientUser) throw new Error('Expected `client.user` to be defined');
  logger.log(`Logged in as ${clientUser.tag}!`);

  const versionString = env.LOCAL ? 'a local version' : await getGitData(context)
    .then(({ hash }) => `version ${hash}`)
    .catch(() => 'an unknown version');
  clientUser.setActivity(versionString);

  const shardUtils = client.shard;
  const shardIds = shardUtils?.ids;
  const startupPromises: Promise<void>[] = [];
  if (shardIds && shardIds.includes(0)) {
    startupPromises.push(updateCommands(context));
    startupPromises.push(updateBotTimezonesInApi(context));
  }

  const statsUpdate = async () => {
    const currentShardIds = client.shard?.ids ?? [];
    if (currentShardIds.length === 0) return;

    try {
      await Promise.all(currentShardIds.map(async (shardId) => {
        await updateShardStats(context, client, shardId);
      }));
    } catch (e) {
      logger.error('Failed to update shard statistics:', e);
    }
  };
  startupPromises.push(statsUpdate());

  // Wait for startup actions
  await Promise.all(startupPromises);

  // Set up scheduled calls
  setInterval(() => {
    void statsUpdate();
  }, ONE_HOUR_MS);
};

export const createClient = async (context: InteractionHandlerContext): Promise<void> => {
  const client = new Client({ intents: [] });

  client.on(Events.ClientReady, handleReady(context));

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
