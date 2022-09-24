import { BotCommand } from '../types/bot-interaction.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { MessageTimestamp, MessageTimestampFormat } from '../utils/message-timestamp.js';
import { getStatisticsCommandOptions } from '../options/statistics.options.js';
import { getTotalServerCount } from '../utils/get-total-server-count.js';
import { isEphemeralResponse } from '../utils/messaging.js';
import { env } from '../env.js';

export const statisticsCommand: BotCommand = {
  getDefinition: (t) => ({
    ...getLocalizedObject('description', (lng) => t('commands.statistics.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.statistics.name', { lng })),
    options: getStatisticsCommandOptions(t),
  }),
  async handle(interaction, t) {
    const { shard } = interaction.client;
    const uptimeInMilliseconds = Math.round(process.uptime() * 1000);
    const shardStartTs = new MessageTimestamp(new Date(Date.now() - uptimeInMilliseconds));

    const totalServerCount = `**${t('commands.statistics.responses.totalServerCount')}** ${await getTotalServerCount(interaction.client)}`;
    const shardServerCount = shard ? `**${t('commands.statistics.responses.shardServerCount')}** ${interaction.client.guilds.cache.size}` : null;
    const uptime = `**${t('commands.statistics.responses.uptime')}** ${shardStartTs.toString(MessageTimestampFormat.RELATIVE)}`;
    const shardCount = shard ? `**${t('commands.statistics.responses.shardCount')}** ${shard.count}` : null;
    const footer = `*${shard ? t('commands.statistics.responses.shardNumber', { replace: { shardId: shard?.ids.join(', ') } }) : t('commands.statistics.responses.noShards')}*`;
    const serverInvite = `**${t('commands.statistics.responses.serverInvite')}** ${env.DISCORD_INVITE_URL}`;

    const content = [
      totalServerCount,
      shardServerCount,
      uptime,
      shardCount,
      '',
      footer,
      // Keep these last to align with the invite embed shown below the message
      '',
      serverInvite,
    ].filter(el => el !== null).join('\n');

    await interaction.reply({
      content,
      ephemeral: isEphemeralResponse(interaction),
    });
  },
};
