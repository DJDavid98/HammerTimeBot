import moment, { Moment } from 'moment-timezone';
import levenshtein from 'js-levenshtein';
import { unitOfTime } from 'moment';
import { TimezoneError } from '../classes/timezone-error.js';
import { MessageTimestamp, MessageTimestampFormat } from '../classes/message-timestamp.js';
import { ResponseColumnChoices } from '../types/localization.js';

export const gmtTimezoneOptions = [
  'GMT',
  'GMT-1',
  'GMT+1',
  'GMT-2',
  'GMT+2',
  'GMT-3',
  'GMT+3',
  'GMT-4',
  'GMT+4',
  'GMT-5',
  'GMT+5',
  'GMT-6',
  'GMT+6',
  'GMT-7',
  'GMT+7',
  'GMT-8',
  'GMT+8',
  'GMT-9',
  'GMT+9',
  'GMT-10',
  'GMT+10',
  'GMT-11',
  'GMT+11',
  'GMT-12',
  'GMT+12',
  'GMT-13',
  'GMT+13',
  'GMT-14',
  'GMT+14',
  'GMT-15',
  'GMT+15',
  'GMT-16',
  'GMT+16',
];

export const pad = (n: number, length: number): string => {
  const nString = `${n}`;
  if (nString.length >= length) return nString;

  return new Array(length).join('0') + nString;
};

export const gmtZoneRegex = /^GMT([+-]\d+)?$/i;

export const getGmtTimezoneValue = (gmtTimezone: string, fallback = NaN): number => {
  const offsetString = gmtTimezone.replace(gmtZoneRegex, '$1');
  return offsetString.length === 0 ? fallback : parseInt(offsetString, 10);
};

const compareGmtStrings = (a: string, b: string) => {
  const aValue = getGmtTimezoneValue(a);
  const bValue = getGmtTimezoneValue(b);
  if (isNaN(aValue)) return -1;
  if (isNaN(bValue)) return 1;
  return Math.abs(aValue) - Math.abs(bValue);
};

export const getSortedNormalizedTimezoneNames = (): string[] => [
  ...moment.tz.names().filter((name) => !/GMT/g.test(name)),
  ...gmtTimezoneOptions,
].sort((a, b) => {
  const isAGmt = gmtZoneRegex.test(a);
  const isBGmt = gmtZoneRegex.test(b);
  if (isAGmt) return isBGmt ? compareGmtStrings(a, b) : -1;
  if (isBGmt) return isAGmt ? compareGmtStrings(a, b) : 1;
  return a.localeCompare(b);
});

export const timezoneNames = getSortedNormalizedTimezoneNames();

const slashPartRegex = /\/(\w+)$/g;
export const timezoneIndex: Record<string, string> = timezoneNames.reduce((record, name) => {
  const lowerName = name.toLowerCase();
  const lowerKeys = [lowerName];
  const slashPart = lowerName.match(slashPartRegex);
  if (slashPart) {
    lowerKeys.push(slashPart[1]);
  }
  return {
    ...record,
    ...lowerKeys.reduce((part, lowerKey) => ({ ...part, [lowerKey]: name }), {}),
  };
}, {});

export const findTimezone = (value: string): string[] => {
  if (gmtZoneRegex.test(value)) {
    const inputUppercase = value.toUpperCase();
    return gmtTimezoneOptions.filter(option => option.startsWith(inputUppercase)).sort(compareGmtStrings);
  }

  const lowerValue = value.toLowerCase().replace(/\s+/g, '_');
  let candidates: string[] = [];
  if (lowerValue in timezoneIndex) {
    candidates.push(timezoneIndex[lowerValue]);
  }

  const matchingKeys = Object.keys(timezoneIndex).filter((key) => key.includes(lowerValue));
  if (matchingKeys.length > 0) {
    const distanceCache: Record<string, number> = {};
    const getCachedDistance = (key: string): number => {
      if (!(key in distanceCache)) {
        distanceCache[key] = levenshtein(key, lowerValue);
      }
      return distanceCache[key];
    };
    const sortedKeys = matchingKeys.sort((a, b) => getCachedDistance(a) - getCachedDistance(b));
    candidates = Array.from(new Set([...candidates, ...sortedKeys.map(key => timezoneIndex[key])]));
  }

  if (candidates.length === 0) {
    throw new TimezoneError(value);
  }

  return candidates;
};

export const supportedFormats = Object.values(MessageTimestampFormat);

const responseFormatters: Record<ResponseColumnChoices, (formatted: string) => string> = {
  [ResponseColumnChoices.PREVIEW_ONLY]: (formatted) => `**${formatted}**`,
  [ResponseColumnChoices.SYNTAX_ONLY]: (formatted) => `\`${formatted}\``,
  [ResponseColumnChoices.BOTH]: (formatted) => `${responseFormatters[ResponseColumnChoices.SYNTAX_ONLY](formatted)} → ${responseFormatters[ResponseColumnChoices.PREVIEW_ONLY](formatted)}`,
};

export const formattedResponse = (ts: MessageTimestamp, formats: MessageTimestampFormat[], columns: ResponseColumnChoices): string => {
  const strings = formats.map((format) => {
    const formatted = ts.toString(format);
    return responseFormatters[columns](formatted);
  });
  return strings.join('\n');
};

export const adjustMoment = <TimeMap extends Partial<Record<unitOfTime.DurationConstructor, number | null>>>(timeMap: TimeMap, method: 'add' | 'subtract', now?: Date | Moment): Moment => {
  const timestamp = moment.isMoment(now) ? now : moment(now);
  (Object.keys(timeMap) as unitOfTime.DurationConstructor[]).forEach((key) => {
    const value = timeMap[key];
    if (typeof value === 'number' && value > 0) timestamp[method](value, key);
  });
  return timestamp;
};

export const constrain = (n: number, min: number, max?: number): number => (max ? Math.min(Math.max(n, min), max) : Math.max(n, min));
