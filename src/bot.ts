import moment from 'moment-timezone';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createClient } from './utils/client.js';
import { initI18next } from './constants/locales.js';

(async () => {
  const tzDataPath = join('.', 'node_modules', 'moment-timezone', 'data', 'packed', 'latest.json');
  console.log(`Loading timezone data from ${tzDataPath}`);
  const data = await fs.readFile(tzDataPath)
    .then((contents) => JSON.parse(contents.toString()));
  moment.tz.load(data);

  console.log('Initializing i18n');
  const t = await initI18next();

  console.log('Creating client');
  await createClient(t);
})();
