/**
 * Takes a message's contents and extracts any Discord-formatted timestamps in it
 */
export const extractTimestampsFromString = (content: string): string[] => {
  const matches = content.match(/<t:\d+:[dftDFRT]>/g);
  if (!matches) return [];

  return Array.from(new Set(matches));
};
