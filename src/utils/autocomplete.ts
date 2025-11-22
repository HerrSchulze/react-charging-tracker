export const findBestMatch = (input: string, options: string[]): string | null => {
  if (!input || options.length === 0) return null;

  const lowerInput = input.toLowerCase();
  
  // Find exact match
  const exactMatch = options.find(opt => opt.toLowerCase() === lowerInput);
  if (exactMatch) return exactMatch;

  // Find best prefix match
  const prefixMatches = options.filter(opt => opt.toLowerCase().startsWith(lowerInput));
  if (prefixMatches.length > 0) {
    return prefixMatches.sort((a, b) => a.length - b.length)[0];
  }

  // Find best substring match
  const substringMatches = options.filter(opt => opt.toLowerCase().includes(lowerInput));
  if (substringMatches.length > 0) {
    return substringMatches.sort((a, b) => a.length - b.length)[0];
  }

  return null;
};
