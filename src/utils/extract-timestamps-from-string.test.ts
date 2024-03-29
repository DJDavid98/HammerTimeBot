import { extractTimestampsFromString } from './extract-timestamps-from-string.js';

describe('extractTimestampsFromString', () => {
  const mockFullTimestamp = '<t:0:F>';
  const mockRelativeTimestamp = '<t:0:R>';

  it('should work at the start of the string', () => {
    expect(extractTimestampsFromString(`${mockFullTimestamp} timestamp at the start`)).toEqual([mockFullTimestamp]);
  });

  it('should work at the end of the string', () => {
    expect(extractTimestampsFromString(`timestamp at the end ${mockFullTimestamp}`)).toEqual([mockFullTimestamp]);
  });

  it('should work in the middle of the string', () => {
    expect(extractTimestampsFromString(`timestamp at ${mockFullTimestamp} the middle`)).toEqual([mockFullTimestamp]);
  });

  it('should work with multiple timestamps', () => {
    expect(extractTimestampsFromString(`Options:\n1. ${mockFullTimestamp}\n2.${mockRelativeTimestamp}\nThat's all.`)).toEqual([mockFullTimestamp, mockRelativeTimestamp]);
  });

  it('should work with consecutive timestamps in string', () => {
    expect(extractTimestampsFromString(`consecutive timestamps ${mockFullTimestamp}${mockRelativeTimestamp}`)).toEqual([mockFullTimestamp, mockRelativeTimestamp]);
  });

  it('should deduplicate the same timestamps appearing multiple times in string', () => {
    expect(extractTimestampsFromString(`Spam ${mockFullTimestamp} ${mockFullTimestamp} ${mockFullTimestamp} ${mockFullTimestamp}`)).toEqual([mockFullTimestamp]);
  });

  it('should return empty array if there are no timestamps in string', () => {
    expect(extractTimestampsFromString('No timestamps')).toEqual([]);
  });
});
