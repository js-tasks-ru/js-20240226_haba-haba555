import fetchJson from './utils/fetch-json.js';
import ColumnChart from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";
import {getSubElements} from "../../utils/dom/getSubElements.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChartV2 extends ColumnChart {
  subElements = {};

  constructor(options) {
    super(options);
    this.url = options?.url;
    this.from = options?.range?.from;
    this.to = options?.range?.to;
    this.subElements = getSubElements(this.element);
    this.update();
  }

  updateTotalValue(data) {
    const total = data.reduce((acc, value) => acc + value, 0);
    this.subElements.header.textContent = this.formatHeading(total);
  }

  async update() {
    this.element.classList.add('column-chart_loading');
    const data = await this.fetchData(this.from, this.to);
    super.update(Object.values(data));
    this.updateTotalValue(Object.values(data));
    this.element.classList.remove('column-chart_loading');
    return data;
  }

  async fetchData(from, to) {
    const query = new URL(this.url, BACKEND_URL);
    query.searchParams.set('from', from);
    query.searchParams.set('to', to);
    return fetchJson(query);
  }
}
