export const SettingName = {
  ephemeral: 'ephemeral',
  timezone: 'timezone',
  header: 'header',
  columns: 'columns',
  format: 'format',
  defaultAtHour: 'defaultAtHour',
  defaultAtMinute: 'defaultAtMinute',
  defaultAtSecond: 'defaultAtSecond',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SettingName = typeof SettingName[keyof typeof SettingName];
