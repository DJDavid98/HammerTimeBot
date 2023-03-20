import { getExactTimePrefix } from './get-exact-time-prefix.js';
import moment from 'moment-timezone';
import { EmojiCharacters } from '../constants/emoji-characters.js';

describe('getExactTimePrefix', () => {
  it('should format the input correctly', () => {
    const timezone = 'UTC';
    const now = moment.tz('1970-01-01 00:00:00', timezone);
    const expected =
      `${EmojiCharacters.CALENDAR} 1970-01-01 • ${EmojiCharacters.TWELVE_OCLOCK} 00:00:00 • ${EmojiCharacters.GLOBE} ${timezone}`;
    const actual = getExactTimePrefix(now, timezone);
    expect(actual).toEqual(expected);
  });
});
