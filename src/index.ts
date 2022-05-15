import moment from 'moment-timezone';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createClient } from './utils/client.js';
import {
  cleanGlobalCommands,
  getAuthorizedServers,
  updateGlobalCommands,
  updateGuildCommands,
} from './utils/update-guild-commands.js';
import { initI18next } from './constants/locales.js';
import { env } from './env.js';

// This file is the main entry point which starts the bot

(async () => {
  const tzDataPath = join('.', 'node_modules', 'moment-timezone', 'data', 'packed', 'latest.json');
  console.log(`Loading timezone data from ${tzDataPath}`);
  const data = await fs.readFile(tzDataPath)
    .then((contents) => JSON.parse(contents.toString()));
  moment.tz.load(data);

  console.log('Initializing i18n');
  const t = await initI18next();

  console.log(`Application ${env.LOCAL ? 'is' : 'is NOT'} in local mode`);
  const serverIds = await getAuthorizedServers();
  if (env.LOCAL) {
    await cleanGlobalCommands();
    await Promise.all(serverIds.map((serverId) => updateGuildCommands(serverId, t)));
  } else {
    // Clean guild commands on startup, used only while the app was using guild commands, now it's no longer needed
    // await Promise.all(serverIds.map((serverId) => cleanGuildCommands(serverId)));
    await updateGlobalCommands(t);
  }

  console.log('Creating client');
  await createClient(t);
})();
