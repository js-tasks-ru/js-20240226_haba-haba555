import {createElement} from "../../utils/dom/createElement.js";

class Tooltip {
  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
  }

  initialize () {
    this.createEventListeners();
  }

  createElementTemplate(content = '') {
    return createElement(`<div class="tooltip">${content}</div>`);
  }

  render(content = '') {
    this.element = this.createElementTemplate(content);
    document.body.appendChild(this.element);
  }

  calculateElementPosition(...coordinates) {
    this.element.style.left = coordinates[0] + 10 + 'px';
    this.element.style.top = coordinates[1] + 10 + 'px';
  }

  handlePointerOver = (event) => {
    if (event.target.dataset.tooltip !== undefined) {
      this.render(event.target.dataset.tooltip);
    }
  }

  handlePointerMove = (event) => {
    if (this.element) {
      this.calculateElementPosition(event.pageX, event.pageY);
    }
  }

  handlePointerOut = () => {
    if (this.element) {
      this.remove();
      this.element = null;
    }
  }

  createEventListeners() {
    document.addEventListener('pointerover', this.handlePointerOver);
    document.addEventListener('pointermove', this.handlePointerMove);
    document.addEventListener('pointerout', this.handlePointerOut);
  }

  destroyEventListeners() {
    document.removeEventListener('pointerover', this.handlePointerOver);
    document.removeEventListener('pointermove', this.handlePointerMove);
    document.removeEventListener('pointerout', this.handlePointerOut);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.destroyEventListeners();
  }
}

export default Tooltip;
