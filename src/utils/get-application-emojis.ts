import { rest } from './rest.js';
import { RESTGetAPIApplicationEmojisResult, Routes } from 'discord-api-types/v10';
import { env } from '../env.js';

export const getApplicationEmojis = async (): Promise<Record<string, string>> => {
  console.log('Getting application emoji…');
  const emojiResponse = await rest.get(
    Routes.applicationEmojis(env.DISCORD_CLIENT_ID),
  ) as RESTGetAPIApplicationEmojisResult;
  console.log(`Found ${emojiResponse.items.length} application emoji${emojiResponse.items.length === 1 ? '' : 's'}`);
  return emojiResponse.items.reduce((acc, { name, id }) => name && id ? { ...acc, [name]: id } : acc, {} as Record<string, string>);
};
