export const SettingName = {
  ephemeral: 'ephemeral',
  timezone: 'timezone',
  header: 'header',
  columns: 'columns',
  format: 'format',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SettingName = typeof SettingName[keyof typeof SettingName];
