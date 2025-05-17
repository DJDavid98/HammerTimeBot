import { InteractionContext, LoggerContext } from '../types/bot-interaction.js';
import { BotCommandItem, BotCommands } from './get-application-commands.js';
import { apiRequest } from './backend.js';
import typia from 'typia';
import type { APIApplicationCommand, APIApplicationCommandOption } from 'discord-api-types/v10';


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

export const updateBotCommandsInApi = async (parentContext: InteractionContext, input: BotCommands | undefined, result: MinimalAPIApplicationCommand[] | undefined): Promise<void> => {
  if (!result) return;

  const logger = parentContext.logger.nest('updateBotCommandsInApi');
  const context = { ...parentContext, logger };
  logger.log('Updating…');
  const resultWithOptions = augmentResultWithOptions(input, result);
  try {
    await apiRequest(context, {
      path: '/bot-commands',
      method: 'PUT',
      validator: typia.createValidate<unknown[]>(),
      body: resultWithOptions,
    });

    logger.log('Successful');
  } catch (error) {
    logger.warn('Failed', error);
  }
};

export const updateBotTimezonesInApi = async (parentContext: LoggerContext): Promise<void> => {
  const logger = parentContext.logger.nest('updateBotTimezonesInApi');
  const context = { ...parentContext, logger };
  logger.log('Updating…');
  try {
    await apiRequest(context, {
      path: '/bot-timezones',
      method: 'PUT',
      validator: typia.createValidate<unknown>(),
      body: { timezones: Intl.supportedValuesOf('timeZone') },
    });

    logger.log('Successful');
  } catch (error) {
    logger.warn('Failed', error);
  }
};
