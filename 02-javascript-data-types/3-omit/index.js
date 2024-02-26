/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const newObj = Object.entries(obj).filter(([key, value]) => {
    if (!fields.includes(key)) {
      return [key, value];
    }
  });
  return Object.fromEntries(newObj);
};
