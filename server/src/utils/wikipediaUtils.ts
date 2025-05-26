/**
 * Generates a Wikipedia URL from a concept name
 * @param name The name of the concept
 * @returns The Wikipedia URL for the concept
 */
export const generateWikipediaUrl = (name: string): string => {
  // Replace spaces with underscores and handle special characters
  const formattedName = name
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .replace(/_+/g, '_');
  
  return `https://en.wikipedia.org/wiki/${formattedName}`;
};

/**
 * Validates if a URL is a valid Wikipedia URL
 * @param url The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidWikipediaUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'en.wikipedia.org' && parsedUrl.pathname.startsWith('/wiki/');
  } catch {
    return false;
  }
}; 