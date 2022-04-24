import { config } from 'dotenv';

config();

const {
  DISCORD_BOT_TOKEN,
  DISCORD_CLIENT_ID,
  LOCAL,
  UA_STRING,
} = process.env;

/**
 * Type-safe process.env
 */
export const env = (() => {
  const values = {
    DISCORD_BOT_TOKEN,
    DISCORD_CLIENT_ID,
    LOCAL: typeof LOCAL !== 'undefined' && LOCAL === 'true',
    UA_STRING,
  };

  type Values = typeof values;

  Object.keys(values)
    .forEach((key) => {
      if (typeof values[key as keyof Values] !== 'undefined') return;

      throw new Error(`${key} environment variable not set`);
    });

  return values as { [Key in keyof Values]: Exclude<Values[Key], undefined> };
})();
