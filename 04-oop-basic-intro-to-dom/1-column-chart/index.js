export default class ColumnChart {
  constructor({data = [], label = '', value = 0, link, formatHeading}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.element = null;

    this.render(); // analog Component(arr).render()
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  getTemplate() {
    let result = '';
    result += `
      <div class="column-chart ${!this.data.length ? 'column-chart_loading' : ''}" style="--chart-height: 50">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.link ? '<a href="' + this.link + '" class="column-chart__link">View all</a>' : ''}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.formatHeading ? this.formatHeading(this.value) : this.value}
        </div>
        <div data-element="body" class="column-chart__chart">
        `;

    if (this.data.length) {
      this.getColumnProps(this.data).forEach(el => {
        result += `<div style="--value: ${el.value}" data-tooltip="${el.percent * 2}%"></div>`;
      });
    }

    result += `
          </div>
        </div>
      </div>
        `;
    return result;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
    document.getElementById(this.label).innerHTML = '';
    document.getElementById(this.label).append(wrapper);
  }

  update(data) {
    this.data = data;
    this.render();
  }
}
// 1:33:01
