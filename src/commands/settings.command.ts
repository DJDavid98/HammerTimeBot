import { BotChatInputCommand } from '../types/bot-interaction.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { env } from '../env.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';
import { MessageTimestamp, MessageTimestampFormat } from '../classes/message-timestamp.js';
import { apiRequest } from '../utils/backend.js';
import typia from 'typia';

interface LoginLinkResponse {
  loginUrl: string;
  expiresAt: number;
}

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
    const  { response, validation } = await apiRequest({
      path: `/login-link/${user.id}/${locale}`,
      method: 'POST',
      body: {
        name: user.username,
        display_name: user.globalName,
        discriminator: user.discriminator,
        avatar: user.avatar,
      },
      validator: data => typia.validate<LoginLinkResponse>(data),
      failOnInvalidResponse: false,
    });
    if (!validation.success) {
      await interaction.editReply({
        content: `${EmojiCharacters.WARNING_SIGN} ${t('commands.settings.responses.failedToCreateLink', {
          loginUrl,
          settingsUrl,
        })}`,
      });
      return;
    }

    const magicLink = response.loginUrl;
    const expiresAt = new MessageTimestamp(new Date(response.expiresAt * 1e3)).toString(MessageTimestampFormat.RELATIVE);

    await interaction.editReply({
      content: t('commands.settings.responses.linkCreated', { expiresAt, magicLink, loginUrl, settingsUrl }),
    });
  },
};
