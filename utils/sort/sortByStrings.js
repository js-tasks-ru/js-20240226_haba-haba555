export function sortByStrings(arr, field, order = 'desc') {
  if (order === 'asc') {
    return arr.sort((a, b) => a[field].localeCompare(b[field]));
  }
  return arr.sort((a, b) => b[field].localeCompare(a[field]));
}
