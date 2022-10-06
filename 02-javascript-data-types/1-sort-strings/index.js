/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  // const newArr = [...arr];
  // const params = [['ru', 'en'], {caseFirst: 'upper'}];
  // if (param === 'desc') {
  //   return newArr.sort((a, b) => b.localeCompare(a, ...params));
  // }
  // return newArr.sort((a, b) => a.localeCompare(b, ...params));

  const directions = {
    asc: 1,
    desc: -1
  };
  const direction = directions[param];
  const params = [['ru', 'en'], {caseFirst: 'upper'}];
  // чтобы сменить направление надо * -1
  return [...arr].sort((a, b) => direction * a.localeCompare(b, ...params));
}
