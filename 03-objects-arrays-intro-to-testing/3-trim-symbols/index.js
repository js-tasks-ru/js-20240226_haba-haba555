/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (!string) return '';

  const [firstLetter, ...others] = [...string];
  const repeatedStrings = [];
  let currentString = firstLetter;

  for (let i = 0; i < others.length; i++) {
    if (currentString.at(-1) === others[i]) {
      currentString += others[i];
    } else {
      repeatedStrings.push(currentString);
      currentString = others[i];
    }
  }
  repeatedStrings.push(currentString);

  const trimmedStrings = [];
  for (const str of repeatedStrings) {
    trimmedStrings.push(str.slice(0, size));
  }

  return trimmedStrings.join('');
}
