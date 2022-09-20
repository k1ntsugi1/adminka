export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.template = this.headerConfig[0].template ?? ((data = []) => '');

    this.cells = this.headerConfig.map(item => item.id);
    this.sortableCells = this.headerConfig.filter(item => item.sortable);

    this.render();
  }

  sortDataOfTable(data = []) {
    if (this.paramOfSort.order !== 'asc' && this.paramOfSort.order !== 'desc') {return data;}

    const paramOfShift = this.paramOfSort.order === 'asc' ? 1 : -1;

    const sortedArr = [...data].sort((firstItem, secondItem) => {
      firstItem = firstItem[this.paramOfSort.field];
      secondItem = secondItem[this.paramOfSort.field];
      const resultOfComparing = typeof firstItem === 'string' 
        ? firstItem.localeCompare(secondItem, ["ru", "en"], {caseFirst: 'upper', numeric: true})
        : firstItem - secondItem;
      return resultOfComparing * paramOfShift;
    });
    return sortedArr;
  }

  getCellOfTableHeader({ title, sortable, id }) {
    return (
      `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
      </div>`
    );
  }

  getElementsOfTableHeader() {
    const elementsOfTableHeader = this.headerConfig.map(this.getCellOfTableHeader).join('');
    return elementsOfTableHeader;
  }

  getCellOfTableBody(value, key) {
    return key === 'images' 
      ? this.template(value)
      : `<div class="sortable-table__cell">${value}</div>`;
  }

  getRowOfTableBody(rowItem) {
    return (
      `<a href="/products/${rowItem.id}" class="sortable-table__row">
        ${this.cells.map(key => this.getCellOfTableBody(rowItem[key], key)).join('')}
      </a>`
    );
  }

  getElementsOfTableBody() {
    const elementsOfTableBody = this.data.map((rowItem => this.getRowOfTableBody(rowItem))).join('');
    return elementsOfTableBody;
  }
  
  getTableElement() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('sortable-table');
    wrapper.innerHTML = (
      `<div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.getElementsOfTableHeader()}
      </div>
      <div data-element="body" class="sortable-table__body">
        ${this.getElementsOfTableBody()}
      </div>`
    );
    return wrapper;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('div[data-element]');
    for (let subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    return result;
  }

  render() {
    this.element = this.getTableElement();
    this.subElements = this.getSubElements();
  }

  sort(field, order) {
    this.paramOfSort = {field, order};
    this.data = this.sortDataOfTable(this.data);
    
    const { body, header } = this.subElements;
    body.innerHTML = this.getElementsOfTableBody(); 
    header.querySelector(`div[data-order]`)?.removeAttribute('data-order');
    header.querySelector(`div[data-id="${field}"]`).setAttribute('data-order', order);
  }
  remove() {
    this.element?.remove();
    this.element = null;
    this.subElements = {};
  }
  destroy() {
    this.remove();
  }
}

