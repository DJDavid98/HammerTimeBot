import { MessageTimestamp, MessageTimestampFormat } from '../classes/message-timestamp.js';
import { formattedResponse, supportedFormats } from './time.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { TFunction } from 'i18next';
import { GlobalCommandOptionName, ResponseColumnChoices } from '../types/localization.js';
import { isEphemeralResponse } from './messaging.js';
import { getExactTimePrefix } from './get-exact-time-prefix.js';
import { Moment } from 'moment/moment.js';

export const replyWithSyntax = async (localMoment: Moment, interaction: ChatInputCommandInteraction, t: TFunction, timezone = 'UTC'): Promise<unknown> => {
  const localDate = localMoment.toDate();
  const timeValue = localDate.getTime();
  if (Number.isNaN(timeValue)) {
    await interaction.reply({
      content: t('commands.global.responses.invalidDate'),
      ephemeral: true,
    });
    return;
  }

  const ts = new MessageTimestamp(localDate);
  const columns = interaction.options.getString(GlobalCommandOptionName.COLUMNS) ?? ResponseColumnChoices.BOTH;
  const formatInput = interaction.options.getString(GlobalCommandOptionName.FORMAT);
  const addHeader = interaction.options.getBoolean(GlobalCommandOptionName.HEADER) ?? true;

  const formats = (formatInput ? [formatInput as MessageTimestampFormat] : supportedFormats);
  const header = addHeader && getExactTimePrefix(localMoment, timezone);
  return interaction.reply({
    content: `${header ? `${header}\n` : ''}${formattedResponse(ts, formats, columns as ResponseColumnChoices)}`,
    ephemeral: isEphemeralResponse(interaction),
  });
};
