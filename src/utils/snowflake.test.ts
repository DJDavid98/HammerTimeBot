import snowflakeToUnix from './snowflake.js';

describe('snowflakteToUnix', () => {
  it('should convert a snowflake to a unix timestamp', () => {
    expect(snowflakeToUnix('996673713938366504')).toEqual(1657695930);
    expect(snowflakeToUnix('1005505184094507048')).toEqual(1659801517);
    expect(snowflakeToUnix('1006946901482029096')).toEqual(1660145249);
    expect(snowflakeToUnix('1052750665581088768')).toEqual(1671065717);
    expect(snowflakeToUnix('140360880079503362')).toEqual(1453535041);
    expect(snowflakeToUnix('138353487208644608')).toEqual(1453056441);
    expect(snowflakeToUnix('0x1EB87C37A81FFF8')).toEqual(1453056441);
    expect(snowflakeToUnix('4194304')).toEqual(1420070400);
  });
  it('should throw an error if the snowflake is invalid', () => {
    expect(() => snowflakeToUnix('invalid')).toThrow(new Error('Invalid snowflake. Snowflakes must be a valid number.'));
    expect(() => snowflakeToUnix('')).toThrow(new Error('Invalid snowflake. Snowflakes must be a valid number.'));
    expect(() => snowflakeToUnix('120312039NotANumber012021')).toThrow(new Error('Invalid snowflake. Snowflakes must be a valid number.'));
    expect(() => snowflakeToUnix('one')).toThrow(new Error('Invalid snowflake. Snowflakes must be a valid number.'));
  });
  it('should throw an error if the snowflake is too small', () => {
    expect(() => snowflakeToUnix('4194303')).toThrow(new Error('Invalid snowflake. Snowflakes must be greater than 4194303.'));
    expect(() => snowflakeToUnix('0')).toThrow(new Error('Invalid snowflake. Snowflakes must be greater than 4194303.'));
    expect(() => snowflakeToUnix('-10')).toThrow(new Error('Invalid snowflake. Snowflakes must be greater than 4194303.'));
    expect(() => snowflakeToUnix('-138353487208644608')).toThrow(new Error('Invalid snowflake. Snowflakes must be greater than 4194303.'));
  });
});