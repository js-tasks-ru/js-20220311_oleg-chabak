export default class SortableTable {
  // инкапсулированные св-ва инстанса (не зависят от входных параметров)
  element = null;
  subElements = {};
  defaultOrder = 'asc';
  isSortLocally = true;

  toggleOrder = (order) => {
    const orders = {
      asc: 'desc',
      desc: 'asc'
    };
    return orders[order];
  };

  sortHandler = (event) => {
    let targetCell = event.target.closest('[data-sortable="true"]');
    if (!targetCell) return;
    const id = targetCell.dataset.id;
    const order = this.toggleOrder(targetCell.dataset.order || this.defaultOrder);
    this.sort(id, order);
  }

  constructor(headerConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;

    this.init();
  }

  init() {
    this.render();
    this.initEventListeners();
  }

  render() {
    const { id, order } = this.sorted;
    const wrapper = document.createElement('div');
    const sortedData = this.sortData(id, order);
    wrapper.innerHTML = this.getTable(sortedData, this.sorted);
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.sortHandler);
  }

  getTable(data) {
    return `
      <div class="sortable-table">
          ${this.getTableHeader()}
          ${this.getTableBody(data)}
      </div>
    `.trim();
  }

  getTableHeader() {
    const cells = this.headerConfig.map((el) => {
      const order = el.id === this.sorted.id ? this.defaultOrder : '';
      return `
        <div class="sortable-table__cell" data-id="${el.id}" data-sortable="${el.sortable}" data-order="${order}">
            <span>${el.title}</span>
            <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>
        </div>`.trim();
    });
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${ cells.join('') }
      </div>`.trim();
  }

  getTableBody(data) {
    return `
     <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(data)}
    </div>`.trim();
  }

  getTableRows(data) {
    return data.map((item) => {
      return `<a href="/products/${item.id}" class="sortable-table__row">${this.getTableRow(item)}</a>`;
    }).join('');
  }

  getTableRow(item) {
    const cellsData = this.headerConfig.map(({id, template}) => {
      return {id, template};
    });
    const templateCells = cellsData.map(({id, template}) => {
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`;
    });
    return templateCells.join('');
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');
    for (const el of elements) {
      const subElementsName = el.dataset.element;
      result[subElementsName] = el;
    }
    return result;
  }

  sortData(id, order) {
    if (!id && !order) return this.data;
    const arr = [...this.data];
    const columnConfig = this.headerConfig.find((item) => item.id === id);
    const { sortType, customSorting } = columnConfig;
    const directions = {
      asc: 1,
      desc: -1,
    };
    const direction = directions[order];
    return arr.sort((a, b) => {
      switch (sortType) {
      // для сортировок, отличающихся от string и number
      // например сортировка по дате или статусу
      case 'custom':
        return direction * customSorting(a, b);
      case 'string':
        return direction * a[id].localeCompare(b[id], ['ru', 'en']);
      case 'number':
      default:
        return direction * (a[id] - b[id]);
      }
    });
  }

  sort (field, order) {
    if (this.isSortLocally) {
      this.sortOnClient(field, order);
    } else {
      this.sortOnServer(field, order);
    }
  }

  sortOnServer() {
    // ...
  }

  sortOnClient(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    // Remove sorting arrow from other columns
    allColumns.forEach((column) => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;
    this.subElements.body.innerHTML = this.getTableRows(sortedData);
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
