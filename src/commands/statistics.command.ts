import { BotChatInputCommand } from '../types/bot-interaction.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { MessageTimestamp, MessageTimestampFormat } from '../classes/message-timestamp.js';
import { getStatisticsCommandOptions } from '../options/statistics.options.js';
import { EPHEMERAL_OPTION_DEFAULT_VALUE, getBareNumberFormatter, isEphemeralResponse } from '../utils/messaging.js';
import { env } from '../env.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { getSettings } from '../utils/settings.js';

export const statisticsCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.statistics.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.statistics.name', { lng })),
    options: getStatisticsCommandOptions(t),
  }),
  async handle(interaction, context) {
    const settings = await getSettings(context, interaction);
    const ephemeral = isEphemeralResponse(interaction, settings);
    await interaction.deferReply({ ephemeral: ephemeral ?? EPHEMERAL_OPTION_DEFAULT_VALUE });

    const { t } = context;
    const { shard } = interaction.client;
    const uptimeInMilliseconds = Math.round(process.uptime() * 1000);
    const shardStartTs = new MessageTimestamp(new Date(Date.now() - uptimeInMilliseconds));
    const numberFormatter = getBareNumberFormatter(interaction);

    const shardServerCount = shard ? `**${t('commands.statistics.responses.shardServerCount')}** ${numberFormatter.format(interaction.client.guilds.cache.size)}` : null;
    const uptime = `**${t('commands.statistics.responses.uptime')}** ${shardStartTs.toString(MessageTimestampFormat.RELATIVE)}`;
    const shardCount = shard ? `**${t('commands.statistics.responses.shardCount')}** ${numberFormatter.format(shard.count)}` : null;
    const footer = `*${shard ? t('commands.statistics.responses.shardNumber', { replace: { shardId: shard?.ids.join(', ') } }) : t('commands.statistics.responses.noShards')}*`;
    const serverInvite = `**${t('commands.statistics.responses.serverInvite')}** ${env.DISCORD_INVITE_URL}`;

    const content = [
      shardServerCount,
      uptime,
      shardCount,
      '',
      footer,
      // Keep these last to align with the invite embed shown below the message
      '',
      serverInvite,
    ].filter(el => el !== null).join('\n');

    await interaction.editReply({
      content,
    });
  },
};
