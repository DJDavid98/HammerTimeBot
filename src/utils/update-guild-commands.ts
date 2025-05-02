import type { APIApplicationCommand, APIApplicationCommandOption } from 'discord-api-types/v10';
import {
  RESTGetAPICurrentUserGuildsResult,
  RESTPutAPIApplicationCommandsResult,
  RESTPutAPIApplicationGuildCommandsResult,
  Routes,
} from 'discord-api-types/v10';
import { Snowflake } from 'discord-api-types/globals';
import { TFunction } from 'i18next';
import { env } from '../env.js';
import { BotCommandItem, BotCommands, getApplicationCommands } from './get-application-commands.js';
import { rest } from './rest.js';
import { apiRequest } from './backend.js';
import typia from 'typia';


type MinimalAPIApplicationCommand =
  Pick<APIApplicationCommand, 'id' | 'name' | 'name_localizations' | 'description' | 'description_localizations' | 'type'>
  & {
    options?: Array<Pick<APIApplicationCommandOption, 'name' | 'name_localizations' | 'description' | 'description_localizations' | 'type' | 'required'>>
  };

const augmentResultWithOptions = <T extends MinimalAPIApplicationCommand[] | undefined>(input: BotCommands | undefined, result: T): T => {
  const indexedOptions = input?.reduce((acc, command) => ({
    ...acc,
    [command.name]: command.options,
  }), {} as Record<string, BotCommandItem['options']>);
  return result?.map(command => {
    if (indexedOptions?.[command.name]) {
      return {
        ...command,
        options: indexedOptions[command.name],
      };
    }
    return command;
  }) as T;
};

export const updateBotCommandsInApi = async (input: BotCommands | undefined, result: MinimalAPIApplicationCommand[] | undefined): Promise<void> => {
  if (!result) return;

  console.log('Sending bot commands to the API…');
  const resultWithOptions = augmentResultWithOptions(input, result);
  try {
    await apiRequest({
      path: '/bot-commands',
      method: 'PUT',
      validator: typia.createValidate<unknown[]>(),
      body: resultWithOptions,
    });

    console.log('Successfully sent bot commands to the API');
  } catch (error) {
    console.log('Failed to send bot commands to the API');
    console.warn(error);
  }
};

export const getAuthorizedServers = async (): Promise<string[]> => {
  console.log('Getting authorized servers…');
  const guilds = await rest.get(
    Routes.userGuilds(),
  ) as RESTGetAPICurrentUserGuildsResult;
  console.log(`Found ${guilds.length} authorized server${guilds.length === 1 ? '' : 's'}`);
  return guilds.map((guild) => guild.id);
};

export const updateGuildCommands = async (guildId: Snowflake, t: TFunction): Promise<void> => {
  const guildIdString = `guildId:${guildId}`;
  let result: RESTPutAPIApplicationGuildCommandsResult | undefined;
  let body: BotCommands | undefined;
  try {
    console.log(`Started reloading guild (/) commands (${guildIdString})`);

    body = getApplicationCommands(t);
    result = await rest.put(
      Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, guildId),
      { body },
    ) as RESTPutAPIApplicationGuildCommandsResult;

    console.log(`Successfully reloaded guild (/) commands (${guildIdString})`);
  } catch (error) {
    console.log(`Failed to reload guild (/) commands (${guildIdString})`);
    console.error(error);
    process.exit(1);
  }

  await updateBotCommandsInApi(body, result);
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
  let result: RESTPutAPIApplicationCommandsResult | undefined;
  let body: BotCommands | undefined;
  try {
    console.log('Started refreshing application (/) commands');

    body = getApplicationCommands(t);
    result = await rest.put(
      Routes.applicationCommands(env.DISCORD_CLIENT_ID),
      { body },
    ) as RESTPutAPIApplicationCommandsResult;

    console.log('Successfully reloaded application (/) commands');
  } catch (error) {
    console.log('Failed to reload application (/) commands');
    console.error(error);
    process.exit(1);
  }

  await updateBotCommandsInApi(body, result);
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
