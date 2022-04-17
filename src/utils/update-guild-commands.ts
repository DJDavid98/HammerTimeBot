import { RESTGetAPICurrentUserGuildsResult, Routes } from 'discord-api-types/rest/v10';
import { REST } from '@discordjs/rest';
import { Snowflake } from 'discord-api-types/globals';
import { commands } from '../commands.js';
import { env } from '../env.js';

const rest = new REST({
  version: '10',
  userAgentAppendix: env.UA_STRING,
}).setToken(env.DISCORD_BOT_TOKEN);

export const getAuthorizedServers = async (): Promise<string[]> => {
  const guilds = await rest.get(
    Routes.userGuilds(),
  ) as RESTGetAPICurrentUserGuildsResult;
  return guilds.map((guild) => guild.id);
};

export const updateGuildCommands = async (serverId: Snowflake, clientId: Snowflake = env.DISCORD_CLIENT_ID): Promise<void> => {
  try {
    console.log(`Started refreshing application (/) commands (SERVER_ID=${serverId})`);

    await rest.put(
      Routes.applicationGuildCommands(clientId, serverId),
      { body: commands },
    );

    console.log(`Successfully reloaded application (/) commands (SERVER_ID=${serverId})`);
  } catch (error) {
    console.log(`Failed to reloaded application (/) commands (SERVER_ID=${serverId})`);
    console.error(error);
    process.exit(1);
  }
};
