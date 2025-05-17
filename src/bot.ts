import moment from 'moment-timezone';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createClient } from './utils/client.js';
import { initI18next } from './constants/locales.js';
import { getApplicationEmojis } from './utils/get-application-emojis.js';
import { Logger } from './classes/logger.js';

(async () => {
  const logger = Logger.fromShardInfo(process.env.SHARDS);
  const [, i18next, emojiIdMap] = await Promise.all([
    (async () => {
      const tzDataPath = join('.', 'node_modules', 'moment-timezone', 'data', 'packed', 'latest.json');
      logger.log(`Loading timezone data from ${tzDataPath}`);
      const data = await fs.readFile(tzDataPath).then((contents) => JSON.parse(contents.toString()));
      moment.tz.load(data);
    })(),
    (async () => {
      logger.log('Initializing i18n');
      return initI18next();
    })(),
    (async () => {
      logger.log('Getting application emoji data');
      return getApplicationEmojis({ logger });
    })(),
  ]);

  logger.log('Creating client');
  await createClient({ i18next, emojiIdMap, logger });
})();
