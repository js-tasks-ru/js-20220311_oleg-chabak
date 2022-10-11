class Tooltip {
  static instance = null;

  element = null;
  margin = 10;

  onPointerMove = (event) => {
    const {clientX, clientY} = event;
    this.element.style.left = `${clientX + this.margin}px`;
    this.element.style.top = `${clientY + this.margin}px`;
  }
  onPointerOver = (event) => {
    const targetElement = event.target.closest('[data-tooltip]');
    if (!targetElement) return;
    const text = targetElement.dataset.tooltip;
    const tooltipContent = targetElement.parentElement.closest('[data-tooltip]') ? `<b>${text}</b>` : text;
    this.render(tooltipContent);
    document.addEventListener('pointermove', this.onPointerMove);
  }
  onPointerOut = () => {
    this.remove();
    document.removeEventListener('pointermove', this.onPointerMove);
  }

  constructor() {
    // pattern singleton
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
  }

  initialize () {
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }
  render(content) {
    const element = document.createElement('div');
    element.innerHTML = `<div class="tooltip">${content}</div>`;
    this.element = element.firstElementChild;
    document.body.append(this.element);
  }
  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
  destroy() {
    document.removeEventListener('pointerover', this.onPointerMove);
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointermove', this.onPointerMove);
    this.remove();
    this.element = null;
  }
}

export default Tooltip;
