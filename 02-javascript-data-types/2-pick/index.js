/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const newObj = {};
  // for (const el of fields) {
  //   if (el in obj) {
  //     newObj[el] = obj[el];
  //   }
  // }
  // лучше, т.к. итерация происходит только по собственным перечисляемым свойствам
  for (const [key, value] of Object.entries(obj)) {
    if (fields.includes(key)) {
      newObj[key] = value;
    }
  }
  return newObj;
};
