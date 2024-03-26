import {createElement} from "../../utils/dom/createElement.js";

export default class DoubleSlider {
  element;
  subElements = {};
  min;
  max;
  activeThumb;
  leftThumb;
  rightThumb;
  sliderProgress;

  constructor({
    min = 100,
    max = 200,
    selected = {},
    formatValue = value => value
  } = {}) {
    this.min = min;
    this.max = max;
    this.selected = {
      from: selected.from ?? min,
      to: selected.to ?? max
    };
    this.formatValue = formatValue;
    this.element = createElement(this.createTemplate());
    this.getSubElements();
    this.leftThumb = this.element.querySelector('.range-slider__thumb-left');
    this.rightThumb = this.element.querySelector('.range-slider__thumb-right');
    this.sliderProgress = this.element.querySelector('.range-slider__progress');
    this.createEventListeners();
  }

  createTemplate() {
    const leftPosition = this.getLeftPosition();
    const rightPosition = this.getRightPosition();
    return (`
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.selected.from)}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress" style="left: ${leftPosition}%; right: ${rightPosition}%"></span>
          <span class="range-slider__thumb-left" style="left: ${leftPosition}%"></span>
          <span class="range-slider__thumb-right" style="right: ${rightPosition}%"></span>
        </div>
        <span data-element="to">${this.formatValue(this.selected.to)}</span>
      </div>
    `);
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    for (const element of elements) {
      this.subElements[element.dataset.element] = element;
    }
  }

  getLeftPosition() {
    const range = this.max - this.min;
    const value = this.selected.from - this.min;
    return Math.round(value / range * 100);
  }

  getRightPosition() {
    const range = this.max - this.min;
    const value = this.max - this.selected.to;
    return Math.round(value / range * 100);
  }

  createEventListeners() {
    this.leftThumb.addEventListener('pointerdown', this.handlePointerDown);
    this.rightThumb.addEventListener('pointerdown', this.handlePointerDown);
  }

  handlePointerDown = (event) => {
    this.activeThumb = event.target;
    document.addEventListener('pointermove', this.handlePointerMove);
    document.addEventListener('pointerup', this.handlePointerUp);
  }

  processPointerMove = (event) => {
    const sliderInner = this.element.querySelector('.range-slider__inner');
    const { left, width } = sliderInner.getBoundingClientRect();

    const leftPosition = left;
    const rightPosition = left + width;
    const normalizedPointerPosition = Math.min(rightPosition, Math.max(leftPosition, event.clientX));
    const percentPointerPosition = Math.round((normalizedPointerPosition - leftPosition)
      / (rightPosition - leftPosition) * 100);

    return this.min + (this.max - this.min) * percentPointerPosition / 100;
  }

  handlePointerMove = (event) => {
    if (this.activeThumb === this.leftThumb) {
      this.selected.from = Math.min(this.selected.to, this.processPointerMove(event));
      this.subElements.from.textContent = this.formatValue(this.selected.from);
      this.leftThumb.style.left = this.getLeftPosition() + '%';
      this.sliderProgress.style.left = this.getLeftPosition() + '%';
    }
    if (this.activeThumb === this.rightThumb) {
      this.selected.to = Math.max(this.selected.from, this.processPointerMove(event));
      this.subElements.to.textContent = this.formatValue(this.selected.to);
      this.rightThumb.style.right = this.getRightPosition() + '%';
      this.sliderProgress.style.right = this.getRightPosition() + '%';
    }
  }

  dispatchCustomEvent = () => {
    const event = new CustomEvent('range-select', {
      detail: {
        from: this.selected.from,
        to: this.selected.to
      }
    });
    this.element.dispatchEvent(event);
  }

  handlePointerUp = () => {
    this.activeThumb = null;
    this.dispatchCustomEvent();
    document.removeEventListener('pointermove', this.handlePointerMove);
    document.removeEventListener('pointerup', this.handlePointerUp);
  }

  destroyEventListeners() {
    this.leftThumb.removeEventListener('pointerdown', this.handlePointerDown);
    this.rightThumb.removeEventListener('pointerdown', this.handlePointerDown);
  }


  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyEventListeners();
  }
}
