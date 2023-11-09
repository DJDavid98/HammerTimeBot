import { APIApplicationCommandOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { TFunction } from 'i18next';
import { GlobalCommandOptionName, ResponseColumnChoices } from '../types/localization.js';
import { MessageTimestampFormat } from '../classes/message-timestamp.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';

const getFormatOption = (t: TFunction): APIApplicationCommandOption => ({
  name: GlobalCommandOptionName.FORMAT,
  ...getLocalizedObject('name', (lng) => t('commands.global.options.format.name', { lng }), false),
  ...getLocalizedObject('description', (lng) => t('commands.global.options.format.description', { lng })),
  type: ApplicationCommandOptionType.String,
  choices: [
    {
      value: MessageTimestampFormat.SHORT_DATE,
      ...getLocalizedObject('name', (lng) => t('commands.global.options.format.choices.d', { lng }), true, false),
    },
    {
      value: MessageTimestampFormat.LONG_DATE,
      ...getLocalizedObject('name', (lng) => t('commands.global.options.format.choices.D', { lng }), true, false),
    },
    {
      value: MessageTimestampFormat.SHORT_TIME,
      ...getLocalizedObject('name', (lng) => t('commands.global.options.format.choices.t', { lng }), true, false),
    },
    {
      value: MessageTimestampFormat.LONG_TIME,
      ...getLocalizedObject('name', (lng) => t('commands.global.options.format.choices.T', { lng }), true, false),
    },
    {
      value: MessageTimestampFormat.SHORT_FULL,
      ...getLocalizedObject('name', (lng) => t('commands.global.options.format.choices.f', { lng }), true, false),
    },
    {
      value: MessageTimestampFormat.LONG_FULL,
      ...getLocalizedObject('name', (lng) => t('commands.global.options.format.choices.F', { lng }), true, false),
    },
    {
      value: MessageTimestampFormat.RELATIVE,
      ...getLocalizedObject('name', (lng) => t('commands.global.options.format.choices.R', { lng }), true, false),
    },
  ],
});

const getHeaderOption = (t: TFunction): APIApplicationCommandOption => ({
  name: GlobalCommandOptionName.HEADER,
  ...getLocalizedObject('name', (lng) => t('commands.global.options.header.name', { lng }), false),
  ...getLocalizedObject('description', (lng) => t('commands.global.options.header.description', { lng })),
  type: ApplicationCommandOptionType.Boolean,
});

const getColumnsOption = (t: TFunction): APIApplicationCommandOption => ({
  name: GlobalCommandOptionName.COLUMNS,
  ...getLocalizedObject('name', (lng) => t('commands.global.options.columns.name', { lng }), false),
  ...getLocalizedObject('description', (lng) => t('commands.global.options.columns.description', { lng })),
  type: ApplicationCommandOptionType.String,
  choices: [
    {
      value: ResponseColumnChoices.BOTH,
      ...getLocalizedObject('name', (lng) => t('commands.global.options.columns.choices.both', { lng }), true, false),
    },
    {
      value: ResponseColumnChoices.PREVIEW_ONLY,
      ...getLocalizedObject('name', (lng) => t('commands.global.options.columns.choices.preview', { lng }), true, false),
    },
    {
      value: ResponseColumnChoices.SYNTAX_ONLY,
      ...getLocalizedObject('name', (lng) => t('commands.global.options.columns.choices.syntax', { lng }), true, false),
    },
  ],
});

export const getEphemeralOption = (t: TFunction): APIApplicationCommandOption => ({
  name: GlobalCommandOptionName.EPHEMERAL,
  ...getLocalizedObject('name', (lng) => t('commands.global.options.ephemeral.name', { lng }), false),
  ...getLocalizedObject('description', (lng) => t('commands.global.options.ephemeral.description', { lng })),
  type: ApplicationCommandOptionType.Boolean,
});

export const getTimezoneOption = (t: TFunction): APIApplicationCommandOption => ({
  name: GlobalCommandOptionName.TIMEZONE,
  ...getLocalizedObject('name', (lng) => t('commands.global.options.timezone.name', { lng }), false),
  ...getLocalizedObject('description', (lng) => t('commands.global.options.timezone.description', { lng })),
  type: ApplicationCommandOptionType.String,
  autocomplete: true,
});

export const getGlobalOptions = (t: TFunction): APIApplicationCommandOption[] => [
  getFormatOption(t),
  getHeaderOption(t),
  getColumnsOption(t),
  getEphemeralOption(t),
];
