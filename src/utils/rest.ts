import { REST } from '@discordjs/rest';
import { env } from '../env.js';

export const rest = new REST({
  version: '10',
  userAgentAppendix: env.UA_STRING,
}).setToken(env.DISCORD_BOT_TOKEN);
