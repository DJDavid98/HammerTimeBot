/**
 * Takes a message's contents and extracts any Discord-formatted timestamps in it
 */
export const extractTimestampsFromStrings = (input: string | string[]): string[] => {
  let matches: string[] = [];
  const content = Array.isArray(input) ? input : [input];
  content.forEach(item => {
    const itemMatches = item.match(/<t:-?\d+(?::[dftDFRT])?>/g) as string[] | null;
    if (itemMatches) {
      matches = [...matches, ...itemMatches];
    }
  });
  if (!matches) return [];

  return Array.from(new Set(matches));
};
