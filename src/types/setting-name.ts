export const SettingName = {
  ephemeral: 'ephemeral',
  timezone: 'timezone',
  header: 'header',
  boldPreview: 'boldPreview',
  columns: 'columns',
  format: 'format',
  formatMinimalReply: 'formatMinimalReply',
  telemetry: 'telemetry',
  defaultAtHour: 'defaultAtHour',
  defaultAt12Hour: 'defaultAt12Hour',
  defaultAtMinute: 'defaultAtMinute',
  defaultAtSecond: 'defaultAtSecond',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SettingName = typeof SettingName[keyof typeof SettingName];
