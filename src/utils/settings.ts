import { SettingName } from '../types/setting-name.js';
import { env } from '../env.js';
import { MessageTimestampFormat } from '../classes/message-timestamp.js';
import { ResponseColumnChoices } from '../types/localization.js';
import typia from 'typia';
import { backendApiRequest } from './backend-api-request.js';
import { LoggerContext } from '../types/bot-interaction.js';

export interface SettingsValue {
  [SettingName.ephemeral]: boolean | null;
  [SettingName.timezone]: string | null;
  [SettingName.header]: boolean | null,
  [SettingName.boldPreview]: boolean | null,
  [SettingName.columns]: ResponseColumnChoices | null,
  [SettingName.format]: MessageTimestampFormat | null,
  [SettingName.formatMinimalReply]: boolean | null,
  [SettingName.telemetry]: boolean | null,
  [SettingName.defaultAtHour]: number | null,
  [SettingName.defaultAt12Hour]: number | null,
  [SettingName.defaultAtMinute]: number | null,
  [SettingName.defaultAtSecond]: number | null,
}

const defaultSettings: { [k in SettingName]: SettingsValue[k] } = {
  [SettingName.ephemeral]: null,
  [SettingName.timezone]: null,
  [SettingName.header]: null,
  [SettingName.boldPreview]: null,
  [SettingName.columns]: null,
  [SettingName.format]: null,
  [SettingName.formatMinimalReply]: null,
  [SettingName.defaultAtHour]: null,
  [SettingName.defaultAt12Hour]: null,
  [SettingName.defaultAtMinute]: null,
  [SettingName.defaultAtSecond]: 0,
  [SettingName.telemetry]: true,
};

export const getSettings = async (
  context: LoggerContext,
  userId: string,
): Promise<SettingsValue> => {
  const { logger } = context;
  if (env.DISABLE_SETTINGS) {
    logger.debug(`Settings are disabled, falling back to default settings for user ${userId}`);
    return defaultSettings;
  }

  try {
    const { response, responseText } = await backendApiRequest(context, {
      path: `/settings/${userId}`,
      validator: typia.createValidate<SettingsValue>(),
    });

    if (env.LOCAL) {
      logger.debug(`Fetched settings for user ${userId}: ${responseText}`);
    }

    return response;
  } catch (e) {
    logger.error('Falling back to default settings due to request error', e);
    return defaultSettings;
  }
};
