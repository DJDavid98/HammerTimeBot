import { Client } from 'pg';
import { SettingName } from '../types/setting-name.js';

export interface SettingModel {
  userId: string;
  setting: string;
  value: string;
}

export const userSettingsTable = {
  select: (db: Client, discordUserId: string, settings?: SettingName[]) => {
    let incr = 1;
    return db.query<SettingModel>(
      `SELECT "setting", "value"
       FROM user_settings
       WHERE "discord_user_id" = $${incr++}${settings ? ` AND "setting" IN (${settings.map(() => `$${incr++}`).join(', ')})` : ''}`,
      [discordUserId, ...(settings ?? [])],
    );
  },
};
