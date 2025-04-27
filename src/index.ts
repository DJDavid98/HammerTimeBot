import { ShardingManager } from 'discord.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { env } from './env.js';

// This file is the main entry point which starts the bot

(async function createShards() {
  const currentFolder = dirname(fileURLToPath(import.meta.url));
  const botScriptPath = `${currentFolder}/bot.js`;

  console.log(`Starting recommended number of shards with path ${botScriptPath}`);
  const manager = new ShardingManager(botScriptPath, { token: env.DISCORD_BOT_TOKEN });

  manager.on('shardCreate', shard => {
    console.log(`Shard ${shard.id} created`);

    shard.on('spawn', () => {
      console.log(`Shard ${shard.id} spawned`);
    });
    shard.on('ready', () => {
      console.log(`Shard ${shard.id} ready`);
    });
    shard.on('disconnect', () => {
      console.log(`Shard ${shard.id} disconnected`);
    });
    shard.on('reconnecting', () => {
      console.log(`Shard ${shard.id} reconnecting`);
    });
    shard.on('death', () => {
      console.log(`Shard ${shard.id} died`);
    });
  });
  await manager.spawn();
})();
