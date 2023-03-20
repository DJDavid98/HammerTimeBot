const DISCORD_EPOCH = 1420070400000;

/**
 * Converts a snowflake to a unix timestamp
 * @param snowflake The snowflake to convert
 * @returns A number with the unix timestamp
 * @throws {Error} If the snowflake is invalid
 */
export default function snowflakeToUnix(snowflake: string) {
  const snowflakeNumber = Number(snowflake);
  
  if (isNaN(snowflakeNumber) || snowflake.length === 0) {
    throw new Error('Invalid snowflake. Snowflakes must be a valid number.');
  }

  if (snowflakeNumber < 4194304) {
    throw new Error('Invalid snowflake. Snowflakes must be greater than 4194303.');
  }

  return Math.floor(((Number(BigInt(snowflakeNumber) >> 22n)) + DISCORD_EPOCH) / 1000);
}