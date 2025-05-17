import { createClient } from './utils/client.js';
import { initI18next } from './constants/locales.js';
import { getApplicationEmojis } from './utils/get-application-emojis.js';
import { Logger } from './classes/logger.js';

(async () => {
  const logger = Logger.fromShardInfo(process.env.SHARDS);
  const [i18next, emojiIdMap] = await Promise.all([
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
