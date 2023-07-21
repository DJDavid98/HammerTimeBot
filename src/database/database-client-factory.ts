import pg, { Client } from 'pg';
import { env } from '../env.js';

export const databaseClientFactory = async (): Promise<Client> => new Promise((res, rej) => {
  const db = new pg.Client(env.DATABASE_URL);

  db.connect(err => {
    if (err !== null) {
      console.error('[Database] Connection failed');
      console.error(err);
      rej();
      return;
    }

    console.info('[Database] Connection successful');
    res(db);
  });

  db.on('error', err => {
    const fatal = 'fatal' in err;
    console.error(`[Database] Error (fatal:${fatal})`);
    console.error(err);
    if (fatal) process.exit();
  });

  process.on('exit', () => {
    console.info('[Database] Process exiting, closing connection…');
    db
      .end()
      .then(() => console.info('[Database] Disconnected'))
      .catch((error) => {
        console.error('[Database] error during disconnection');
        console.error(error);
      });
  });
});
