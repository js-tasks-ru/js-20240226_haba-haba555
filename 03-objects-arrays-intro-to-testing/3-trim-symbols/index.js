/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (!string || size === 0) return '';
  if (!size) return string;

  let trimmedString = '';
  let currentSize = 0;

  for (const char of string) {
    if (trimmedString.charAt(trimmedString.length - 1) === char) {
      currentSize += 1;
    } else {
      currentSize = 0;
    }
    if (currentSize < size) {
      trimmedString += char;
    }
  }
  return trimmedString;
}
