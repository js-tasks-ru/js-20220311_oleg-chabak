/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const fields = path.split('.');
  if (!fields.length) return;
  return (obj) => {
    let result = obj;
    for (const field of fields) {
      if (!result[field]) return;
      result = result[field];
    }
    return result;
  };
}
