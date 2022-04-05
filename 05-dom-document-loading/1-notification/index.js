export default class NotificationMessage {
  static activeNotification = null;

  element = null;
  timerId = null;

  constructor(message = '', {type = 'error', duration = 1000} = {}) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.durationInSeconds = `${ duration / 1000 }s`;

    this.render();
  }

  get template() {
    return `
    <div class="notification ${this.type}" style="--value:${this.durationInSeconds}">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    </div>`;
  }

  remove() {
    clearTimeout(this.timerId);
    if (this.element) this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.activeNotification = null;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  show(domElement = document.body) {
    if (NotificationMessage.activeNotification) NotificationMessage.activeNotification.remove();
    domElement.append(this.element);
    this.timerId = setTimeout(()=> this.remove(), this.duration);
    NotificationMessage.activeNotification = this;
  }
}
