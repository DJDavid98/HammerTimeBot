import { RESTGetAPICurrentUserGuildsResult, Routes } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import { Snowflake } from 'discord-api-types/globals';
import { TFunction } from 'i18next';
import { env } from '../env.js';
import { getApplicationCommands } from './get-application-commands.js';

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

export const updateGuildCommands = async (guildId: Snowflake, t: TFunction): Promise<void> => {
  const guildIdString = `guildId:${guildId}`;
  try {
    console.log(`Started reloading guild (/) commands (${guildIdString})`);

    await rest.put(
      Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, guildId),
      { body: getApplicationCommands(t) },
    );

    console.log(`Successfully reloaded guild (/) commands (${guildIdString})`);
  } catch (error) {
    console.log(`Failed to reload guild (/) commands (${guildIdString})`);
    console.error(error);
    process.exit(1);
  }
};

export const cleanGuildCommands = async (guildId: Snowflake): Promise<void> => {
  const guildIdString = `guildId:${guildId}`;
  try {
    console.log(`Started cleaning guild (/) commands (${guildIdString})`);

    await rest.put(
      Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, guildId),
      { body: [] },
    );

    console.log(`Successfully cleaned guild (/) commands (${guildIdString})`);
  } catch (error) {
    console.log(`Failed to clean guild (/) commands (${guildIdString})`);
    console.error(error);
    process.exit(1);
  }
};

export const updateGlobalCommands = async (t: TFunction): Promise<void> => {
  try {
    console.log('Started refreshing application (/) commands');

    await rest.put(
      Routes.applicationCommands(env.DISCORD_CLIENT_ID),
      { body: getApplicationCommands(t) },
    );

    console.log('Successfully reloaded application (/) commands');
  } catch (error) {
    console.log('Failed to reload application (/) commands');
    console.error(error);
    process.exit(1);
  }
};

export const cleanGlobalCommands = async (): Promise<void> => {
  try {
    console.log('Started cleaning application (/) commands');

    await rest.put(
      Routes.applicationCommands(env.DISCORD_CLIENT_ID),
      { body: [] },
    );

    console.log('Successfully cleaned application (/) commands');
  } catch (error) {
    console.log('Failed to clean application (/) commands');
    console.error(error);
    process.exit(1);
  }
};
