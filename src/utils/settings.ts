import { SettingModel, settingsTable } from '../database/settings-table.js';
import { SettingName } from '../types/setting-name.js';
import { env } from '../env.js';
import { InteractionContext } from '../types/bot-interaction.js';
import { MessageTimestampFormat } from '../classes/message-timestamp.js';
import { ResponseColumnChoices } from '../types/localization.js';

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

const SETTINGS_CACHE_MINUTES = 5;

/**
 * Keep this value in sync with ChiselTime's `UserSettingsService#getSettingsCacheKey` method
 */
const getCacheKey = (userId: string) => `user-settings-${userId}` as const;
type SettingsCacheKey = ReturnType<typeof getCacheKey>;

const cacheSettings = async (context: Pick<InteractionContext, 'redis'>, cacheKey: SettingsCacheKey, settings: SettingsValue) => {
  await context.redis.set(cacheKey, JSON.stringify(settings), 'EX', 60 * SETTINGS_CACHE_MINUTES);
};

export const getSettings = async (context: Pick<InteractionContext, 'db' | 'redis'>, interaction: {
  user: { id: string }
}): Promise<SettingsValue> => {
  const userId = interaction.user.id;
  const cacheKey = getCacheKey(userId);
  const cacheData = await context.redis.get(cacheKey);
  let values: SettingsValue | undefined;
  if (cacheData) {
    try {
      values = JSON.parse(cacheData);
      if (env.LOCAL) {
        console.debug(`Restored settings from cache for user ${userId}: ${JSON.stringify(values)}`);
      }
    } catch (e) {
      console.error(e);
      console.error('Failed to restore cached settings');
    }
  }
  if (!values) {
    let rows: SettingModel[];
    try {
      ({ rows } = await settingsTable.select(context.db, userId));
    } catch (e) {
      console.error(e);
      console.warn('Falling back to default settings due to database error');
      return defaultSettings;
    }
    values = rows.reduce((fin, { setting, value }) => (setting in defaultSettings ? {
      ...fin,
      [setting]: value,
    } : fin), { ...defaultSettings });
    await cacheSettings(context, cacheKey, values);
    if (env.LOCAL) {
      console.debug(`Fetched settings for user ${userId}: ${JSON.stringify(values)}`);
    }
  }
  return values;
};
