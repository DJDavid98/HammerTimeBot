import { MessageTimestamp, MessageTimestampFormat } from '../classes/message-timestamp.js';
import { formattedResponse, supportedFormats } from './time.js';
import { ChatInputCommandInteraction, ContextMenuCommandInteraction, InteractionReplyOptions } from 'discord.js';
import { TFunction } from 'i18next';
import { GlobalCommandOptionName, ResponseColumnChoices } from '../types/localization.js';
import { EPHEMERAL_OPTION_DEFAULT_VALUE, isEphemeralResponse } from './messaging.js';
import { getExactTimePrefix } from './get-exact-time-prefix.js';
import { SettingsValue } from './settings.js';
import { Moment } from 'moment';

type HandledInteractions = ChatInputCommandInteraction | ContextMenuCommandInteraction;

export const mapCommandInteractionToSyntaxInteraction = (interaction: HandledInteractions, settings: Pick<SettingsValue, 'ephemeral' | 'columns' | 'format' | 'header'>): SyntaxInteraction => {
  if (interaction.isContextMenuCommand()) {
    return {
      columns: null,
      format: null,
      header: null,
      ephemeral: true,
    };
  }

  return ({
    columns: interaction.options.getString(GlobalCommandOptionName.COLUMNS) ?? settings.columns ?? ResponseColumnChoices.BOTH,
    format: interaction.options.getString(GlobalCommandOptionName.FORMAT) ?? settings.format,
    header: interaction.options.getBoolean(GlobalCommandOptionName.HEADER) ?? settings.header ?? true,
    ephemeral: isEphemeralResponse(interaction, settings),
  });
};

export interface SyntaxInteraction {
  columns: string | null;
  format: string | null;
  header: boolean | null;
  ephemeral: boolean | null;
}

interface SyntaxReplyOptions {
  localMoment: Moment;
  interaction: HandledInteractions;
  t: TFunction;
  timezone?: string;
  settings: Pick<SettingsValue, 'ephemeral' | 'columns' | 'format' | 'header' | 'boldPreview'>;
}

export const getSyntaxReplyOptions = ({
  localMoment,
  interaction,
  t,
  timezone = 'UTC',
  settings,
}: SyntaxReplyOptions): InteractionReplyOptions => {
  const localDate = localMoment.toDate();
  if (!localMoment.isValid()) {
    return {
      content: t('commands.global.responses.invalidDate'),
      ephemeral: true,
    };
  }

  const syntaxInteraction = mapCommandInteractionToSyntaxInteraction(interaction, settings);

  const ts = new MessageTimestamp(localDate);
  const columns = syntaxInteraction.columns ?? ResponseColumnChoices.BOTH;
  const formatInput = syntaxInteraction.format;
  const addHeader = syntaxInteraction.header ?? true;

  const formats = (formatInput ? [formatInput as MessageTimestampFormat] : supportedFormats);
  const header = addHeader && getExactTimePrefix(localMoment, timezone);
  const table = formattedResponse(ts, formats, columns as ResponseColumnChoices, settings.boldPreview);
  const content = `${header ? `${header}\n` : ''}${table}`;
  return {
    content: content,
    ephemeral: syntaxInteraction.ephemeral ?? EPHEMERAL_OPTION_DEFAULT_VALUE,
  };
};

interface ReplyWithSyntaxParams {
  localMoment: Moment;
  interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction;
  t: TFunction;
  timezone: string | undefined;
  settings: Pick<SettingsValue, 'ephemeral' | 'columns' | 'format' | 'header' | 'boldPreview'>;
}

export const replyWithSyntax = async ({
  localMoment,
  interaction,
  t,
  timezone = 'UTC',
  settings,
}: ReplyWithSyntaxParams): Promise<unknown> => {
  return interaction.reply(getSyntaxReplyOptions({
    localMoment,
    interaction,
    t,
    timezone,
    settings,
  }));
};
