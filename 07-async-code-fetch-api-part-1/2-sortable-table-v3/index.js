import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';
const OFFSET = 30;

export default class SortableTableV3 extends SortableTableV2 {
  start = 0;
  end = OFFSET;

  constructor(headersConfig, {
    data = [],
    sorted = {},
    url = '',
    isSortLocally = false,
  } = {}) {
    super(headersConfig, { data });
    this.url = url;
    this.isSortLocally = isSortLocally;
    this.render();
    this.createEventListeners();
  }

  update() {
    this.subElements.body.innerHTML = this.createTableBodyTemplate(this.data);
  }

  async loadData() {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set('_start', this.start);
    url.searchParams.set('_end', this.end);
    if (!this.isSortLocally && this.sortOrder && this.sortField) {
      url.searchParams.set('_order', this.sortOrder);
      url.searchParams.set('_sort', this.sortField);
    }
    const result = await fetchJson(url);
    this.data = [...this.data, ...result];
  }

  async render() {
    this.subElements.loading.style.display = 'block';
    await this.loadData();
    this.update();
    this.subElements.loading.style.display = 'none';
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient(this.sortField, this.sortOrder);
    } else {
      this.sortOnServer(this.sortField, this.sortOrder);
    }
  }

  async sortOnClient(id, order) {
    super.sortOnClient(id, order);
  }

  async sortOnServer(id, order) {
    this.sortField = id;
    this.sortOrder = order;
    this.start = 0;
    this.end = OFFSET;
    this.data = [];
    await this.render();
  }

   handleBodyScroll = async () => {
     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
       this.start += OFFSET;
       this.end += OFFSET;
       await this.render();
     }
   }

   createEventListeners() {
     super.createEventListeners();
     window.addEventListener('scroll', this.handleBodyScroll);
   }

   destroyEventListeners() {
     super.destroyEventListeners();
     window.removeEventListener('scroll', this.handleBodyScroll);
   }
}
