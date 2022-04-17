import moment from 'moment-timezone';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createClient } from './create-client.js';
import { getAuthorizedServers, updateGuildCommands } from './utils/update-guild-commands.js';

// This file is the main entry point which starts the bot

(async () => {
  const data = await fs.readFile(join('.', 'node_modules', 'moment-timezone', 'data', 'packed', 'latest.json'))
    .then((contents) => JSON.parse(contents.toString()));
  moment.tz.load(data);

  const serverIds = await getAuthorizedServers();
  await Promise.all(serverIds.map((serverId) => updateGuildCommands(serverId)));

  await createClient();
})();
