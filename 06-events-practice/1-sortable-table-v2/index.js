import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTableV2 extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);
    this.sorted = sorted;
    this.createEventListeners();
  }

  handleHeaderPointerDown = (event) => {
    const currentColumn = event.target.closest('[data-sortable="true"]');

    if (!currentColumn) return;

    const {
      id: sortField,
      order: sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    } = currentColumn.dataset;

    super.sort(sortField, sortOrder);
  }

  createEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderPointerDown);
  }

  destroyEventListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderPointerDown);
  }

  destroy() {
    super.destroy();
    this.destroyEventListeners();
  }
}
