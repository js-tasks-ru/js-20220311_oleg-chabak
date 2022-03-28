export default class NotificationMessage {
  static elem = null;
  static timerId = null;

  constructor(message = '', {type = 'error', duration = 0} = {}) {
    this.message = message;
    this.type = type;
    this.duration = duration;
  }

  getTemplate() {
    return `
    <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    </div>`;
  }

  destroy() {
    clearTimeout(NotificationMessage.timerId);
    NotificationMessage.timerId = null;
    NotificationMessage.elem.remove();
    NotificationMessage.elem = null;
  }

  show() {
    NotificationMessage.elem && this.destroy();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
    document.body.append(wrapper);
    NotificationMessage.elem = wrapper;
    NotificationMessage.timerId = setTimeout(()=> this.destroy(), this.duration);
  }
}
