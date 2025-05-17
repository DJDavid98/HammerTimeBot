import type { APIApplicationCommand, APIApplicationCommandOption } from 'discord-api-types/v10';
import {
  RESTGetAPICurrentUserGuildsResult,
  RESTPutAPIApplicationCommandsResult,
  RESTPutAPIApplicationGuildCommandsResult,
  Routes,
} from 'discord-api-types/v10';
import { Snowflake } from 'discord-api-types/globals';
import { env } from '../env.js';
import { BotCommandItem, BotCommands, getApplicationCommands } from './get-application-commands.js';
import { rest } from './rest.js';
import { apiRequest } from './backend.js';
import typia from 'typia';
import { InteractionContext, LoggerContext } from '../types/bot-interaction.js';


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

export const updateBotCommandsInApi = async (context: InteractionContext, input: BotCommands | undefined, result: MinimalAPIApplicationCommand[] | undefined): Promise<void> => {
  if (!result) return;

  const { logger } = context;
  logger.log('Sending bot commands to the API…');
  const resultWithOptions = augmentResultWithOptions(input, result);
  try {
    await apiRequest(context, {
      path: '/bot-commands',
      method: 'PUT',
      validator: typia.createValidate<unknown[]>(),
      body: resultWithOptions,
    });

    logger.log('Successfully sent bot commands to the API');
  } catch (error) {
    logger.warn('Failed to send bot commands to the API', error);
  }
};

export const getAuthorizedServers = async ({ logger }: InteractionContext): Promise<string[]> => {
  logger.log('Getting authorized servers…');
  const guilds = await rest.get(
    Routes.userGuilds(),
  ) as RESTGetAPICurrentUserGuildsResult;
  logger.log(`Found ${guilds.length} authorized server${guilds.length === 1 ? '' : 's'}`);
  return guilds.map((guild) => guild.id);
};

export const updateGuildCommands = async (context: InteractionContext, guildId: Snowflake): Promise<void> => {
  const { t } = context;
  const logger = context.logger.nest(['updateGuildCommands', `Guild#${guildId}`]);
  let result: RESTPutAPIApplicationGuildCommandsResult | undefined;
  let body: BotCommands | undefined;
  try {
    logger.log('Started reloading guild commands');

    body = getApplicationCommands(t);
    result = await rest.put(
      Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, guildId),
      { body },
    ) as RESTPutAPIApplicationGuildCommandsResult;

    logger.log('Successfully reloaded guild commands');
  } catch (error) {
    logger.error('Failed to reload guild commands', error);
    process.exit(1);
  }

  await updateBotCommandsInApi(context, body, result);
};

export const cleanGuildCommands = async (context: LoggerContext, guildId: Snowflake): Promise<void> => {
  const logger = context.logger.nest(['cleanGuildCommands', `Guild#${guildId}`]);
  try {
    logger.log('Started cleaning guild commands');

    await rest.put(
      Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, guildId),
      { body: [] },
    );

    logger.log('Successfully cleaned guild commands');
  } catch (error) {
    logger.error('Failed to clean guild commands', error);
    process.exit(1);
  }
};

export const updateGlobalCommands = async (context: InteractionContext): Promise<void> => {
  const { t } = context;
  const logger = context.logger.nest('updateGlobalCommands');
  let result: RESTPutAPIApplicationCommandsResult | undefined;
  let body: BotCommands | undefined;
  try {
    logger.log('Started refreshing application commands');

    body = getApplicationCommands(t);
    result = await rest.put(
      Routes.applicationCommands(env.DISCORD_CLIENT_ID),
      { body },
    ) as RESTPutAPIApplicationCommandsResult;

    logger.log('Successfully reloaded application commands');
  } catch (error) {
    logger.error('Failed to reload application commands', error);
    process.exit(1);
  }

  await updateBotCommandsInApi(context, body, result);
};

export const cleanGlobalCommands = async (context: InteractionContext): Promise<void> => {
  const logger = context.logger.nest('cleanGlobalCommands');
  try {
    logger.log('Started cleaning application commands');

    await rest.put(
      Routes.applicationCommands(env.DISCORD_CLIENT_ID),
      { body: [] },
    );

    logger.log('Successfully cleaned application commands');
  } catch (error) {
    logger.error('Failed to clean application commands', error);
    process.exit(1);
  }
};
