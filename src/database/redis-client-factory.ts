import Redis from 'ioredis';
import { env } from '../env.js';

export const redisClientFactory = async (): Promise<Redis> => {
  const redis = new Redis(env.REDIS_URL, { lazyConnect: true, keyPrefix: env.REDIS_PREFIX });

  redis.on('connect', () => {
    console.log('[Redis] Connected');
  });
  redis.on('close', () => {
    console.log('[Redis] Disconnected');
  });

  return redis.connect().then(() => redis);
};
