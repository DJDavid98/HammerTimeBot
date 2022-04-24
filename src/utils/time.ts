import moment, { Moment } from 'moment-timezone';
import levenshtein from 'js-levenshtein';
import { unitOfTime } from 'moment';
import { TimezoneError } from './timezone-error.js';
import { MessageTimestamp, MessageTimestampFormat } from './message-timestamp.js';

export const pad = (n: number, length: number): string => {
  const nString = `${n}`;
  if (nString.length >= length) return nString;

  return new Array(length).join('0') + nString;
};

export const gmtZoneRegex = /^Etc\/(GMT([+-]\d+)?)$/;

const compareGmtStrings = (a: string, b: string) => parseInt(a.replace(gmtZoneRegex, '$2'), 10) - parseInt(b.replace(gmtZoneRegex, '$2'), 10);

const switchGmtZoneName = (value: string): string =>
  value.replace(gmtZoneRegex, (_, extractedIdentifier: string) => extractedIdentifier.replace(/([+-])/, (m) => (m === '+' ? '-' : '+')));

export const getTimezoneLabel = (timezone: string): string => {
  if (!gmtZoneRegex.test(timezone)) return timezone;
  return switchGmtZoneName(timezone);
};

export const getSortedNormalizedTimezoneNames = (): string[] => moment.tz
  .names()
  .filter((name) => !/^(?:Etc\/)?GMT[+-]0$/.test(name))
  .sort((a, b) => {
    const isAGmt = gmtZoneRegex.test(a);
    const isBGmt = gmtZoneRegex.test(b);
    if (isAGmt) return isBGmt ? compareGmtStrings(a, b) : -1;
    if (isBGmt) return isAGmt ? compareGmtStrings(a, b) : 1;
    return a.localeCompare(b);
  });

export const timezoneNames = getSortedNormalizedTimezoneNames();

const slashPartRegex = /\/(\w+)$/g;
export const timezoneIndex: Record<string, string> = timezoneNames.reduce((record, name) => {
  const lowerName = name.toLowerCase()
    // Normalize GMT flipped signs
    .replace(/gmt([+-])/, (_, sign) => `gmt${sign === '+' ? '-' : '+'}`);
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
    candidates = [...candidates, ...sortedKeys.map(key => timezoneIndex[key])];
  }

  if (candidates.length === 0) {
    throw new TimezoneError(value);
  }

  return candidates;
};

export const supportedFormats = Object.values(MessageTimestampFormat);

export const formattedResponse = (ts: MessageTimestamp, formats: MessageTimestampFormat[]): string => {
  const strings = formats.map((format) => {
    const formatted = ts.toString(format);
    return `\`${formatted}\` → ${formatted}`;
  });
  return strings.join('\n');
};

export const adjustMoment = <TimeMap extends Partial<Record<unitOfTime.DurationConstructor, number | null>>>(timeMap: TimeMap, method: 'add' | 'subtract', now?: Date): Moment => {
  const timestamp = moment(now);
  (Object.keys(timeMap) as unitOfTime.DurationConstructor[]).forEach((key) => {
    const value = timeMap[key];
    if (typeof value === 'number' && value > 0) timestamp[method](value, key);
  });
  return timestamp;
};

export const constrain = (n: number, min: number, max?: number): number => (max ? Math.min(Math.max(n, min), max) : Math.max(n, min));
