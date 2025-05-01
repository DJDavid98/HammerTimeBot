import { getExactTimePrefix } from './get-exact-time-prefix.js';
import moment from 'moment-timezone';
import { EmojiCharacters } from '../constants/emoji-characters.js';
import { describe, expect, it } from 'vitest';

describe('getExactTimePrefix', () => {
  it('should format the input correctly', () => {
    const timezone = 'UTC';
    const now = moment.tz('1970-01-01 00:00:00', timezone);
    const expected =
      `${EmojiCharacters.CALENDAR} 1970-01-01 • ${EmojiCharacters.TWELVE_OCLOCK} 00:00:00 • ${EmojiCharacters.GLOBE} ${timezone}`;
    const actual = getExactTimePrefix(now, timezone);
    expect(actual).toEqual(expected);
  });

  it('should include milliseconds in output when available', () => {
    const timezone = 'UTC';
    const now = moment.tz('1970-01-01 12:34:56.789', timezone);
    const expected =
      `${EmojiCharacters.CALENDAR} 1970-01-01 • ${EmojiCharacters.TWELVE_THIRTY} 12:34:56.789 • ${EmojiCharacters.GLOBE} ${timezone}`;
    const actual = getExactTimePrefix(now, timezone);
    expect(actual).toEqual(expected);
  });
});
