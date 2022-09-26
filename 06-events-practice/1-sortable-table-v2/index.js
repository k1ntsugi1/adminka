export default class SortableTable {
  constructor(headerConfig, { 
    data = [],
    sorted: {id, order} = {},
    isSortLocally = true,
  } = {}) {
    this.kindOfSort = isSortLocally ? 'locally' : 'remotely';
    this.headerConfig = headerConfig;

    this.template = this.headerConfig[0].template ?? ((data = []) => '');

    this.cells = this.headerConfig.map(item => item.id);

    this.paramOfSort = {
      field: id ?? this.headerConfig.find(cell => cell.sortable),
      order: order ?? 'asc'
    };
    this.data = this.kindOfSort === 'locally' ? this.getSortedDataLocally(data) : data;
    this.render();
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
    this.addEventListeners();
  }

  getSortedDataByUserParams(userParams) {
    /// 
  }

  async getSortedDataRemotely({ field, order } = this.paramOfSort) { // async operation
    throw new Error('I dont know url :(');
  }

  getSortedDataLocally(data = this.data, { field, order } = this.paramOfSort) {
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

  sortByUserParamsHandler = (event) => { 
    this.sort();
  }

  sortByHeaderTitleHandler = async (event) => { //<------here changed | without async status of tests - without error
    console.log(event.target)
    const sortableTarget = event.target.closest('div[data-sortable="true"]');
    if (!sortableTarget) {return;}
    let { dataset: 
      { 
        order = 'asc', // <----------here changed | with "desc" status of tests - without error  
        id: field
      } 
    } = sortableTarget;
    if (this.paramOfSort.field === field) {
      order = this.paramOfSort.order === 'asc' ? 'desc' : 'asc'; 
    }
    this.paramOfSort = { field, order };
    this.data = await this.kindOfSort === 'locally' 
      ? this.getSortedDataLocally() 
      : this.getSortedDataRemotely();// operation is async

    this.sort();
  }

  addEventListeners() {
    const { header } = this.subElements;
    // later i should add userEvent for userParamsOfSort
    header.addEventListener('pointerdown', this.sortByHeaderTitleHandler);
  }

  removeEventListeners() {
    const { header } = this.subElements; 
    header.removeEventListener('pointerdown', this.currentHandlerOfSort);
  }

  sort() {
    const { body, header } = this.subElements; 
    body.innerHTML = this.getElementsOfTableBody();
    header.innerHTML = this.getElementsOfTableHeader();
  }
  remove() {
    //this.removeEventListeners(); // странно, но тесты падают, будто элемент уже удален UPD -> ассинхронная операция удаления похоже что
    this.element = null;
    this.subElements = {};
  }
  destroy() {
    this.remove();

  }
}

