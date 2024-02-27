/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const props = path.split('.');

  return function(obj) {
    if (props.length === 1 && !Object.hasOwn(obj, props[0])) {
      return;
    }

    let newObj = obj;

    for (let i = 0; i < props.length - 1; i++) {
      if (Object.hasOwn(newObj, props[i])) {
        newObj = newObj[props[i]];
      }
    }
    return newObj[props[props.length - 1]];
  };
}
