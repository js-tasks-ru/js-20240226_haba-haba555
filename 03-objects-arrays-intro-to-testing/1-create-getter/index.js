/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const props = path.split('.');

  return function(obj) {
    let newObj = obj;
    for (let i = 0; i < props.length - 1; i++) {
      const currentProp = props[i];
      if (newObj[currentProp]) {
        newObj = newObj[currentProp];
      }
    }
    return newObj[props[props.length - 1]];
  };
}
