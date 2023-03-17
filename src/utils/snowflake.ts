const DISCORD_EPOCH = 1420070400000;

/**
 * Converts a snowflake to a unix timestamp
 * @param snowflake The snowflake to convert
 * @returns A number with the unix timestamp
 * @throws {Error} If the snowflake is invalid
 */
export default function snowflakeToUnix(snowflake: string) {
  let snowflakeNumber;
  try {
    snowflakeNumber = BigInt(snowflake);
  } catch (e) {
    throw new Error('Invalid snowflake. Snowflakes must be a valid number.');
  }

  if (snowflakeNumber < 4194304) {
    throw new Error('Invalid snowflake. Snowflakes must be greater than 4194303.');
  }



  return (Number(BigInt(snowflake) >> 22n) + DISCORD_EPOCH) / 1000;
}