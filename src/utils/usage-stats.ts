import { Client, GuildManager } from 'discord.js';

/**
 * Returns the total number of servers the bot is in
 * @see https://discordjs.guide/sharding/#fetchclientvalues
 */
export const getTotalServerCount = async (client: Client): Promise<number> => {
  if (!client.shard) {
    return client.guilds.cache.size;
  }
  const shardGuildCounts = (await client.shard.fetchClientValues('guilds.cache.size')) as number[];
  return shardGuildCounts.reduce((acc, guildCount) => acc + guildCount, 0);
};

/**
 * Returns the total number of users (aggregate user count of each joined guild)
 * @see https://stackoverflow.com/a/71001010/1344955
 */
export const getTotalUserCount = async (client: Client): Promise<number> => {
  if (!client.shard) {
    return client.guilds.cache.size;
  }
  const shardGuilds = (await client.shard.fetchClientValues('guilds.cache')) as GuildManager['cache'][];
  /* eslint-disable @typescript-eslint/no-non-null-assertion -- TypeScript is drunk and thinks acc can be null */
  return shardGuilds.reduce((acc, guild) => {
    return acc + guild.reduce((guildMemberCount, cachedGuild) => guildMemberCount + cachedGuild.memberCount, 0);
  }, 0);
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
};
