import { BotChatInputCommand } from '../types/bot-interaction.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { env } from '../env.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';
import { MessageTimestamp, MessageTimestampFormat } from '../classes/message-timestamp.js';

interface LoginLinkResponse {
  loginUrl: string;
  expiresAt: number;
}

const isLoginLinkResponse = (value: unknown): value is LoginLinkResponse => typeof value === 'object' && value !== null && 'loginUrl' in value && typeof value.loginUrl === 'string' && 'expiresAt' in value && typeof value.expiresAt === 'number' && !isNaN(value.expiresAt) && isFinite(value.expiresAt);

export const settingsCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.settings.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.settings.name', { lng })),
  }),
  async handle(interaction, context) {
    await interaction.deferReply({ ephemeral: true });
    const { t } = context;
    const { locale, user } = interaction;

    const loginUrl = `${env.API_URL}/${locale}/login`;
    const settingsUrl = `${env.API_URL}/${locale}/settings`;
    let responseText: string | undefined;
    let r: Response | undefined;
    try {
      r = await fetch(`${env.API_URL}/api/login-link/${user.id}/${locale}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.API_TOKEN}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.username,
          display_name: user.globalName,
          discriminator: user.discriminator,
          avatar: user.avatar,
        }),
      });
      if (!r.ok) {
        throw new Error(`fetch ${r.url}: ${r.status} ${r.statusText}`);
      }
      responseText = await r.text();
    } catch (e) {
      console.error(e);
    }

    const response = responseText && JSON.parse(responseText);
    if (!isLoginLinkResponse(response)) {
      await interaction.editReply({
        content: `${EmojiCharacters.WARNING_SIGN} ${t('commands.settings.responses.failedToCreateLink', {
          loginUrl,
          settingsUrl,
        })}`,
      });
      console.warn(`Invalid API response while getting login link: ${r ? await r.text() : 'undefined'}`);
      return;
    }

    const magicLink = response.loginUrl;
    const expiresAt = new MessageTimestamp(new Date(response.expiresAt * 1e3)).toString(MessageTimestampFormat.RELATIVE);

    await interaction.editReply({
      content: t('commands.settings.responses.linkCreated', { expiresAt, magicLink, loginUrl, settingsUrl }),
    });
  },
};
