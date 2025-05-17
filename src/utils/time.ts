import levenshtein from 'js-levenshtein';
import { TimezoneError } from '../classes/timezone-error.js';
import { MessageTimestamp, MessageTimestampFormat } from '../classes/message-timestamp.js';
import { ResponseColumnChoices } from '../types/localization.js';
import { UtcOffset } from '../classes/utc-offset.js';
import { pad, PadDirection } from './numbers.js';
import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addSeconds,
  addYears,
  isDate,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subSeconds,
  subYears,
} from 'date-fns';
import { TZDate } from '@date-fns/tz';

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

export const gmtZoneRegex = /^(?:GMT|UTC)([+-]\d+)?(?::([0-5]\d?)?)?$/i;

export const getGmtTimezoneValue = (gmtTimezone: string, fallbackHours = NaN): UtcOffset => {
  const match = gmtTimezone.match(gmtZoneRegex);
  if (!match) {
    return new UtcOffset(fallbackHours);
  }

  const hours = parseInt(match[1], 10);
  let minutes = 0;
  if (match[2]) {
    minutes = parseInt(pad(match[2], 2, PadDirection.RIGHT), 10);
  }
  return new UtcOffset(hours, minutes);
};

const compareGmtStrings = (a: string, b: string) => {
  const aValue = getGmtTimezoneValue(a);
  const bValue = getGmtTimezoneValue(b);
  if (isNaN(aValue.hours)) return -1;
  if (isNaN(bValue.hours)) return 1;
  return Math.abs(aValue.totalMinutes) - Math.abs(bValue.totalMinutes);
};

export const getSortedNormalizedTimezoneNames = (): string[] => [
  ...Intl.supportedValuesOf('timeZone').filter((name) => !/GMT/g.test(name)),
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
  const utcOffset = getGmtTimezoneValue(value);
  if (!isNaN(utcOffset.hours)) {
    const inputUppercase = value.toUpperCase();
    const results = gmtTimezoneOptions.filter(option => option.startsWith(inputUppercase)).sort(compareGmtStrings);
    if (results.length === 0) {
      return [`GMT${utcOffset.toString(false)}`];
    }
    return results;
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

export const RESPONSE_FORMATTERS: Record<ResponseColumnChoices, (formatted: string, boldPreview?: boolean) => string> = {
  [ResponseColumnChoices.PREVIEW_ONLY]: (formatted, boldPreview?: boolean) => boldPreview ? `**${formatted}**` : formatted,
  [ResponseColumnChoices.SYNTAX_ONLY]: (formatted) => `\`${formatted}\``,
  [ResponseColumnChoices.BOTH]: (formatted, boldPreview?: boolean) =>
    `${RESPONSE_FORMATTERS[ResponseColumnChoices.SYNTAX_ONLY](formatted)} → ${RESPONSE_FORMATTERS[ResponseColumnChoices.PREVIEW_ONLY](formatted, boldPreview)}`,
};

export const formattedResponse = (ts: MessageTimestamp, formats: MessageTimestampFormat[], columns: ResponseColumnChoices, boldPreview: boolean | null): string => {
  const strings = formats.map((format) => {
    const formatted = ts.toString(format);
    return RESPONSE_FORMATTERS[columns](formatted, boldPreview ?? true);
  });
  return strings.join('\n');
};

type AdjustMethod = 'add' | 'subtract';
const adjustFunctions = {
  years: {
    add: (date, value) => addYears(date, value),
    subtract: (date, value) => subYears(date, value),
  },
  months: {
    add: (date, value) => addMonths(date, value),
    subtract: (date, value) => subMonths(date, value),
  },
  days: {
    add: (date, value) => addDays(date, value),
    subtract: (date, value) => subDays(date, value),
  },
  hours: {
    add: (date, value) => addHours(date, value),
    subtract: (date, value) => subHours(date, value),
  },
  minutes: {
    add: (date, value) => addMinutes(date, value),
    subtract: (date, value) => subMinutes(date, value),
  },
  seconds: {
    add: (date, value) => addSeconds(date, value),
    subtract: (date, value) => subSeconds(date, value),
  },
} as const satisfies Record<string, Record<AdjustMethod, (date: TZDate, value: number) => TZDate>>;

export type TimeUnit = keyof typeof adjustFunctions;
export type TimeMap = Partial<Record<TimeUnit, number | null>>;

export const adjustDate = (timeMap: TimeMap, method: AdjustMethod, now?: Date | TZDate): TZDate => {
  const timestamp = isDate(now) ? new TZDate(now) : (now ?? new TZDate());
  return (Object.keys(adjustFunctions)).reduce((finalTs, key) => {
    const unit = key as TimeUnit;
    const value = timeMap[unit];
    if (typeof value === 'number' && value > 0) {
      return adjustFunctions[unit][method](finalTs, value);
    }
    return finalTs;
  }, timestamp);
};

export const constrain = (n: number, min: number, max?: number): number => (max ? Math.min(Math.max(n, min), max) : Math.max(n, min));
