import { SettingName } from '../types/setting-name.js';
import { env } from '../env.js';
import { MessageTimestampFormat } from '../classes/message-timestamp.js';
import { ResponseColumnChoices } from '../types/localization.js';
import typia from 'typia';
import { apiRequest } from './backend.js';

export interface SettingsValue {
  [SettingName.ephemeral]: boolean | null;
  [SettingName.timezone]: string | null;
  [SettingName.header]: boolean | null,
  [SettingName.columns]: ResponseColumnChoices | null,
  [SettingName.format]: MessageTimestampFormat | null,
}

const defaultSettings: Record<SettingName, null> = {
  [SettingName.ephemeral]: null,
  [SettingName.timezone]: null,
  [SettingName.header]: null,
  [SettingName.columns]: null,
  [SettingName.format]: null,
};

export const getSettings = async (_context: unknown, interaction: {
  user: { id: string }
}): Promise<SettingsValue> => {
  const userId = interaction.user.id;
  try {
    const { response, responseText } = await apiRequest({
      path: `/settings/${userId}`,
      validator: data => typia.validate<SettingsValue>(data),
    });

    if (env.LOCAL) {
      console.debug(`Fetched settings for user ${userId}: ${responseText}`);
    }

    return response;
  } catch (e) {
    console.error(e);
    console.warn('Falling back to default settings due to request error');
    return defaultSettings;
  }
};
