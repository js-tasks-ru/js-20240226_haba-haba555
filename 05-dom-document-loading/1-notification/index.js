export default class NotificationMessage {
  static lastInstance;
  element;
  timerId;

  constructor(message = '', options = {}) {
    this.message = message;
    this.duration = options.duration || 2000;
    this.type = options.type || 'success';
    this.element = this.createNotification(this.createNotificationTemplate());
  }

  createNotification(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createNotificationTemplate() {
    return (`
      <div class="notification ${this.type}" style="--value:20s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `);
  }

  setNotificationTimer() {
    this.timerId = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  unsetNotificationTimer() {
    clearTimeout(this.timerId);
  }

  setNotificationLastInstance() {
    if (NotificationMessage.lastInstance) {
      NotificationMessage.lastInstance.destroy();
    }
    NotificationMessage.lastInstance = this;
  }

  show(wrapper) {
    this.setNotificationLastInstance();

    if (wrapper) {
      wrapper.appendChild(this.element);
    } else {
      document.body.appendChild(this.element);
    }

    this.setNotificationTimer();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.unsetNotificationTimer();
    this.remove();
  }
}
