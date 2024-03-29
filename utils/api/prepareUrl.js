const BACKEND_URL = 'https://course-js.javascript.ru';

export function prepareUrl(apiEndpoint, start, end, isSortLocally, sortOrder, sortField) {
  const url = new URL(apiEndpoint, BACKEND_URL);
  url.searchParams.set('_start', start);
  url.searchParams.set('_end', end);
  if (!isSortLocally && sortOrder && sortField) {
    url.searchParams.set('_order', sortOrder);
    url.searchParams.set('_sort', sortField);
  }
  return url;
}
