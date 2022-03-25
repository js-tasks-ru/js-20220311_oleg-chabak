/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) return '';
  if (!size) return string;

  let count = 0;
  let res = '';

  for (const el of string) {
    if (res[res.length - 1] === el) {
      if (count < size) {
        res += el;
        count++;
      }
    } else {
      count = 1;
      res += el;
    }
  }
  return res;
}
