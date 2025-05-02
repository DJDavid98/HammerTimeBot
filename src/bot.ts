import moment from 'moment-timezone';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createClient } from './utils/client.js';
import { initI18next } from './constants/locales.js';
import { getApplicationEmojis } from './utils/get-application-emojis.js';

(async () => {
  const [, i18next, emojiIdMap] = await Promise.all([
    (async () => {
      const tzDataPath = join('.', 'node_modules', 'moment-timezone', 'data', 'packed', 'latest.json');
      console.log(`Loading timezone data from ${tzDataPath}`);
      const data = await fs.readFile(tzDataPath).then((contents) => JSON.parse(contents.toString()));
      moment.tz.load(data);
    })(),
    (async () => {
      console.log('Initializing i18n');
      return initI18next();
    })(),
    (async () => {
      console.log('Getting application emoji data');
      return getApplicationEmojis();
    })(),
  ]);

  console.log('Creating client');
  await createClient({ i18next, emojiIdMap });
})();
