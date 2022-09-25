import { APIApplicationCommandBasicOption } from 'discord-api-types/v10';
import { TFunction } from 'i18next';
import { getEphemeralOption } from './global.options.js';

export const getStatisticsCommandOptions = (t: TFunction): APIApplicationCommandBasicOption[] => [
  getEphemeralOption(t),
];
