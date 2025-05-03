export const SettingName = {
  ephemeral: 'ephemeral',
  timezone: 'timezone',
  header: 'header',
  boldPreview: 'boldPreview',
  columns: 'columns',
  format: 'format',
  formatMinimalReply: 'formatMinimalReply',
  defaultAtHour: 'defaultAtHour',
  defaultAtMinute: 'defaultAtMinute',
  defaultAtSecond: 'defaultAtSecond',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SettingName = typeof SettingName[keyof typeof SettingName];
