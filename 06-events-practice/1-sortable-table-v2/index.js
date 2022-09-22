export default class SortableTable {
  constructor(headerConfig, { 
    data = [],
    sorted: {id, order} = {},
    isSortLocally = true,
  } = {}) {
    this.isSortLocally = isSortLocally;
    this.headerConfig = headerConfig;

    this.template = this.headerConfig[0].template ?? ((data = []) => '');

    this.cells = this.headerConfig.map(item => item.id);
    this.sortableCells = this.headerConfig.filter(item => item.sortable).map(item => item.id);

    this.paramOfSort = {
      field: id ?? this.sortableCells[0],
      order: order ?? 'asc'
    };
    this.data = this.isSortLocally ? this.getSortedLocallyDataOfTable(data) : data;
    this.render();
  }

  getSortedOnServerDataOfTable() {

  }

  getSortedLocallyDataOfTable(data = this.data) {
    const { field, order } = this.paramOfSort;
    const paramOfShift = order === 'asc' ? 1 : -1;

    const sortedArr = [...data].sort((firstItem, secondItem) => {
      firstItem = firstItem[field];
      secondItem = secondItem[field];

      const resultOfComparing = typeof firstItem === 'string' 
        ? firstItem.localeCompare(secondItem, ["ru", "en"], {caseFirst: 'upper', number: true})
        : firstItem - secondItem;
      return resultOfComparing * paramOfShift;
    });
    return sortedArr;
  }

  getElementArrowOfSort() {
    return (
      `<span class="sortable-table__sort-arrow">
        <span class="sortable-table__sort-arrow_${this.paramOfSort.order}"></span>
      </span>`
    );
  }
  getCellOfTableHeader({ title, sortable, id }) {
    const isSortedCell = id === this.paramOfSort.field;
    const [dataOrder, elementOfSort] = isSortedCell 
      ? [`data-order="${this.paramOfSort.order}"`, this.getElementArrowOfSort()]
      : ['', ''];
    return (
      `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" ${dataOrder}">
        <span>${title}</span>
        ${elementOfSort}
      </div>`
    );
  }

  getElementsOfTableHeader() {
    const elementsOfTableHeader = this.headerConfig.map(cellItem => this.getCellOfTableHeader(cellItem)).join('');
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

  render() {
    this.element = this.getTableElement();
    this.subElements = this.getSubElements();
    this.addEventListeners();
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

  sortByHeaderTitleHandler = (event) => {
    const sortableTarget = event.target.closest('div[data-sortable="true"]');
    if (!sortableTarget) {return;}
    let { dataset: 
      { 
        order = 'asc',
        id: field
      } 
    } = sortableTarget;
    if (this.paramOfSort.field === field) {
      order = this.paramOfSort.order === 'asc' ? 'desc' : 'asc'; 
    }
    this.isSortLocally = true; // havo to relocate it or remove ( this is extra code i think ) UPD -> dont remove
    this.paramOfSort = {field, order};
    this.sort();
  }

  addEventListeners() {
    const { header } = this.subElements;
    header.addEventListener('click', this.sortByHeaderTitleHandler);
  }

  removeEventListeners() {
    const { header } = this.subElements; // странно, но тесты падают, будто элемент уже удален UPD -> ассинхронная операция удаления похоже что
    header.removeEventListener('click', this.sortByHeaderTitleHandler);
  }

  sort() {
    
    this.data = this.isSortLocally ? this.getSortedLocallyDataOfTable() : this.getSortedOnServerDataOfTable();
    const {field, order} = this.paramOfSort; // maybe server will return not only data -> + sortedBy ... so paramofsort will changed

    const { body, header } = this.subElements; 
    body.innerHTML = this.getElementsOfTableBody();
    header.innerHTML = this.getElementsOfTableHeader();
    // const oldFieldOfSort = header.querySelector(`div[data-order]`);
    // const newFieldOfSort = header.querySelector(`div[data-id="${field}"]`);

    // oldFieldOfSort.removeAttribute('data-order');
    // oldFieldOfSort.removeChild(oldFieldOfSort.lastElementChild);

    // newFieldOfSort.setAttribute('data-order', order);
    // newFieldOfSort.insertAdjacentHTML('beforeend', this.getElementArrowOfSort());
    // console.log(header);
  }
  remove() {
    //this.removeEventListeners();
    this.element?.remove();
    this.element = null;
    this.subElements = {};
  }
  destroy() {
    this.remove();

  }
}

