import { MessageTimestamp } from '../classes/message-timestamp.js';
import { formattedResponse, supportedFormats } from './time.js';
import {
  ChatInputCommandInteraction,
  ComponentType,
  ContextMenuCommandInteraction,
  InteractionReplyOptions,
  MessageFlags,
  SeparatorSpacingSize,
} from 'discord.js';
import { GlobalCommandOptionName, ResponseColumnChoices } from '../types/localization.js';
import { EPHEMERAL_OPTION_DEFAULT_VALUE, isEphemeralResponse } from './messaging.js';
import { getExactTimePrefix } from './get-exact-time-prefix.js';
import { SettingsValue } from './settings.js';
import { formatSelectComponent } from '../components/format-select.component.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';
import { InteractionContext } from '../types/bot-interaction.js';
import { addIncompleteTranslationsFooter } from './interaction-reply.js';
import { TZDate } from '@date-fns/tz';
import { isValid } from 'date-fns';

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
  localDate: TZDate;
  interaction: HandledInteractions;
  context: InteractionContext;
  timezone?: string;
  settings: Pick<SettingsValue, 'ephemeral' | 'columns' | 'format' | 'header' | 'boldPreview' | 'formatMinimalReply'>;
}

export const getSyntaxReplyOptions = ({
  localDate,
  interaction,
  context: { t, emojiIdMap },
  timezone = 'UTC',
  settings,
}: SyntaxReplyOptions): InteractionReplyOptions => {
  if (!isValid(localDate)) {
    return {
      content: t('commands.global.responses.invalidDate'),
      flags: MessageFlags.Ephemeral,
    };
  }

  const syntaxInteraction = mapCommandInteractionToSyntaxInteraction(interaction, settings);

  const ts = new MessageTimestamp(localDate);
  const formatInput = MessageTimestamp.isValidFormat(syntaxInteraction.format) ? syntaxInteraction.format : null;
  const formats = formatInput ? [formatInput] : supportedFormats;

  const columns = formatInput && settings.formatMinimalReply ? ResponseColumnChoices.PREVIEW_ONLY : (syntaxInteraction.columns ?? ResponseColumnChoices.BOTH);
  const addHeader = !(formatInput && settings.formatMinimalReply) && (syntaxInteraction.header ?? true);
  const header = addHeader && getExactTimePrefix(localDate, timezone);
  const table = formattedResponse(ts, formats, columns as ResponseColumnChoices, !formatInput && settings.boldPreview);
  const content: string | undefined = `${header ? `${header}\n` : ''}${table}`;
  const ephemeralFlag = syntaxInteraction.ephemeral ?? EPHEMERAL_OPTION_DEFAULT_VALUE ? MessageFlags.Ephemeral : 0;

  let replyOptions: InteractionReplyOptions = {
    flags: MessageFlags.IsComponentsV2 | ephemeralFlag,
    components: [
      {
        type: ComponentType.TextDisplay,
        content,
      },
    ],
  };
  if (!formatInput) {
    replyOptions = addIncompleteTranslationsFooter(t, interaction, {
      ...replyOptions,
      components: [
        {
          type: ComponentType.TextDisplay,
          content,
        },
        {
          type: ComponentType.Separator,
          divider: true,
          spacing: SeparatorSpacingSize.Small,
        },
        {
          type: ComponentType.TextDisplay,
          content: `${EmojiCharacters.NEW} ${t('commands.global.components.replyWithSpecificFormat')}`,
        },
        {
          type: ComponentType.ActionRow,
          components: [
            formatSelectComponent.getDefinition(t, emojiIdMap),
          ],
        },
      ],
    });
  }
  return replyOptions;
};

interface ReplyWithSyntaxParams {
  localDate: TZDate;
  interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction;
  context: InteractionContext;
  timezone: string | undefined;
  settings: Pick<SettingsValue, 'ephemeral' | 'columns' | 'format' | 'header' | 'boldPreview' | 'formatMinimalReply'>;
}

export const replyWithSyntax = async ({
  localDate,
  interaction,
  context,
  timezone = 'UTC',
  settings,
}: ReplyWithSyntaxParams): Promise<unknown> => {
  return interaction.reply(getSyntaxReplyOptions({
    localDate,
    interaction,
    context,
    timezone,
    settings,
  }));
};
