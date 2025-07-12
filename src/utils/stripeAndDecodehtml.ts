// Temporary DOM element for decoding HTML entities and parsing HTML content.
// This element is reused across calls for better performance.
const tempDiv = document.createElement('div');

/**
 * Decodes HTML entities, strips unwanted HTML tags, and allows certain tags from the given input.
 * - Converts numbers to strings.
 * - If the input is not a string or number, returns the input unchanged.
 * @param input - The value to process, which can be of any type.
 * @param strict - If true, all HTML tags are stripped, and only text content is returned.
 * @param allowedTags - An optional array of additional allowed HTML tags (e.g., ['u', 'a']). By default, <b>, <i>, <strong>, and <em> are allowed.
 * @returns The cleaned and decoded string with the allowed tags, or the original input if it's not a string or number.
 */
const stripAndDecodeHtml = (
  input: unknown,
  strict: boolean = false,
  allowedTags: string[] = [],
): string => {
  // Convert numbers to strings
  if (typeof input === 'number') {
    input = input.toString();
  } else if (typeof input !== 'string') {
    // Return the input unchanged for non-string and non-number types
    return input as string;
  }

  // Use the pre-created temporary DOM element for performance
  tempDiv.innerHTML = input as string;

  if (strict) {
    return tempDiv.textContent || tempDiv.innerText || '';
  }

  // Extract and decode any escaped HTML content
  const decodedHtml = tempDiv.innerHTML;

  // Default allowed tags
  const defaultAllowedTags = [
    'p',
    'b',
    'i',
    'em',
    'br',
    'strong',
    'ul',
    'ol',
    'li',
    'a',
  ];

  // Merge default allowed tags with user-specified tags (if any)
  const finalAllowedTags = allowedTags
    ? Array.from(new Set([...defaultAllowedTags, ...allowedTags]))
    : defaultAllowedTags;

  // Regex pattern to allow specific tags
  const allowedTagsPattern = new RegExp(
    `<(\\/?)(${finalAllowedTags.join('|')})([^>]*)>`,
    'gi',
  );

  // Remove all tags not in the allowed list
  const cleanedHtml = decodedHtml.replace(/<\/?[^>]+>/gi, (tag) => {
    // Retain only allowed tags
    return tag.match(allowedTagsPattern) ? tag : '';
  });

  return cleanedHtml.trim();
};

export default stripAndDecodeHtml;
