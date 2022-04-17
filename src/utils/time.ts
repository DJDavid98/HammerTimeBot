import moment from 'moment-timezone';
import levenshtein from 'js-levenshtein';

export enum MessageTimestampFormat {
  /** @example `18/08/2021` */
  SHORT_DATE = 'd',
  /** @example `18 August 2021 09:52` */
  SHORT_FULL = 'f',
  /** @example `09:52` */
  SHORT_TIME = 't',
  /** @example `18 August 2021` */
  LONG_DATE = 'D',
  /** @example `Wednesday, 18 August 2021 09:52` */
  LONG_FULL = 'F',
  /** @example `8 minutes ago` */
  RELATIVE = 'R',
  /** @example `09:52:00` */
  LONG_TIME = 'T',
}

export class MessageTimestamp {
  constructor(private date: Date) {
  }

  toString<F extends MessageTimestampFormat>(tsFormat: F): `<t:${string}:${F}>`;
  toString(tsFormat?: undefined): `<t:${string}:${MessageTimestampFormat.LONG_FULL}>`;

  toString<F extends MessageTimestampFormat>(tsFormat?: F): `<t:${string}:${F | MessageTimestampFormat.LONG_FULL}>` {
    return MessageTimestamp.fromTimestamp(Math.round(this.date.getTime() / 1000), tsFormat);
  }

  static fromTimestamp<F extends MessageTimestampFormat>(unixTimestamp: string | number, tsFormat?: F): `<t:${string}:${F | MessageTimestampFormat.LONG_FULL}>` {
    return `<t:${unixTimestamp}:${tsFormat || MessageTimestampFormat.LONG_FULL}>`;
  }
}

export const pad = (n: number, length: number): string => {
  const nString = `${n}`;
  if (nString.length >= length) return nString;

  return new Array(length).join('0') + nString;
};

export const gmtZoneRegex = /^Etc\/(GMT([+-]\d+)?)$/;

const compareGmtStrings = (a: string, b: string) => parseInt(a.replace(gmtZoneRegex, '$2'), 10) - parseInt(b.replace(gmtZoneRegex, '$2'), 10);

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

export const findTimezone = (value: string): string | undefined => {
  const lowerValue = value.toLowerCase().replace(/\s+/g, '_');
  if (lowerValue in timezoneIndex) {
    return timezoneIndex[lowerValue];
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
    const bestMatchKey = matchingKeys.sort((a, b) => getCachedDistance(b) - getCachedDistance(a)).pop() as string;
    return timezoneIndex[bestMatchKey];
  }

  return undefined;
};

export const formattedResponse = (ts: MessageTimestamp, formats: MessageTimestampFormat[]): string => {
  const strings = formats.map((format) => {
    const formatted = ts.toString(format);
    return `\`${formatted}\` → ${formatted}`;
  });
  return strings.join('\n');
};
