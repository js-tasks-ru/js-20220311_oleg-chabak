export default class ColumnChart {
  // эти свойства тут, т.к. не зависят от входных параметров
  // к ним в дальнейшем можно так же обращаться через this.subElements,this.chartHeight
  subElements = {};
  chartHeight = 50;

  constructor({
    data = [],
    label = "",
    link = "",
    value = 0,
    formatHeading = (data) => data, // дабы не плодить if'ы внутри рендера
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;

    this.value = formatHeading(value);

    this.render();
  }

  // accessor properties
  // функции, которые используются для присвоения и получения значения,
  // но во внешнем коде они выглядят как обычные свойства объекта
  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${ this.chartHeight }">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
           <div data-element="header" class="column-chart__header">
             ${this.value}
           </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody()}
          </div>
        </div>
      </div>
    `;
  }
  // set template не задан

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove("column-chart_loading");
    }

    this.subElements = this.getSubElements();
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    // console.log({result});
    // {
    //   header: { link to <div data-element="header"... }
    //   body: { link to <div data-element="body"... }
    // }
    return result;
  }

  getColumnBody() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data
      .map(item => {
        const percent = ((item / maxValue) * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(
          item * scale
        )}" data-tooltip="${percent}%"></div>`;
      })
      .join("");
  }

  getLink() {
    return this.link
      ? `<a class="column-chart__link" href="${this.link}">View all</a>`
      : "";
  }

  update(data) {
    this.data = data;
    // Дабы не обращаться к медленному DOM, типа
    // document.querySelector('div[data-element="header"]')
    // сразу сохраним изменяемые части в переменной,
    // чтобы потом менять их тут и вставлять в DOM уже строкой
    this.subElements.body.innerHTML = this.getColumnBody(data);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
