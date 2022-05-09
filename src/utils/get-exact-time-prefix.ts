import { EmojiCharacters } from '../constants/emoji-characters.js';
import { Moment } from 'moment';

const clockEmojiMap: Record<number, EmojiCharacters> = {
  0: EmojiCharacters.TWELVE_OCLOCK,
  30: EmojiCharacters.TWELVE_THIRTY,
  100: EmojiCharacters.ONE_OCLOCK,
  130: EmojiCharacters.ONE_THIRTY,
  200: EmojiCharacters.TWO_OCLOCK,
  230: EmojiCharacters.TWO_THIRTY,
  300: EmojiCharacters.THREE_OCLOCK,
  330: EmojiCharacters.THREE_THIRTY,
  400: EmojiCharacters.FOUR_OCLOCK,
  430: EmojiCharacters.FOUR_THIRTY,
  500: EmojiCharacters.FIVE_OCLOCK,
  530: EmojiCharacters.FIVE_THIRTY,
  600: EmojiCharacters.SIX_OCLOCK,
  630: EmojiCharacters.SIX_THIRTY,
  700: EmojiCharacters.SEVEN_OCLOCK,
  730: EmojiCharacters.SEVEN_THIRTY,
  800: EmojiCharacters.EIGHT_OCLOCK,
  830: EmojiCharacters.EIGHT_THIRTY,
  900: EmojiCharacters.NINE_OCLOCK,
  930: EmojiCharacters.NINE_THIRTY,
  1000: EmojiCharacters.TEN_OCLOCK,
  1030: EmojiCharacters.TEN_THIRTY,
  1100: EmojiCharacters.ELEVEN_OCLOCK,
  1130: EmojiCharacters.ELEVEN_THIRTY,
};

export const getExactTimePrefix = (localMoment: Moment, timezone: string): string => {
  const clockNumber = ((localMoment.hours() % 12) * 100) + (localMoment.minutes() > 30 ? 30 : 0);
  return [
    `${EmojiCharacters.CALENDAR} ${localMoment.format('YYYY-MM-DD')}`,
    `${clockEmojiMap[clockNumber]} ${localMoment.format('HH:mm:ss')}`,
    `${EmojiCharacters.GLOBE} ${timezone}`,
  ].join(' • ');
};
