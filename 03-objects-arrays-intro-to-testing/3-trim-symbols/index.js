/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (!string) return '';

  const [firstLetter, ...others] = [...string];
  const trimmedStrings = [];
  let currentString = firstLetter;

  for (let i = 0; i < others.length; i++) {
    if (currentString.at(-1) === others[i]) {
      currentString += others[i];
    } else {
      trimmedStrings.push(currentString.slice(0, size));
      currentString = others[i];
    }
  }
  trimmedStrings.push(currentString.slice(0, size));

  return trimmedStrings.join('');
}
