import fetchJson from './utils/fetch-json.js';
import {createElement} from "../../utils/dom/createElement.js";
import {getSubElements} from "../../utils/dom/getSubElements.js";

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;
  subElements = {};
  defaultFormData = {
    title: '',
    description: '',
    quantity: 0,
    subcategory: '',
    status: 0,
    price: 0,
    discount: 0,
    images: []
  };
  product = {};
  statuses = [
    {
      label: 'Неактивен',
      value: 0,
    },
    {
      label: 'Активен',
      value: 1,
    },
  ];
  categories = [];

  constructor(productId) {
    this.productId = productId;
  }

  createInputField({
    label,
    name,
    required = '',
    type = 'text',
    placeholder = '',
    value = ''
  }) {
    return (`
       <label class="form-label">${label}</label>
       <input id="${name}" required="${required}" type="${type}" name="${name}" class="form-control" placeholder="${placeholder}" value='${value}' >
    `);
  }

  createTextareaField({
    label,
    name,
    required = '',
    dataElement = '',
    placeholder = '',
    value = ''
  }) {
    return (`
      <label class="form-label">${label}</label>
      <textarea id="${name}" required="${required}" class="form-control" name="${name}" data-element="${dataElement}" placeholder="${placeholder}">${value}</textarea>
    `);
  }

  createSelectField({ label, name, value = '', options = [] }) {
    const formattedOptions = options.map(option => `<option value="${option.value}" ${option.value === value ? 'selected' : ''}>${option.label}</option>`).join('');
    return (`
        <label class="form-label">${label}</label>
        <select id="${name}" class="form-control" name="${name}">
          ${formattedOptions}
        </select>
    `);
  }

  createImagePreview(images) {
    const formattedImages = images.map(image => (`
      <li class="products-edit__imagelist-item sortable-list__item" style="">
        <input type="hidden" name="url" value="${image.url}">
        <input type="hidden" name="source" value="${image.source}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
          <span>${image.source}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
      </li>
    `)
    ).join('');

    return (`
      <div data-element="imageListContainer">
        <ul class="sortable-list">
            ${formattedImages}
        </ul>
      </div>
    `);
  }

  createProductFormTemplate() {
    return (`
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
             ${this.createInputField({ label: 'Название товара', name: 'title', placeholder: 'Название товара', value: this.product.title })}
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
           ${this.createTextareaField({ label: 'Описание', name: 'description', dataElement: 'productDescription', placeholder: 'Описание товара', value: this.product.description })}
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            ${this.createImagePreview(this.product.images)}
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
           ${this.createSelectField({label: 'Категория', name: 'subcategory', options: this.categories, value: this.product.subcategory })}
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
             ${this.createInputField({ label: 'Цена ($)', name: 'price', type: 'number', placeholder: '100', value: this.product.price })}
            </fieldset>
            <fieldset>
             ${this.createInputField({ label: 'Скидка ($)', name: 'discount', type: 'number', placeholder: '0', value: this.product.discount })}
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
           ${this.createInputField({ label: 'Количество', name: 'quantity', type: 'number', placeholder: '1', value: this.product.quantity })}
          </div>
          <div class="form-group form-group__part-half">
           ${this.createSelectField({label: 'Статус', name: 'status', options: this.statuses, value: this.product.status })}
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `);
  }

  async prepareData() {
    await this.fetchCategories();
    await this.fetchProduct(this.productId);
  }

  async render () {
    await this.prepareData();
    this.element = createElement(this.createProductFormTemplate());
    this.subElements = getSubElements(this.element);
    return this.element;
  }

  async fetchProduct(id) {
    const url = new URL('api/rest/products', BACKEND_URL);
    if (id) {
      url.searchParams.set('id', id);
      const data = await fetchJson(url);
      this.product = data[0];
    } else {
      this.product = this.defaultFormData;
    }
  }

  formatCategories(categories) {
    const formattedCategories = [];
    for (const category of categories) {
      for (const child of category.subcategories) {
        formattedCategories.push({
          label: `${category.title} > ${child.title}`,
          value: child.id,
        });
      }
    }
    return formattedCategories;
  }

  async fetchCategories() {
    const url = new URL('api/rest/categories', BACKEND_URL);
    url.searchParams.set('_sort', 'weight');
    url.searchParams.set('_refs', 'subcategory');
    const data = await fetchJson(url);
    this.categories = this.formatCategories(data);
  }

  save = () => {
    const event = new Event('product-updated');
    this.element.dispatchEvent(event);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
