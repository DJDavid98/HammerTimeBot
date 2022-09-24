import { Client } from 'discord.js';

/**
 * Returns the total number of servers the bot is in
 * @see https://discordjs.guide/sharding/#fetchclientvalues
 */
export const getTotalServerCount = async (client: Client) => {
  if (!client.shard) {
    return client.guilds.cache.size;
  }
  const shardGuilds = (await client.shard.fetchClientValues('guilds.cache.size')) as number[];
  return shardGuilds.reduce((acc, guildCount) => acc + guildCount, 0);
};
