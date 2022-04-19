import {
  findTimezone, pad,
} from './time.js';
import { MessageTimestamp, MessageTimestampFormat } from './message-timestamp.js';

describe('time utils', () => {
  describe('MessageTimestamp', () => {
    const nowInSeconds = 1629274020;
    const now = new Date(nowInSeconds * 1e3);
    const ts = new MessageTimestamp(now);

    it('should stringify to the long full format by default', () => {
      expect(String(ts)).toEqual(`<t:${nowInSeconds}:F>`);
      expect(ts.toString()).toEqual(`<t:${nowInSeconds}:F>`);
      expect(`Event date: ${ts} (don't be late!)`)
        .toEqual(`Event date: <t:${nowInSeconds}:F> (don't be late!)`);
    });

    it('should stringify to the provided string representation', () => {
      expect(ts.toString(MessageTimestampFormat.SHORT_DATE)).toEqual(`<t:${nowInSeconds}:d>`);
      expect(ts.toString(MessageTimestampFormat.SHORT_FULL)).toEqual(`<t:${nowInSeconds}:f>`);
      expect(ts.toString(MessageTimestampFormat.SHORT_TIME)).toEqual(`<t:${nowInSeconds}:t>`);
      expect(ts.toString(MessageTimestampFormat.LONG_DATE)).toEqual(`<t:${nowInSeconds}:D>`);
      expect(ts.toString(MessageTimestampFormat.LONG_FULL)).toEqual(`<t:${nowInSeconds}:F>`);
      expect(ts.toString(MessageTimestampFormat.RELATIVE)).toEqual(`<t:${nowInSeconds}:R>`);
      expect(ts.toString(MessageTimestampFormat.LONG_TIME)).toEqual(`<t:${nowInSeconds}:T>`);
    });
  });

  describe('pad', () => {
    it('should pad to the specified length with zeroes', () => {
      expect(pad(0, 2)).toEqual('00');
      expect(pad(1, 2)).toEqual('01');
      expect(pad(2, 4)).toEqual('0002');
    });

    it('should stringify sufficiently long numbers without padding', () => {
      expect(pad(10, 2)).toEqual('10');
      expect(pad(100, 3)).toEqual('100');
      expect(pad(9999, 4)).toEqual('9999');
    });

    it('should stringify longer numbers', () => {
      expect(pad(10, 1)).toEqual('10');
      expect(pad(100, 2)).toEqual('100');
      expect(pad(9999, 3)).toEqual('9999');
    });
  });

  describe('findTimezone', () => {
    it('should find exact match', () => {
      expect(findTimezone('GMT')).toEqual('GMT');
      expect(findTimezone('gmt')).toEqual('GMT');
      expect(findTimezone('cet')).toEqual('CET');
    });

    it('should find partial match', () => {
      expect(findTimezone('gmt+2')).toEqual('Etc/GMT-2');
      expect(findTimezone('gmt-12')).toEqual('Etc/GMT+12');
      expect(findTimezone('budapest')).toEqual('Europe/Budapest');
      expect(findTimezone('london')).toEqual('Europe/London');
      expect(findTimezone('los angeles')).toEqual('America/Los_Angeles');
      expect(findTimezone('buenos aires')).toEqual('America/Buenos_Aires');
      expect(findTimezone('madrid')).toEqual('Europe/Madrid');
      expect(findTimezone('tokyo')).toEqual('Asia/Tokyo');
      expect(findTimezone('warsaw')).toEqual('Europe/Warsaw');
    });
  });
});
